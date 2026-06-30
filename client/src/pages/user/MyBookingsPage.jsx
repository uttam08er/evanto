import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { bookingAPI } from "../../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FiCalendar, FiUsers, FiMapPin, FiSearch } from "react-icons/fi";

const STATUS_BADGE={pending:"bg-amber-100 text-amber-700 border-amber-200",confirmed:"bg-emerald-100 text-emerald-700 border-emerald-200",cancelled:"bg-rose-100 text-rose-700 border-rose-200",completed:"bg-blue-100 text-blue-700 border-blue-200"};
const PAY_BADGE={pending:"bg-gray-100 text-gray-500",paid:"bg-emerald-100 text-emerald-600",refunded:"bg-orange-100 text-orange-600",failed:"bg-rose-100 text-rose-600"};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(()=>{
    bookingAPI.getMyBookings().then(r=>setBookings(r.data.bookings)).catch(()=>toast.error("Failed")).finally(()=>setLoading(false));
  },[]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking? A refund will be initiated if payment was made.")) return;
    setCancellingId(id);
    try {
      await bookingAPI.cancel(id,"Cancelled by user");
      setBookings(b=>b.map(x=>x._id===id?{...x,bookingStatus:"cancelled"}:x));
      toast.success("Booking cancelled. Refund will be processed in 5–7 days.");
    } catch (err) { toast.error(err.response?.data?.message||"Failed"); } finally { setCancellingId(null); }
  };

  const filtered = filter==="all"?bookings:bookings.filter(b=>b.bookingStatus===filter);

  if (loading) return <LoadingSpinner/>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-0.5">{bookings.length} booking{bookings.length!==1?"s":""} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 w-fit">
        {["all","pending","confirmed","cancelled","completed"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
              ${filter===s?"bg-primary-600 text-white shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
            {s}
            <span className="ml-1.5 text-xs opacity-70">
              ({s==="all"?bookings.length:bookings.filter(b=>b.bookingStatus===s).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-5xl mb-4">📅</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings here</h3>
          <p className="text-gray-500 text-sm mb-5">Start planning your next event!</p>
          <a href="/venues" className="btn-primary text-sm px-5 py-2.5">Browse Venues</a>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b,i)=>(
            <motion.div key={b._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-44 h-40 flex-shrink-0">
                  <img src={b.venueId?.images?.[0]?.url||"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300"}
                    alt="" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${STATUS_BADGE[b.bookingStatus]}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{b.venueId?.venueName}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <FiMapPin size={12}/>{b.venueId?.city}, {b.venueId?.state}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-600">₹{b.totalPrice?.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAY_BADGE[b.paymentStatus]}`}>{b.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400 mb-0.5">Event</p>
                      <p className="font-semibold text-gray-800 text-xs">{b.eventType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><FiCalendar size={9}/>Date</p>
                      <p className="font-semibold text-gray-800 text-xs">{new Date(b.bookingDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><FiUsers size={9}/>Guests</p>
                      <p className="font-semibold text-gray-800 text-xs">{b.guestCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400 mb-0.5">Decoration</p>
                      <p className="font-semibold text-gray-800 text-xs">{b.includeDecoration?"✅ Included":"Not included"}</p>
                    </div>
                  </div>

                  {b.specialRequest&&(
                    <div className="bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 text-xs text-violet-700 mb-3">
                      <span className="font-semibold">Note: </span>{b.specialRequest}
                    </div>
                  )}

                  {["pending","confirmed"].includes(b.bookingStatus)&&new Date(b.bookingDate)>new Date()&&(
                    <button onClick={()=>handleCancel(b._id)} disabled={cancellingId===b._id}
                      className="text-xs text-rose-600 border border-rose-200 px-4 py-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50 font-medium">
                      {cancellingId===b._id?"Cancelling...":"Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
