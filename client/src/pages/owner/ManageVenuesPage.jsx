import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { venueAPI } from "../../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiMapPin, FiUsers, FiStar, FiSearch } from "react-icons/fi";

const ManageVenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(()=>{
    venueAPI.getMyVenues().then(r=>setVenues(r.data.venues)).catch(()=>toast.error("Failed to load")).finally(()=>setLoading(false));
  },[]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await venueAPI.delete(id);
      setVenues(v=>v.filter(x=>x._id!==id));
      toast.success("Venue deleted");
    } catch { toast.error("Failed to delete"); } finally { setDeletingId(null); }
  };

  const filtered = venues.filter(v=>v.venueName?.toLowerCase().includes(search.toLowerCase())||v.city?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner/>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Venues</h1>
          <p className="text-sm text-gray-500 mt-0.5">{venues.length} venue{venues.length!==1?"s":""} listed</p>
        </div>
        <Link to="/owner/venues/add" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          <FiPlus size={16}/> Add Venue
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{s:"approved",label:"Approved",c:"bg-emerald-50 border-emerald-100 text-emerald-700"},
          {s:"pending",label:"Pending",c:"bg-amber-50 border-amber-100 text-amber-700"},
          {s:"rejected",label:"Rejected",c:"bg-rose-50 border-rose-100 text-rose-700"}].map(x=>(
          <div key={x.s} className={`${x.c} border rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{venues.filter(v=>v.status===x.s).length}</p>
            <p className="text-xs mt-0.5">{x.label}</p>
          </div>
        ))}
      </div>

      {venues.length>0&&(
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
            <input type="text" placeholder="Search venues..." value={search} onChange={e=>setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm w-full"/>
          </div>
        </div>
      )}

      {filtered.length===0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-5xl mb-4">🏢</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{venues.length===0?"No venues yet":"No results found"}</h3>
          {venues.length===0&&<Link to="/owner/venues/add" className="inline-block mt-3 bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700">Add Your First Venue</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((venue,i)=>(
            <motion.div key={venue._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img src={venue.images?.[0]?.url||"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400"}
                  alt={venue.venueName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold
                    ${venue.status==="approved"?"bg-emerald-400 text-white":venue.status==="pending"?"bg-amber-400 text-white":"bg-rose-400 text-white"}`}>
                    {venue.status}
                  </span>
                  {venue.featured&&<span className="text-xs bg-violet-500 text-white px-2.5 py-1 rounded-full font-semibold">⭐</span>}
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/venues/${venue._id}`}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-gray-700 hover:bg-white shadow-sm">
                    <FiEye size={14}/>
                  </Link>
                  <button onClick={()=>handleDelete(venue._id,venue.venueName)} disabled={deletingId===venue._id}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-rose-600 hover:bg-white shadow-sm disabled:opacity-50">
                    <FiTrash2 size={14}/>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate mb-1">{venue.venueName}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><FiMapPin size={10}/>{venue.city}</span>
                  <span className="flex items-center gap-1"><FiUsers size={10}/>{venue.capacity}</span>
                  <span className="flex items-center gap-1"><FiStar size={10} className="text-amber-400"/>{venue.rating||"New"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-600">₹{venue.pricePerPlate}</span>
                    <span className="text-xs text-gray-400">/plate</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{venue.venueType}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageVenuesPage;
