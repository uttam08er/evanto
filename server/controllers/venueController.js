const Venue = require("../models/Venue");
const User = require("../models/User");

const getVenues = async (req, res) => {
  try {
    const {
      city,
      venueType,
      category,
      minPrice,
      maxPrice,
      capacity,
      amenities,
      rating,
      search,
      sort,
      page = 1,      
      limit = 12,       
    } = req.query;

    const query = { status: "approved" };

    if (city) query.city = { $regex: city, $options: "i" };
    if (venueType) query.venueType = venueType;
    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.pricePerPlate = {};
      if (minPrice) query.pricePerPlate.$gte = Number(minPrice);
      if (maxPrice) query.pricePerPlate.$lte = Number(maxPrice); 
    }

    if (capacity) query.capacity = { $gte: Number(capacity) };

    if (rating) query.rating = { $gte: Number(rating) };

    if (amenities) {
      const amenitiesArray = amenities.split(","); 
      query.amenities = { $all: amenitiesArray }; 
    }

    if (search) {
      query.$text = { $search: search }; 
    }

    let sortQuery = {};
    switch (sort) {
      case "price_low":
        sortQuery = { pricePerPlate: 1 };  
        break;
      case "price_high":
        sortQuery = { pricePerPlate: -1 }; 
        break;
      case "rating":
        sortQuery = { rating: -1 };    
        break;
      case "newest":
        sortQuery = { createdAt: -1 }; 
        break;
      default:
        sortQuery = { featured: -1, createdAt: -1 }; 
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Venue.countDocuments(query);

    const venues = await Venue.find(query)
      .populate("ownerId", "name email phone") 
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: venues.length,     
      total,                    
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      venues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate("ownerId", "name email phone profileImage"); 

    if (!venue) {
      return res.status(404).json({ success: false, message: "Venue not found" });
    }

    res.status(200).json({ success: true, venue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVenue = async (req, res) => {
  try {
    const venueData = {
      ...req.body,                 
      ownerId: req.user._id,        
    };

    if (typeof req.body.amenities === "string") {
      venueData.amenities = JSON.parse(req.body.amenities);
    }

    if (req.files && req.files.length > 0) {
      venueData.images = req.files.map((file) => ({
        url: file.path,        
        public_id: file.filename, 
      }));
    }

    const venue = await Venue.create(venueData);

    res.status(201).json({
      success: true,
      message: "Venue created successfully! It will be visible after admin approval.",
      venue,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVenue = async (req, res) => {
  try {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ success: false, message: "Venue not found" });
    }

    if (venue.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this venue",
      });
    }

    const updateData = { ...req.body };

    if (typeof req.body.amenities === "string") {
      updateData.amenities = JSON.parse(req.body.amenities);
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
      updateData.images = [...(venue.images || []), ...newImages];
    }

    venue = await Venue.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, venue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ success: false, message: "Venue not found" });
    }

    if (venue.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await venue.deleteOne();

    res.status(200).json({ success: true, message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: venues.length, venues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeaturedVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ featured: true, status: "approved" })
      .limit(6)
      .sort({ rating: -1 });

    res.status(200).json({ success: true, venues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getMyVenues,
  getFeaturedVenues,
};
