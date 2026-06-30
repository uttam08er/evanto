const express = require("express");
const router = express.Router();
const multer = require("multer");
const { venueStorage } = require("../config/cloudinary");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getMyVenues,
  getFeaturedVenues,
} = require("../controllers/venueController");

const upload = multer({ storage: venueStorage });

router.get("/", getVenues);                   
router.get("/featured", getFeaturedVenues);    
router.get("/:id", getVenueById);            

router.get("/owner/my-venues", protect, authorize("owner", "admin"), getMyVenues);

router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 10), 
  createVenue
);

router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 10),
  updateVenue
);

router.delete("/:id", protect, authorize("owner", "admin"), deleteVenue);

module.exports = router;
