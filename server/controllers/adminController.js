const User = require("../models/User");
const Venue = require("../models/Venue");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalVenues,
      totalBookings,
      revenueResult,
      recentBookings,
      pendingVenues,
      monthlyBookings,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Venue.countDocuments({ status: "approved" }),
      Booking.countDocuments({ bookingStatus: "confirmed" }),
      Payment.aggregate([
        { $match: { status: "succeeded" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Booking.find()
        .populate("userId", "name email")
        .populate("venueId", "venueName")
        .sort({ createdAt: -1 })
        .limit(5),
      Venue.countDocuments({ status: "pending" }),
      Booking.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            count: { $sum: 1 },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalVenues,
        totalBookings,
        totalRevenue,
        pendingVenues,
        recentBookings,
        monthlyBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVenueStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { status, featured: status === "approved" ? req.body.featured : false },
      { new: true }
    );

    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });

    res.status(200).json({ success: true, message: `Venue ${status}`, venue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllVenues = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const venues = await Venue.find(query)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, venues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("venueId", "venueName city")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics, getAllUsers, toggleUserBlock, updateVenueStatus, getAllVenues, getAllBookings };
