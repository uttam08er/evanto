import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiBell, FiUser, FiLogOut, FiHeart } from "react-icons/fi"; 

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); 

  const handleLogout = async () => {
    await logout();
    navigate("/"); 
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "owner") return "/owner/dashboard";
    return "/dashboard";
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎉</span>
            <span className="text-xl font-bold text-primary-600">Evently</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/venues" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Browse Venues
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === "user" && (
                  <Link to="/wishlist" className="text-gray-600 hover:text-primary-600">
                    <FiHeart size={20} />
                  </Link>
                )}

                <Link to="/notifications" className="text-gray-600 hover:text-primary-600 relative">
                  <FiBell size={20} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-sm">{user?.name?.split(" ")[0]}</span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
                      >
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiUser className="mr-2" /> Dashboard
                        </Link>
                        {user?.role === "user" && (
                          <Link to="/my-bookings" onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            My Bookings
                          </Link>
                        )}
                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Profile
                        </Link>
                        <hr className="my-1" />
                        <button onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <FiLogOut className="mr-2" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/venues" className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
                Browse Venues
              </Link>
              <Link to="/about" className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="block text-red-600 py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary block text-center" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
