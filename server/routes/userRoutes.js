const express = require("express");
const router = express.Router();
const multer = require("multer");
const { profileStorage } = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const upload = multer({ storage: profileStorage });

router.get("/profile", protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.put("/profile", protect, upload.single("profileImage"), async (req, res) => {
  try {
    const updates = { name: req.body.name, phone: req.body.phone };
    if (req.file) updates.profileImage = req.file.path; // Cloudinary URL

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
