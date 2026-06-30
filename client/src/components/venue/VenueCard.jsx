import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiHeart, FiUsers } from "react-icons/fi";
import { wishlistAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const VenueCard = ({ venue, inWishlist = false, onWishlistChange }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(inWishlist);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to save venues to wishlist");
      return;
    }

    setLikeLoading(true);
    try {
      await wishlistAPI.toggle(venue._id);
      setLiked(!liked);
      if (onWishlistChange) onWishlistChange(venue._id); 
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setLikeLoading(false);
    }
  };

  const imageUrl = venue.images?.[0]?.url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600";

  return (
    <motion.div
      whileHover={{ y: -4 }} 
      className="card hover:shadow-xl transition-shadow duration-300 group"
    >
      <Link to={`/venues/${venue._id}`}>
        <div className="relative overflow-hidden h-52">
          <img
            src={imageUrl}
            alt={venue.venueName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {venue.featured && (
            <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}

          <span className="absolute top-3 right-12 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {venue.venueType}
          </span>

          <button
            onClick={handleWishlistToggle}
            disabled={likeLoading}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors
              ${liked ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"}`}
          >
            <FiHeart size={16} className={liked ? "fill-current" : ""} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg truncate mb-1">
            {venue.venueName}
          </h3>

          <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">
            {venue.category}
          </span>

          <div className="flex items-center text-gray-500 text-sm mt-2">
            <FiMapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{venue.city}, {venue.state}</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-sm">
              <FiStar className="text-yellow-400 fill-current mr-1" size={14} />
              <span className="font-medium">{venue.rating > 0 ? venue.rating.toFixed(1) : "New"}</span>
              {venue.totalReviews > 0 && (
                <span className="text-gray-400 ml-1">({venue.totalReviews})</span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FiUsers size={14} className="mr-1" />
              <span>Up to {venue.capacity}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-primary-600">₹{venue.pricePerPlate}</span>
              <span className="text-gray-500 text-sm"> /plate</span>
            </div>
            <span className="text-sm text-primary-600 font-medium group-hover:underline">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VenueCard;
