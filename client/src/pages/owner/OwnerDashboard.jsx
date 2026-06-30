import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { FiHome, FiCalendar, FiDollarSign, FiStar, FiPlus, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { venueAPI, bookingAPI } from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler, ArcElement);

const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STATUS_BADGE={pending:"bg-amber-100 text-amber-700",confirmed:"bg-emerald-100 text-emerald-700",cancelled:"bg-rose-100 text-rose-700",completed:"bg-blue-100 text-blue-700"};

const OwnerDashboard = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([venueAPI.getMyVenues(),bookingAPI.getOwnerBookings()])
      .then(([v,b])=>{ setVenues(v.data.venues); setBookings(b.data.bookings); })
      .catch(console.error).finally(()=>setLoading(false));
  },[]);

  if (loading) return <LoadingSpinner/>;

  const totalRevenue = bookings.filter(b=>b.paymentStatus==="paid").reduce((s,b)=>s+(b.totalPrice||0),0);
  const avgRating = venues.length ? (venues.reduce((s,v)=>s+(v.rating||0),0)/venues.length).toFixed(1) : "—";

  const monthlyMap = {};
  bookings.filter(b=>b.paymentStatus==="paid").forEach(b=>{
    const d=new Date(b.bookingDate); const key=`${d.getFullYear()}-${d.getMonth()}`;
    monthlyMap[key]=(monthlyMap[key]||0)+(b.totalPrice||0);
  });
  const last6 = Array.from({length:6},(_,i)=>{ const d=new Date(); d.setMonth(d.getMonth()-5+i); return {label:MONTHS[d.getMonth()],key:`${d.getFullYear()}-${d.getMonth()}`}; });
  const revenueChart = {
    labels: last6.map(m=>m.label),
    datasets:[{ label:"Revenue ₹", data:last6.map(m=>monthlyMap[m.key]||0),
      backgroundColor:"rgba(59,130,246,0.75)", borderRadius:6, borderSkipped:false }],
  };

  const statusCounts=bookings.reduce((a,b)=>({...a,[b.bookingStatus]:(a[b.bookingStatus]||0)+1}),{});
  const donut={
    labels:["Confirmed","Pending","Cancelled"],
    datasets:[{data:[statusCounts.confirmed||0,statusCounts.pending||0,statusCounts.cancelled||0],backgroundColor:["#10b981","#f59e0b","#ef4444"],borderWidth:0}],
  };

  const chartOpts={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:11}}},y:{grid:{color:"#f3f4f6"},beginAtZero:true,ticks:{font:{size:11}}}}};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your venues and track performance</p>
        </div>
        <Link to="/owner/venues/add" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <FiPlus size={15}/> Add Venue
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiHome}       label="My Venues"    value={venues.length}                color="blue"   index={0}/>
        <StatCard icon={FiCalendar}   label="Total Bookings" value={bookings.length}            color="violet" index={1}/>
        <StatCard icon={FiDollarSign} label="Revenue"      value={`₹${(totalRevenue/1000).toFixed(1)}K`} color="green" index={2} trend={18}/>
        <StatCard icon={FiStar}       label="Avg Rating"   value={avgRating}                   color="amber"  index={3}/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Monthly Revenue</h2>
          <p className="text-xs text-gray-400 mb-4">Earnings from confirmed bookings</p>
          <div className="h-52"><Bar data={revenueChart} options={chartOpts}/></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Booking Status</h2>
          <p className="text-xs text-gray-400 mb-4">All-time breakdown</p>
          <div className="h-44"><Doughnut data={donut} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{padding:12,font:{size:11}}}},cutout:"68%"}}/></div>
          <div className="mt-3 space-y-1.5">
            {[{l:"Confirmed",c:"bg-emerald-400",v:statusCounts.confirmed||0},{l:"Pending",c:"bg-amber-400",v:statusCounts.pending||0},{l:"Cancelled",c:"bg-rose-400",v:statusCounts.cancelled||0}].map(s=>(
              <div key={s.l} className="flex items-center text-xs"><span className={`w-2 h-2 rounded-full mr-2 ${s.c}`}/><span className="text-gray-500">{s.l}</span><span className="ml-auto font-semibold text-gray-700">{s.v}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Venues</h2>
            <Link to="/owner/venues" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">Manage <FiArrowRight size={11}/></Link>
          </div>
          {venues.length===0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">🏢</p>
              <p className="text-gray-500 text-sm mb-4">No venues listed yet</p>
              <Link to="/owner/venues/add" className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Add First Venue</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {venues.slice(0,4).map((v,i)=>(
                <motion.div key={v._id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <img src={v.images?.[0]?.url||"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100"} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0"/>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{v.venueName}</p>
                    <p className="text-xs text-gray-400">{v.city} • {v.venueType}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${v.status==="approved"?"bg-emerald-100 text-emerald-700":v.status==="pending"?"bg-amber-100 text-amber-700":"bg-rose-100 text-rose-700"}`}>
                      {v.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">⭐{v.rating||"New"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/owner/bookings" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">View all <FiArrowRight size={11}/></Link>
          </div>
          {bookings.length===0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No bookings received yet</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0,5).map((b,i)=>(
                <motion.div key={b._id} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.userId?.name}</p>
                    <p className="text-xs text-gray-400">{b.eventType} • {new Date(b.bookingDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-bold text-blue-600">₹{b.totalPrice?.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[b.bookingStatus]}`}>{b.bookingStatus}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
