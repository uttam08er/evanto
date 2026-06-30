const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { toggleWishlist, getWishlist } = require("../controllers/wishlistController");

router.get("/", protect, getWishlist);
router.post("/:venueId", protect, toggleWishlist);

module.exports = router;
