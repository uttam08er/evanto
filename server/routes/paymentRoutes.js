const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");

router.get("/history", protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate("bookingId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
