import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { bookingAPI } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FiSearch, FiCalendar, FiUsers, FiDollarSign, FiMail, FiPhone } from "react-icons/fi";

const STATUS_BADGE={pending:"bg-amber-100 text-amber-700 border-amber-200",confirmed:"bg-emerald-100 text-emerald-700 border-emerald-200",cancelled:"bg-rose-100 text-rose-700 border-rose-200",completed:"bg-blue-100 text-blue-700 border-blue-200"};

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(()=>{
    bookingAPI.getOwnerBookings().then(r=>setBookings(r.data.bookings)).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const filtered = bookings.filter(b=>
    (filter==="all"||b.bookingStatus===filter)&&
    (b.userId?.name?.toLowerCase().includes(search.toLowerCase())||b.venueId?.venueName?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue=bookings.filter(b=>b.paymentStatus==="paid").reduce((s,b)=>s+(b.totalPrice||0),0);

  if (loading) return <LoadingSpinner/>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">Total revenue earned: <strong className="text-blue-600">₹{totalRevenue.toLocaleString()}</strong></p>
      </div>

      {/* Summary tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {["all","pending","confirmed","cancelled","completed"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`rounded-2xl p-3 text-center border transition-all
              ${filter===s?"border-blue-400 bg-blue-50":"border-gray-100 bg-white hover:border-gray-200"}`}>
            <p className="text-xl font-bold text-gray-900">{s==="all"?bookings.length:bookings.filter(b=>b.bookingStatus===s).length}</p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
          <input type="text" placeholder="Search by customer name or venue..." value={search} onChange={e=>setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm w-full"/>
        </div>
      </div>

      {/* Booking cards */}
      {filtered.length===0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-400">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b,i)=>(
            <motion.div key={b._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {b.userId?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{b.userId?.name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-0.5">
                      {b.userId?.email&&<span className="flex items-center gap-1"><FiMail size={10}/>{b.userId.email}</span>}
                      {b.userId?.phone&&<span className="flex items-center gap-1"><FiPhone size={10}/>{b.userId.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${STATUS_BADGE[b.bookingStatus]}`}>
                    {b.bookingStatus.charAt(0).toUpperCase()+b.bookingStatus.slice(1)}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${b.paymentStatus==="paid"?"bg-emerald-50 text-emerald-600 border-emerald-200":"bg-gray-50 text-gray-500 border-gray-200"}`}>
                    {b.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Venue: {b.venueId?.venueName}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Event Type</p>
                    <p className="font-semibold text-gray-800">{b.eventType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><FiCalendar size={10}/>Date</p>
                    <p className="font-semibold text-gray-800">{new Date(b.bookingDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><FiUsers size={10}/>Guests</p>
                    <p className="font-semibold text-gray-800">{b.guestCount} people</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><FiDollarSign size={10}/>Total</p>
                    <p className="font-bold text-blue-600 text-base">₹{b.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {b.specialRequest&&(
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-xs">
                  <span className="font-semibold text-blue-600">Special Request: </span>
                  <span className="text-blue-700">{b.specialRequest}</span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Booked {new Date(b.createdAt).toLocaleDateString("en-IN")}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookingsPage;
