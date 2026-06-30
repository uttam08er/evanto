import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI } from "../../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FiCheck, FiX, FiStar, FiEye, FiMapPin, FiUsers } from "react-icons/fi";

const AdminVenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [actionId, setActionId] = useState(null);

  const fetchVenues = (status) => {
    setLoading(true);
    adminAPI.getVenues(status!=="all"?status:undefined)
      .then(r=>setVenues(r.data.venues)).catch(()=>toast.error("Failed"))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{ fetchVenues(tab); },[tab]);

  const act = async (id, status, featured=false) => {
    setActionId(id+status);
    try {
      await adminAPI.updateVenueStatus(id,{status,featured});
      setVenues(v=>v.map(x=>x._id===id?{...x,status,featured}:x));
      toast.success(`Venue ${status}`);
    } catch { toast.error("Failed"); } finally { setActionId(null); }
  };

  const TABS = [{key:"pending",label:"Pending Review"},{key:"approved",label:"Approved"},{key:"rejected",label:"Rejected"},{key:"all",label:"All"}];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review and approve venue listings</p>
      </div>

      <div className="flex gap-2 bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm w-fit">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${tab===t.key?"bg-primary-600 text-white shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner/> : venues.length===0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">🏢</p>
          <p className="text-gray-400">No venues in this category</p>
        </div>
      ) : (
        <div className="space-y-4">
          {venues.map(venue=>(
            <div key={venue._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-40 flex-shrink-0">
                  <img src={venue.images?.[0]?.url||"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400"}
                    alt={venue.venueName} className="w-full h-full object-cover"/>
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                      ${venue.status==="approved"?"bg-emerald-100 text-emerald-700":venue.status==="pending"?"bg-amber-100 text-amber-700":"bg-rose-100 text-rose-700"}`}>
                      {venue.status}
                    </span>
                    {venue.featured&&<span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">⭐ Featured</span>}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{venue.venueName}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><FiMapPin size={12}/>{venue.city}, {venue.state}</span>
                          <span className="flex items-center gap-1"><FiUsers size={12}/>{venue.capacity} guests</span>
                          <span className="font-medium text-primary-600">₹{venue.pricePerPlate}/plate</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p className="font-medium">{venue.ownerId?.name}</p>
                        <p className="text-xs">{venue.ownerId?.email}</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">{venue.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{venue.venueType}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{venue.category}</span>
                      {venue.amenities?.slice(0,3).map(a=><span key={a} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{a}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link to={`/venues/${venue._id}`} target="_blank"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium">
                      <FiEye size={12}/>Preview
                    </Link>
                    {venue.status!=="approved"&&<>
                      <button onClick={()=>act(venue._id,"approved",false)} disabled={!!actionId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium disabled:opacity-50">
                        <FiCheck size={12}/>{actionId===venue._id+"approved"?"...":"Approve"}
                      </button>
                      <button onClick={()=>act(venue._id,"approved",true)} disabled={!!actionId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 font-medium disabled:opacity-50">
                        <FiStar size={12}/>Approve + Feature
                      </button>
                    </>}
                    {venue.status==="approved"&&(
                      <button onClick={()=>act(venue._id,"approved",!venue.featured)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 font-medium">
                        <FiStar size={12}/>{venue.featured?"Unfeature":"Make Featured"}
                      </button>
                    )}
                    {venue.status!=="rejected"&&(
                      <button onClick={()=>act(venue._id,"rejected")} disabled={!!actionId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 font-medium disabled:opacity-50">
                        <FiX size={12}/>{actionId===venue._id+"rejected"?"...":"Reject"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVenuesPage;
