const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 

const Booking = require("../models/Booking");
const Venue = require("../models/Venue");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const { sendBookingConfirmationEmail } = require("../services/emailService");

const createBooking = async (req, res) => {
  try {
    const {
      venueId,
      eventType,
      bookingDate,
      guestCount,
      specialRequest,
      includeDecoration,
    } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ success: false, message: "Venue not found" });
    }

    if (venue.status !== "approved") {
      return res.status(400).json({ success: false, message: "Venue is not available" });
    }

    const requestedDate = new Date(bookingDate);
    const isDateBooked = venue.bookedDates.some(
      (date) => date.toDateString() === requestedDate.toDateString()
    );
    if (isDateBooked) {
      return res.status(400).json({
        success: false,
        message: "This date is already booked. Please choose another date.",
      });
    }

    const foodCost = guestCount * venue.pricePerPlate;
    const decorCost = includeDecoration ? venue.decorationPrice : 0;
    const totalPrice = foodCost + decorCost;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,   
      currency: "inr",            
      metadata: {
        venueId: venueId,
        userId: req.user._id.toString(),
        venueName: venue.venueName,
      },
    });

    const booking = await Booking.create({
      userId: req.user._id,
      venueId,
      eventType,
      bookingDate,
      guestCount,
      specialRequest,
      includeDecoration,
      pricePerPlate: venue.pricePerPlate,
      decorationPrice: decorCost,
      totalPrice,
      paymentStatus: "pending",
      bookingStatus: "pending",
      paymentIntentId: paymentIntent.id, 
    });

    res.status(201).json({
      success: true,
      booking,
      clientSecret: paymentIntent.client_secret, 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("venueId")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";
    booking.transactionId = paymentIntentId;
    await booking.save();

    await Venue.findByIdAndUpdate(booking.venueId._id, {
      $push: { bookedDates: booking.bookingDate }, 
    });

    await Payment.create({
      userId: req.user._id,
      bookingId: booking._id,
      amount: booking.totalPrice,
      stripePaymentIntentId: paymentIntentId,
      status: "succeeded",
    });

    await Notification.create({
      userId: req.user._id,
      title: "Booking Confirmed! 🎉",
      message: `Your booking at ${booking.venueId.venueName} for ${booking.eventType} has been confirmed.`,
      type: "booking",
      link: `/bookings/${booking._id}`,
    });

    await Notification.create({
      userId: booking.venueId.ownerId,
      title: "New Booking Received!",
      message: `You have a new booking at ${booking.venueId.venueName} for ${booking.eventType} on ${new Date(booking.bookingDate).toDateString()}.`,
      type: "booking",
      link: `/owner/bookings/${booking._id}`,
    });

    await sendBookingConfirmationEmail(booking.userId.email, booking.userId.name, {
      venueName: booking.venueId.venueName,
      eventType: booking.eventType,
      bookingDate: booking.bookingDate,
      guestCount: booking.guestCount,
      totalPrice: booking.totalPrice,
    });

    res.status(200).json({
      success: true,
      message: "Payment confirmed and booking is set!",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("venueId", "venueName images city address")
      .sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const ownerVenueIds = await Venue.find({ ownerId: req.user._id }).select("_id");
    const venueIds = ownerVenueIds.map((v) => v._id);

    const bookings = await Booking.find({ venueId: { $in: venueIds } }) // $in = any of these IDs
      .populate("venueId", "venueName city")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("venueId", "venueName ownerId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    if (booking.paymentStatus === "paid" && booking.transactionId) {
      const refund = await stripe.refunds.create({
        payment_intent: booking.transactionId,
      });

      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: booking.transactionId },
        { status: "refunded", refundedAt: Date.now(), refundId: refund.id }
      );

      booking.paymentStatus = "refunded";
    }

    booking.bookingStatus = "cancelled";
    booking.cancellationReason = req.body.reason || "Cancelled by user";
    await booking.save();

    await Venue.findByIdAndUpdate(booking.venueId._id, {
      $pull: { bookedDates: booking.bookingDate }, 
    });

    await Notification.create({
      userId: booking.userId,
      title: "Booking Cancelled",
      message: `Your booking at ${booking.venueId.venueName} has been cancelled. Refund will be processed in 5-7 days.`,
      type: "cancellation",
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully. Refund initiated.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("venueId", "venueName images city address ownerId")
      .populate("userId", "name email phone");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const isOwner = booking.venueId.ownerId.toString() === req.user._id.toString();
    const isUser = booking.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isUser && !isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  confirmPayment,
  getMyBookings,
  getOwnerBookings,
  cancelBooking,
  getBookingById,
};
