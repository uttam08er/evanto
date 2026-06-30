const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createBooking,
  confirmPayment,
  getMyBookings,
  getOwnerBookings,
  cancelBooking,
  getBookingById,
} = require("../controllers/bookingController");

router.post("/", protect, authorize("user"), createBooking);
router.put("/:id/confirm-payment", protect, confirmPayment);
router.get("/my-bookings", protect, getMyBookings);
router.get("/owner-bookings", protect, authorize("owner", "admin"), getOwnerBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id", protect, getBookingById);

module.exports = router;
