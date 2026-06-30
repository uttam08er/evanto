import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  FiUsers, FiHome, FiCalendar, FiDollarSign,
  FiAlertCircle, FiArrowRight,
} from "react-icons/fi";
import { adminAPI } from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STATUS_BADGE = {
  pending:"bg-amber-100 text-amber-700", confirmed:"bg-emerald-100 text-emerald-700",
  cancelled:"bg-rose-100 text-rose-700", completed:"bg-blue-100 text-blue-700",
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics().then(r => setData(r.data.analytics)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const monthly = data?.monthlyBookings || [];
  const labels = monthly.map(m => `${MONTHS[m._id.month-1]} '${String(m._id.year).slice(2)}`);

  const revenueChart = {
    labels,
    datasets:[{
      label:"Revenue",
      data: monthly.map(m => m.revenue),
      borderColor:"#7c3aed", backgroundColor:"rgba(124,58,237,0.08)",
      borderWidth:2.5, pointBackgroundColor:"#7c3aed", pointRadius:4, tension:0.45, fill:true,
    }],
  };

  const bookingChart = {
    labels,
    datasets:[{
      label:"Bookings",
      data: monthly.map(m => m.count),
      backgroundColor:"rgba(124,58,237,0.75)", borderRadius:6, borderSkipped:false,
    }],
  };

  const statusCounts = (data?.recentBookings||[]).reduce((a,b)=>({...a,[b.bookingStatus]:(a[b.bookingStatus]||0)+1}),{});
  const donutChart = {
    labels:["Confirmed","Pending","Cancelled","Completed"],
    datasets:[{ data:[statusCounts.confirmed||0,statusCounts.pending||0,statusCounts.cancelled||0,statusCounts.completed||0],
      backgroundColor:["#10b981","#f59e0b","#ef4444","#3b82f6"], borderWidth:0 }],
  };

  const baseOpts = { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
    scales:{ x:{grid:{display:false},ticks:{font:{size:11}}}, y:{grid:{color:"#f3f4f6"},beginAtZero:true,ticks:{font:{size:11}}} } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide performance overview</p>
        </div>
        <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full font-semibold">🛡 Admin</span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={FiUsers}      label="Total Users"   value={data?.totalUsers||0}  color="violet" index={0} trend={12}/>
        <StatCard icon={FiHome}       label="Live Venues"   value={data?.totalVenues||0} color="blue"   index={1} trend={8}/>
        <StatCard icon={FiCalendar}   label="Bookings"      value={data?.totalBookings||0} color="green" index={2} trend={23}/>
        <StatCard icon={FiDollarSign} label="Revenue"       value={`₹${((data?.totalRevenue||0)/1000).toFixed(0)}K`} color="amber" index={3} trend={15}/>
        <StatCard icon={FiAlertCircle}label="Pending"       value={data?.pendingVenues||0} color="rose"  index={4} sub={data?.pendingVenues>0?"Needs review":"All clear"}/>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Revenue Trend</h2>
          <p className="text-xs text-gray-400 mb-4">Monthly earnings from all paid bookings</p>
          <div className="h-56">
            {labels.length===0
              ? <div className="h-full flex items-center justify-center text-gray-300 text-sm">No data yet</div>
              : <Line data={revenueChart} options={{...baseOpts,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`₹${c.raw?.toLocaleString()}`}}}}}/>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Booking Status</h2>
          <p className="text-xs text-gray-400 mb-4">Recent bookings breakdown</p>
          <div className="h-44">
            <Doughnut data={donutChart} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{padding:12,font:{size:11}}}},cutout:"68%"}}/>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
            {[{l:"Confirmed",c:"bg-emerald-400",v:statusCounts.confirmed||0},{l:"Pending",c:"bg-amber-400",v:statusCounts.pending||0},{l:"Cancelled",c:"bg-rose-400",v:statusCounts.cancelled||0},{l:"Completed",c:"bg-blue-400",v:statusCounts.completed||0}]
              .map(s=>(
              <div key={s.l} className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.c}`}/>
                <span className="text-gray-500 truncate">{s.l}</span>
                <span className="ml-auto font-semibold text-gray-700">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Monthly Bookings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Confirmed bookings per month</p>
          </div>
          <Link to="/admin/bookings" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">All bookings <FiArrowRight size={12}/></Link>
        </div>
        <div className="h-48">
          {labels.length===0
            ? <div className="h-full flex items-center justify-center text-gray-300 text-sm">No data yet</div>
            : <Bar data={bookingChart} options={baseOpts}/>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs text-primary-600 hover:underline font-medium">View all</Link>
          </div>
          <div className="space-y-2">
            {!(data?.recentBookings?.length) ? (
              <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
            ) : data.recentBookings.map((b,i) => (
              <motion.div key={b._id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                    {b.userId?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.userId?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{b.venueId?.venueName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
                  <span className="text-sm font-semibold text-gray-800">₹{b.totalPrice?.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[b.bookingStatus]}`}>{b.bookingStatus}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {(data?.pendingVenues||0)>0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2"><FiAlertCircle className="text-amber-500"/><p className="text-sm font-semibold text-amber-800">Action Required</p></div>
              <p className="text-xs text-amber-600 mb-3">{data.pendingVenues} venue{data.pendingVenues>1?"s":""} waiting for review</p>
              <Link to="/admin/venues" className="block text-center text-xs bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 font-medium">Review Now →</Link>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[{to:"/admin/venues",icon:FiHome,label:"Approve Venues",c:"text-violet-600 bg-violet-50"},
                {to:"/admin/users",icon:FiUsers,label:"Manage Users",c:"text-blue-600 bg-blue-50"},
                {to:"/admin/bookings",icon:FiCalendar,label:"View Bookings",c:"text-emerald-600 bg-emerald-50"}]
                .map(a=>(
                <Link key={a.to} to={a.to} className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-8 h-8 rounded-lg ${a.c} flex items-center justify-center`}><a.icon size={14}/></div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{a.label}</span>
                  <FiArrowRight size={12} className="ml-auto text-gray-300 group-hover:text-gray-500"/>
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-4 text-white">
            <p className="text-xs text-white/70 mb-0.5">Platform Health</p>
            <p className="text-3xl font-bold mb-3">98.4%</p>
            {[{l:"API Uptime",v:"99.9%"},{l:"Avg Response",v:"120ms"},{l:"Error Rate",v:"0.1%"}].map(h=>(
              <div key={h.l} className="flex justify-between text-xs mb-1">
                <span className="text-white/70">{h.l}</span><span className="font-semibold">{h.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
