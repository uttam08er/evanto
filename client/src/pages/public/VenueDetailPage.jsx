import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin, FiStar, FiUsers, FiHeart, FiCheck, FiCalendar, FiShare2
} from "react-icons/fi";
import { venueAPI, reviewAPI, wishlistAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StarRating from "../../components/common/StarRating";

const AMENITY_ICONS = {
  Parking: "🚗", AC: "❄️", DJ: "🎵", Decoration: "🎊", Catering: "🍽️",
  Photography: "📸", WiFi: "📶", "Swimming Pool": "🏊", "Outdoor Area": "🌳", Stage: "🎤",
};

const VenueDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0); 
  const [inWishlist, setInWishlist] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [venueRes, reviewRes] = await Promise.all([
          venueAPI.getById(id),
          reviewAPI.getByVenue(id),
        ]);
        setVenue(venueRes.data.venue);
        setReviews(reviewRes.data.reviews);
      } catch (error) {
        toast.error("Venue not found");
        navigate("/venues");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) { toast.info("Please login to save venues"); return; }
    try {
      await wishlistAPI.toggle(id);
      setInWishlist(!inWishlist);
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch { toast.error("Failed to update wishlist"); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.info("Please login to write a review"); return; }
    if (reviewRating === 0) { toast.error("Please select a rating"); return; }
    if (!reviewComment.trim()) { toast.error("Please write a comment"); return; }

    setSubmittingReview(true);
    try {
      const { data } = await reviewAPI.add(id, { rating: reviewRating, comment: reviewComment });
      setReviews([data.review, ...reviews]);
      setReviewRating(0);
      setReviewComment("");
      toast.success("Review submitted!");
      const venueRes = await venueAPI.getById(id);
      setVenue(venueRes.data.venue);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!venue) return null;

  const images = venue.images?.length > 0
    ? venue.images
    : [{ url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800" }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ---- BREADCRUMB ---- */}
      <nav className="text-sm text-gray-500 mb-4">
        <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
        <span className="mx-2">/</span>
        <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate("/venues")}>Venues</span>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{venue.venueName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96">
              <img src={images[activeImage]?.url} alt={venue.venueName}
                className="w-full h-full object-cover" />
              {venue.featured && (
                <span className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all
                      ${activeImage === i ? "border-primary-600" : "border-transparent hover:border-gray-300"}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{venue.venueName}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <FiMapPin className="mr-1" />
                  <span>{venue.address}, {venue.city}, {venue.state} - {venue.pincode}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleShare}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FiShare2 />
                </button>
                <button onClick={handleWishlistToggle}
                  className={`p-2 border rounded-lg transition-colors ${inWishlist ? "bg-red-50 border-red-300 text-red-500" : "border-gray-300 hover:bg-gray-50"}`}>
                  <FiHeart className={inWishlist ? "fill-current" : ""} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full font-medium">
                {venue.venueType}
              </span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                {venue.category}
              </span>
              <span className="flex items-center bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-full">
                <FiStar className="fill-current mr-1" size={12} />
                {venue.rating > 0 ? venue.rating.toFixed(1) : "New"} ({venue.totalReviews} reviews)
              </span>
              <span className="flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                <FiUsers className="mr-1" size={12} />
                Up to {venue.capacity} guests
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Venue</h2>
            <p className="text-gray-600 leading-relaxed">{venue.description}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {venue.amenities?.map((amenity) => (
                <div key={amenity}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">{AMENITY_ICONS[amenity] || "✅"}</span>
                  <span className="text-sm font-medium text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hosted By</h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {venue.ownerId?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{venue.ownerId?.name}</p>
                <p className="text-gray-500 text-sm">{venue.ownerId?.email}</p>
                {venue.ownerId?.phone && (
                  <p className="text-gray-500 text-sm">📞 {venue.ownerId.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Reviews ({reviews.length})
            </h2>

            {isAuthenticated && user?.role === "user" && (
              <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-3">Write a Review</h3>
                <div className="mb-3">
                  <label className="text-sm text-gray-600 mb-1 block">Your Rating</label>
                  <StarRating rating={reviewRating} onChange={setReviewRating} size="lg" />
                </div>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience at this venue..."
                  rows={3} maxLength={500}
                  className="input-field resize-none mb-3" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{reviewComment.length}/500</span>
                  <button type="submit" disabled={submittingReview} className="btn-primary text-sm py-2 px-5">
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-5 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {review.userId?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{review.userId?.name}</p>
                          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-gray-600 text-sm mt-2 ml-12">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Venue</h3>

            {/* Pricing */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price per plate</span>
                <span className="font-semibold text-lg">₹{venue.pricePerPlate}</span>
              </div>
              {venue.decorationPrice > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Decoration (optional)</span>
                  <span className="font-semibold">₹{venue.decorationPrice}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Max capacity</span>
                <span className="flex items-center"><FiUsers className="mr-1" />{venue.capacity} guests</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-sm font-medium text-gray-700 mb-1">💡 Example Calculation</p>
              <p className="text-xs text-gray-500">
                100 guests × ₹{venue.pricePerPlate} = ₹{(100 * venue.pricePerPlate).toLocaleString()}
              </p>
            </div>

            {isAuthenticated ? (
              user?.role === "user" ? (
                <button
                  onClick={() => navigate(`/book/${venue._id}`)}
                  className="btn-primary w-full text-center py-3 text-base font-semibold"
                >
                  <FiCalendar className="inline mr-2" />
                  Book Now
                </button>
              ) : (
                <p className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  {user?.role === "owner" ? "Owners cannot book venues. Switch to a user account." : "Admins cannot make bookings."}
                </p>
              )
            ) : (
              <button
                onClick={() => navigate("/login", { state: { from: { pathname: `/venues/${id}` } } })}
                className="btn-primary w-full py-3 text-base font-semibold"
              >
                Login to Book
              </button>
            )}

            <div className="mt-5 space-y-2">
              {["Free cancellation policy", "Secure online payment", "Instant confirmation"].map((item) => (
                <div key={item} className="flex items-center text-xs text-gray-500">
                  <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
