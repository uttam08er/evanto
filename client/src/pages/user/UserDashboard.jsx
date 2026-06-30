import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FiCalendar, FiHeart, FiBell, FiMapPin, FiArrowRight, FiStar } from "react-icons/fi";
import { bookingAPI, notificationAPI, wishlistAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_BADGE={pending:"bg-amber-100 text-amber-700",confirmed:"bg-emerald-100 text-emerald-700",cancelled:"bg-rose-100 text-rose-700",completed:"bg-blue-100 text-blue-700"};

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([bookingAPI.getMyBookings(), notificationAPI.get(), wishlistAPI.get()])
      .then(([b,n,w])=>{
        setBookings(b.data.bookings);
        setNotifications(n.data.notifications.slice(0,6));
        setWishlistCount(w.data.wishlist?.venues?.length||0);
      }).catch(console.error).finally(()=>setLoading(false));
  },[]);

  if (loading) return <LoadingSpinner/>;

  const totalSpent = bookings.filter(b=>b.paymentStatus==="paid").reduce((s,b)=>s+(b.totalPrice||0),0);
  const upcoming = bookings.filter(b=>new Date(b.bookingDate)>=new Date()&&b.bookingStatus==="confirmed").length;
  const statusCounts = bookings.reduce((a,b)=>({...a,[b.bookingStatus]:(a[b.bookingStatus]||0)+1}),{});

  const donut = bookings.length ? {
    labels:["Confirmed","Pending","Cancelled","Completed"],
    datasets:[{data:[statusCounts.confirmed||0,statusCounts.pending||0,statusCounts.cancelled||0,statusCounts.completed||0],backgroundColor:["#10b981","#f59e0b","#ef4444","#3b82f6"],borderWidth:0}],
  } : null;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
            <p className="text-white/70 mt-1 text-sm">Ready to plan your next celebration?</p>
          </div>
          <Link to="/venues" className="bg-white text-violet-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors text-sm">
            Browse Venues →
          </Link>
        </div>
        {upcoming > 0 && (
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 text-sm">
            🎉 You have <strong>{upcoming}</strong> upcoming event{upcoming>1?"s":""} confirmed!
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiCalendar} label="Total Bookings" value={bookings.length}                       color="violet" index={0}/>
        <StatCard icon={FiCalendar} label="Upcoming Events" value={upcoming}                             color="blue"   index={1} sub="Confirmed"/>
        <StatCard icon={FiHeart}    label="Saved Venues"    value={wishlistCount}                        color="rose"   index={2}/>
        <StatCard icon={FiStar}     label="Total Spent"     value={`₹${(totalSpent/1000).toFixed(1)}K`} color="amber"  index={3}/>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bookings list */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Bookings</h2>
            <Link to="/my-bookings" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">View all <FiArrowRight size={11}/></Link>
          </div>
          {bookings.length===0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500 text-sm mb-4">No bookings yet</p>
              <Link to="/venues" className="text-xs bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700">Book Your First Event</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0,5).map((b,i)=>(
                <motion.div key={b._id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <img src={b.venueId?.images?.[0]?.url||"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100"} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{b.venueId?.venueName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FiMapPin size={10}/>{b.venueId?.city} • {b.eventType} • {new Date(b.bookingDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary-600">₹{b.totalPrice?.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[b.bookingStatus]}`}>{b.bookingStatus}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Donut chart */}
          {donut && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-1">Booking Overview</h2>
              <p className="text-xs text-gray-400 mb-4">Status breakdown</p>
              <div className="h-40"><Doughnut data={donut} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{padding:10,font:{size:10}}}},cutout:"65%"}}/></div>
            </div>
          )}

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiBell size={15}/> Notifications
                {notifications.filter(n=>!n.isRead).length>0&&(
                  <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {notifications.filter(n=>!n.isRead).length}
                  </span>
                )}
              </h2>
            </div>
            {notifications.length===0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">All caught up! 🎉</p>
            ) : (
              <div className="space-y-2">
                {notifications.map(n=>(
                  <div key={n._id} className={`p-3 rounded-xl text-xs ${n.isRead?"bg-gray-50":"bg-violet-50 border border-violet-100"}`}>
                    <p className="font-semibold text-gray-800">{n.title}</p>
                    <p className="text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {to:"/venues",icon:"🔍",label:"Browse Venues",c:"bg-violet-50 hover:bg-violet-100 text-violet-700"},
            {to:"/my-bookings",icon:"📅",label:"My Bookings",c:"bg-blue-50 hover:bg-blue-100 text-blue-700"},
            {to:"/wishlist",icon:"❤️",label:"Wishlist",c:"bg-rose-50 hover:bg-rose-100 text-rose-700"},
            {to:"/profile",icon:"👤",label:"Edit Profile",c:"bg-emerald-50 hover:bg-emerald-100 text-emerald-700"},
          ].map(a=>(
            <Link key={a.to} to={a.to} className={`${a.c} rounded-xl p-4 text-center transition-colors`}>
              <span className="text-2xl block mb-2">{a.icon}</span>
              <span className="text-xs font-semibold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
