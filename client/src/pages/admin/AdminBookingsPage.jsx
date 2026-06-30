import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FiSearch, FiDownload } from "react-icons/fi";

const STATUS_BADGE={pending:"bg-amber-100 text-amber-700",confirmed:"bg-emerald-100 text-emerald-700",cancelled:"bg-rose-100 text-rose-700",completed:"bg-blue-100 text-blue-700"};
const PAY_BADGE={pending:"bg-gray-100 text-gray-600",paid:"bg-emerald-100 text-emerald-700",refunded:"bg-orange-100 text-orange-700",failed:"bg-rose-100 text-rose-700"};

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(()=>{
    adminAPI.getBookings().then(r=>setBookings(r.data.bookings)).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const filtered = bookings.filter(b=>
    (statusFilter==="all"||b.bookingStatus===statusFilter)&&
    (b.userId?.name?.toLowerCase().includes(search.toLowerCase())||b.venueId?.venueName?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue = bookings.filter(b=>b.paymentStatus==="paid").reduce((s,b)=>s+(b.totalPrice||0),0);

  if (loading) return <LoadingSpinner/>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total confirmed revenue: <strong className="text-primary-600">₹{totalRevenue.toLocaleString()}</strong></p>
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-200 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50">
          <FiDownload size={14}/> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["pending","confirmed","cancelled","completed"].map(s=>(
          <button key={s} onClick={()=>setStatusFilter(s===statusFilter?"all":s)}
            className={`rounded-2xl p-4 text-center border transition-all
              ${statusFilter===s?"border-primary-400 bg-primary-50":"border-gray-100 bg-white hover:border-gray-200"}`}>
            <p className="text-2xl font-bold text-gray-900">{bookings.filter(b=>b.bookingStatus===s).length}</p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
          <input type="text" placeholder="Search by customer or venue..." value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm"/>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {["all","pending","confirmed","cancelled","completed"].map(s=>(
            <button key={s} onClick={()=>setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                ${statusFilter===s?"bg-white text-primary-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Customer","Venue","Event & Date","Guests","Amount","Status","Payment"].map(h=>(
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length===0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No bookings found</td></tr>
              ) : filtered.map(b=>(
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{b.userId?.name}</p>
                    <p className="text-xs text-gray-400">{b.userId?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-xs max-w-32 truncate">{b.venueId?.venueName}</td>
                  <td className="py-3 px-4">
                    <p className="text-gray-700 text-xs">{b.eventType}</p>
                    <p className="text-xs text-gray-400">{new Date(b.bookingDate).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-center">{b.guestCount}</td>
                  <td className="py-3 px-4 font-semibold text-primary-600">₹{b.totalPrice?.toLocaleString()}</td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[b.bookingStatus]}`}>{b.bookingStatus}</span></td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PAY_BADGE[b.paymentStatus]}`}>{b.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">Showing {filtered.length} of {bookings.length} bookings</div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
