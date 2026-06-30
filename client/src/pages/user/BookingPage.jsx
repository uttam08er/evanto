import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { venueAPI, bookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiCalendar, FiUsers, FiCreditCard, FiCheck } from "react-icons/fi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EVENT_TYPES = [
  "Wedding", "Birthday Party", "Corporate Event", "Anniversary",
  "Engagement", "Baby Shower", "Farewell Party", "Kitty Party",
  "Family Gathering", "Other",
];

const PaymentForm = ({ booking, onSuccess }) => {
  const stripe = useStripe();    
  const elements = useElements(); 
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return; 

    setProcessing(true);
    try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
        booking.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement), 
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await bookingAPI.confirmPayment(booking.bookingId, {
          paymentIntentId: paymentIntent.id,
        });
        toast.success("🎉 Booking Confirmed! Check your email.");
        onSuccess();
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <div className="p-4 border border-gray-300 rounded-xl mb-4">
        <CardElement options={{
          style: {
            base: { fontSize: "16px", color: "#374151", "::placeholder": { color: "#9CA3AF" } },
          },
        }} />
      </div>
      <p className="text-xs text-gray-500 mb-4 flex items-center">
        <span className="mr-1">🔒</span>
        Your payment is secured by Stripe. We never store your card details.
      </p>
      <button type="submit" disabled={processing || !stripe}
        className="btn-primary w-full py-3 text-base flex items-center justify-center space-x-2">
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FiCreditCard />
            <span>Pay ₹{booking.totalPrice?.toLocaleString()}</span>
          </>
        )}
      </button>
    </form>
  );
};

const BookingPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); 

  const [formData, setFormData] = useState({
    eventType: "",
    bookingDate: "",
    guestCount: "",
    specialRequest: "",
    includeDecoration: false,
  });

  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const { data } = await venueAPI.getById(venueId);
        setVenue(data.venue);
      } catch {
        toast.error("Venue not found");
        navigate("/venues");
      } finally {
        setLoading(false);
      }
    };
    loadVenue();
  }, [venueId]);

  const calculatePrice = () => {
    if (!venue || !formData.guestCount) return 0;
    const foodCost = parseInt(formData.guestCount) * venue.pricePerPlate;
    const decorCost = formData.includeDecoration ? venue.decorationPrice : 0;
    return foodCost + decorCost;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventType || !formData.bookingDate || !formData.guestCount) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep(2); 
  };

  const handleCreateBooking = async () => {
    try {
      const { data } = await bookingAPI.create({
        venueId,
        ...formData,
        guestCount: parseInt(formData.guestCount),
      });
      setBookingData({
        clientSecret: data.clientSecret,
        bookingId: data.booking._id,
        totalPrice: data.booking.totalPrice,
      });
      setStep(3); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!venue) return null;

  const totalPrice = calculatePrice();
  const minDate = new Date().toISOString().split("T")[0]; // Today's date

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* ---- STEP INDICATOR ---- */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: "Details" },
            { num: 2, label: "Review" },
            { num: 3, label: "Payment" },
            { num: 4, label: "Done" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${step >= s.num ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                {step > s.num ? <FiCheck /> : s.num}
              </div>
              <span className={`text-xs ml-1 hidden sm:block ${step >= s.num ? "text-primary-600 font-medium" : "text-gray-400"}`}>
                {s.label}
              </span>
              {i < 3 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${step > s.num ? "bg-primary-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 flex items-center space-x-4">
          <img src={venue.images?.[0]?.url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200"}
            alt={venue.venueName} className="w-20 h-16 object-cover rounded-xl" />
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{venue.venueName}</h2>
            <p className="text-gray-500 text-sm">{venue.city}, {venue.state}</p>
            <p className="text-primary-600 font-semibold">₹{venue.pricePerPlate}/plate</p>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Event Details</h2>
            <form onSubmit={handleFormSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="input-field" required>
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiCalendar className="inline mr-1" />
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input type="date" min={minDate} value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiUsers className="inline mr-1" />
                  Number of Guests <span className="text-red-500">*</span>
                </label>
                <input type="number" min="1" max={venue.capacity} placeholder={`Max ${venue.capacity} guests`}
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="input-field" required />
              </div>

              {venue.decorationPrice > 0 && (
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div>
                    <p className="font-medium text-gray-800">Add Decoration Service</p>
                    <p className="text-sm text-gray-500">Professional decoration by the venue</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-primary-600">₹{venue.decorationPrice}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={formData.includeDecoration}
                        onChange={(e) => setFormData({ ...formData, includeDecoration: e.target.checked })}
                        className="sr-only" />
                      <div className={`w-11 h-6 rounded-full transition-colors ${formData.includeDecoration ? "bg-primary-600" : "bg-gray-300"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5 ${formData.includeDecoration ? "translate-x-5" : ""}`} />
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  placeholder="Any special requirements, dietary needs, setup preferences..."
                  rows={3} className="input-field resize-none" maxLength={500} />
              </div>

              {formData.guestCount && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Price Estimate</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>{formData.guestCount} guests × ₹{venue.pricePerPlate}</span>
                      <span>₹{(formData.guestCount * venue.pricePerPlate).toLocaleString()}</span>
                    </div>
                    {formData.includeDecoration && (
                      <div className="flex justify-between text-gray-600">
                        <span>Decoration</span>
                        <span>₹{venue.decorationPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-primary-600">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary w-full py-3 text-base">
                Continue to Review →
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
            <div className="space-y-4">
              {[
                { label: "Event Type", value: formData.eventType },
                { label: "Date", value: new Date(formData.bookingDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                { label: "Guests", value: `${formData.guestCount} people` },
                { label: "Decoration", value: formData.includeDecoration ? "Yes (included)" : "No" },
                formData.specialRequest && { label: "Special Request", value: formData.specialRequest },
              ].filter(Boolean).map((item) => (
                <div key={item.label} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-sm">{item.label}</span>
                  <span className="font-medium text-gray-800 text-sm text-right max-w-xs">{item.value}</span>
                </div>
              ))}

              <div className="bg-primary-50 rounded-xl p-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                  <span className="font-bold text-primary-600 text-2xl">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  ← Edit Details
                </button>
                <button onClick={handleCreateBooking} className="btn-primary flex-1 py-3">
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && bookingData && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your card details to complete the booking</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount to Pay</span>
                <span className="font-bold text-xl text-primary-600">₹{bookingData.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret: bookingData.clientSecret }}>
              <PaymentForm booking={bookingData} onSuccess={() => setStep(4)} />
            </Elements>

            <p className="text-xs text-center text-gray-400 mt-4">
              Test card: 4242 4242 4242 4242 | Any future date | Any 3-digit CVV
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-gray-500 mb-2">Your booking at <strong>{venue.venueName}</strong> is confirmed.</p>
            <p className="text-gray-500 mb-8 text-sm">A confirmation email has been sent to {user?.email}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate("/my-bookings")} className="btn-primary">
                View My Bookings
              </button>
              <button onClick={() => navigate("/")} className="btn-secondary">
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
