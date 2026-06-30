import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FiSearch, FiUser, FiShield, FiHome, FiSlash, FiCheck } from "react-icons/fi";

const ROLE_BADGE = {
  user:  "bg-blue-100 text-blue-700",
  owner: "bg-emerald-100 text-emerald-700",
  admin: "bg-rose-100 text-rose-700",
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    adminAPI.getUsers().then(r => setUsers(r.data.users)).catch(()=>toast.error("Failed to load users")).finally(()=>setLoading(false));
  }, []);

  const handleToggleBlock = async (id, blocked, name) => {
    if (!window.confirm(`${blocked?"Unblock":"Block"} ${name}?`)) return;
    setTogglingId(id);
    try {
      await adminAPI.toggleUserBlock(id);
      setUsers(u => u.map(x => x._id===id ? {...x,isBlocked:!x.isBlocked} : x));
      toast.success(`User ${blocked?"unblocked":"blocked"}`);
    } catch { toast.error("Action failed"); } finally { setTogglingId(null); }
  };

  const filtered = users.filter(u =>
    (roleFilter==="all"||u.role===roleFilter) &&
    (u.name?.toLowerCase().includes(search.toLowerCase())||u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">{users.length} total registered users</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{role:"user",label:"Customers",icon:"👤",c:"bg-blue-50 border-blue-100"},
          {role:"owner",label:"Owners",icon:"🏢",c:"bg-emerald-50 border-emerald-100"},
          {role:"admin",label:"Admins",icon:"🛡",c:"bg-rose-50 border-rose-100"}].map(s=>(
          <div key={s.role} className={`${s.c} border rounded-2xl p-4 text-center`}>
            <span className="text-2xl block mb-1">{s.icon}</span>
            <p className="text-2xl font-bold text-gray-900">{users.filter(u=>u.role===s.role).length}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
            <input type="text" placeholder="Search by name or email..."
              value={search} onChange={e=>setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"/>
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {["all","user","owner","admin"].map(r=>(
              <button key={r} onClick={()=>setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                  ${roleFilter===r?"bg-white text-primary-600 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["User","Role","Phone","Status","Joined","Actions"].map(h=>(
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length===0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users match your search</td></tr>
              ) : filtered.map(u=>(
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{u.phone||"—"}</td>
                  <td className="py-3 px-4">
                    {u.isBlocked
                      ? <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-full font-medium"><FiSlash size={10}/>Blocked</span>
                      : u.isVerified
                        ? <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium"><FiCheck size={10}/>Active</span>
                        : <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">Unverified</span>}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="py-3 px-4">
                    {u.role!=="admin" && (
                      <button onClick={()=>handleToggleBlock(u._id,u.isBlocked,u.name)}
                        disabled={togglingId===u._id}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50
                          ${u.isBlocked?"bg-emerald-100 text-emerald-700 hover:bg-emerald-200":"bg-rose-100 text-rose-700 hover:bg-rose-200"}`}>
                        {togglingId===u._id?"...":u.isBlocked?"Unblock":"Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
