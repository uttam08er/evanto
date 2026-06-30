const express = require("express");
const router = express.Router(); 

const {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);           
router.get("/verify-email/:token", verifyEmail);  
router.post("/login", loginUser);                  
router.post("/forgot-password", forgotPassword);  
router.put("/reset-password/:token", resetPassword);

router.post("/logout", protect, logoutUser);     
router.get("/me", protect, getMe);              
router.put("/change-password", protect, changePassword); 

module.exports = router;
