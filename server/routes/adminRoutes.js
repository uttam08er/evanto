const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAnalytics, getAllUsers, toggleUserBlock,
  updateVenueStatus, getAllVenues, getAllBookings,
} = require("../controllers/adminController");

router.use(protect, authorize("admin"));

router.get("/analytics", getAnalytics);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle-block", toggleUserBlock);
router.get("/venues", getAllVenues);
router.put("/venues/:id/status", updateVenueStatus);
router.get("/bookings", getAllBookings);

module.exports = router;
