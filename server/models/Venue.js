const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",                          
      required: [true, "Owner ID is required"],
    },

    venueName: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
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

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    venueType: {
      type: String,
      required: [true, "Venue type is required"],
      enum: ["Hotel", "Restaurant", "Banquet Hall", "Resort", "Party Hall"],
    },

    address: { type: String, required: [true, "Address is required"] },
    city: { type: String, required: [true, "City is required"], trim: true },
    state: { type: String, required: [true, "State is required"], trim: true },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^[0-9]{6}$/, "Pincode must be 6 digits"],
    },

    latitude: { type: Number },
    longitude: { type: Number },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [10, "Capacity must be at least 10"],
    },

    pricePerPlate: {
      type: Number,
      required: [true, "Price per plate is required"],
      min: [0, "Price cannot be negative"],
    },

    decorationPrice: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    amenities: [
      {
        type: String,
        enum: [
          "Parking",
          "AC",
          "DJ",
          "Decoration",
          "Catering",
          "Photography",
          "WiFi",
          "Swimming Pool",
          "Outdoor Area",
          "Stage",
        ],
      },
    ],

    images: [
      {
        url: { type: String, required: true },  
        public_id: { type: String },           
      },
    ],

    bookedDates: [
      {
        type: Date,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, 
  }
);

venueSchema.index({ city: 1 });      
venueSchema.index({ venueType: 1 });
venueSchema.index({ pricePerPlate: 1 });
venueSchema.index({ rating: -1 });      
venueSchema.index({ status: 1 });
venueSchema.index({ venueName: "text", description: "text", city: "text" });

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
