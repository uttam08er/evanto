const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addReview, getVenueReviews, updateReview, deleteReview } = require("../controllers/reviewController");

router.get("/:venueId", getVenueReviews);
router.post("/:venueId", protect, addReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
