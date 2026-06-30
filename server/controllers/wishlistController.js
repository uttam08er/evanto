const Wishlist = require("../models/Wishlist");

const toggleWishlist = async (req, res) => {
  try {
    const { venueId } = req.params;
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, venues: [venueId] });
      return res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
    }

    const isInWishlist = wishlist.venues.includes(venueId);

    if (isInWishlist) {
      wishlist.venues = wishlist.venues.filter((id) => id.toString() !== venueId);
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Removed from wishlist", wishlist });
    } else {
      wishlist.venues.push(venueId);
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate("venues"); 

    res.status(200).json({ success: true, wishlist: wishlist || { venues: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { toggleWishlist, getWishlist };
