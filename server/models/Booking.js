const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue ID is required"],
    },

    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: [
        "Birthday Party",
        "Anniversary",
        "Wedding",
        "Corporate Event",
        "Engagement",
        "Baby Shower",
        "Farewell Party",
        "Kitty Party",
        "Family Gathering",
        "Other",
      ],
    },

    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },

    guestCount: {
      type: Number,
      required: [true, "Guest count is required"],
      min: [1, "At least 1 guest required"],
    },

    specialRequest: {
      type: String,
      maxlength: [500, "Special request cannot exceed 500 characters"],
      default: "",
    },

    pricePerPlate: { type: Number, required: true },       // Per person cost
    decorationPrice: { type: Number, default: 0 },         // If decoration selected
    totalPrice: { type: Number, required: true },          // Total amount to pay

    includeDecoration: {
      type: Boolean,
      default: false,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending", 
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending", 
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentIntentId: {
      type: String,
      default: "",
    },

    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ venueId: 1 });
bookingSchema.index({ bookingDate: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
