const Review = require("../models/Review");
const Venue = require("../models/Venue");

const updateVenueRating = async (venueId) => {
  const stats = await Review.aggregate([
    { $match: { venueId: venueId } }, 
    {
      $group: {
        _id: "$venueId",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },     
      },
    },
  ]);

  if (stats.length > 0) {
    await Venue.findByIdAndUpdate(venueId, {
      rating: Math.round(stats[0].avgRating * 10) / 10, 
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await Venue.findByIdAndUpdate(venueId, { rating: 0, totalReviews: 0 });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { venueId } = req.params;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });

    const existingReview = await Review.findOne({ userId: req.user._id, venueId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this venue" });
    }

    const review = await Review.create({
      userId: req.user._id,
      venueId,
      rating,
      comment,
    });

    await updateVenueRating(venue._id);

    await review.populate("userId", "name profileImage");

    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already reviewed this venue" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVenueReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ venueId: req.params.venueId })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate("userId", "name profileImage");

    await updateVenueRating(review.venueId);

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    const isAuthor = review.userId.toString() === req.user._id.toString();
    if (!isAuthor && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const venueId = review.venueId;
    await review.deleteOne();
    await updateVenueRating(venueId);

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addReview, getVenueReviews, updateReview, deleteReview };
