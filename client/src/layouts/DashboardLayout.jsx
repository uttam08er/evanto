import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiCalendar, FiHeart, FiUser, FiLogOut, FiMenu, FiX,
  FiBell, FiTrendingUp, FiUsers, FiMapPin, FiPlusCircle, FiList,
  FiShield, FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { notificationAPI } from "../services/api";

const NAV_LINKS = {
  user: [
    { to: "/dashboard",     icon: FiHome,      label: "Overview" },
    { to: "/my-bookings",   icon: FiCalendar,  label: "My Bookings" },
    { to: "/wishlist",      icon: FiHeart,     label: "Wishlist" },
    { to: "/profile",       icon: FiUser,      label: "Profile" },
  ],
  owner: [
    { to: "/owner/dashboard",       icon: FiBarChart2, label: "Overview" },
    { to: "/owner/venues",          icon: FiMapPin,    label: "My Venues" },
    { to: "/owner/venues/add",      icon: FiPlusCircle,label: "Add Venue" },
    { to: "/owner/bookings",        icon: FiCalendar,  label: "Bookings" },
    { to: "/profile",               icon: FiUser,      label: "Profile" },
  ],
  admin: [
    { to: "/admin/dashboard",  icon: FiBarChart2, label: "Analytics" },
    { to: "/admin/users",      icon: FiUsers,     label: "Users" },
    { to: "/admin/venues",     icon: FiMapPin,    label: "Venues" },
    { to: "/admin/bookings",   icon: FiCalendar,  label: "Bookings" },
    { to: "/profile",          icon: FiSettings,  label: "Settings" },
  ],
};

const ROLE_COLORS = {
  user:  { bg: "from-violet-600 to-purple-700", badge: "bg-violet-100 text-violet-700" },
  owner: { bg: "from-blue-600 to-indigo-700",   badge: "bg-blue-100 text-blue-700" },
  admin: { bg: "from-rose-600 to-pink-700",     badge: "bg-rose-100 text-rose-700" },
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false); 
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [unreadCount, setUnreadCount] = useState(0);

  const role = user?.role || "user";
  const links = NAV_LINKS[role] || NAV_LINKS.user;
  const colors = ROLE_COLORS[role] || ROLE_COLORS.user;

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { data } = await notificationAPI.get();
        setUnreadCount(data.unreadCount || 0);
      } catch {}
    };
    fetchNotifs();
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center ${collapsed ? "justify-center px-3" : "justify-between px-5"} py-5 border-b border-white/10`}>
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎉</span>
            <span className="text-xl font-bold text-white tracking-tight">Evently</span>
          </Link>
        )}
        {collapsed && <span className="text-2xl">🎉</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors ml-2"
        >
          {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {user?.profileImage
                ? <img src={user.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${colors.badge}`}>
                {role}
              </span>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="flex justify-center py-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to ||
            (to !== "/dashboard" && to !== "/admin/dashboard" && to !== "/owner/dashboard" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"} px-3 py-2.5 rounded-xl transition-all duration-150 group
                ${isActive
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          to="/notifications"
          className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"} px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors relative`}
        >
          <FiBell size={18} />
          {!collapsed && <span className="text-sm font-medium">Notifications</span>}
          {unreadCount > 0 && (
            <span className={`${collapsed ? "absolute top-1 right-1" : "ml-auto"} bg-red-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold`}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "space-x-3"} px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-colors`}
        >
          <FiLogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`hidden lg:flex flex-col bg-gradient-to-b ${colors.bg} flex-shrink-0 overflow-hidden`}
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b ${colors.bg} z-50 lg:hidden`}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <FiMenu size={20} />
          </button>

          <div className="hidden sm:block">
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <Link to="/venues" className="text-xs text-primary-600 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors font-medium hidden sm:block">
              Browse Venues →
            </Link>
            <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-primary-600">
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
