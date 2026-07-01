import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";

const HomePage        = lazy(() => import("./pages/public/HomePage"));
const VenuesPage      = lazy(() => import("./pages/public/VenuesPage"));
const VenueDetailPage = lazy(() => import("./pages/public/VenueDetailPage"));
const AboutPage       = lazy(() => import("./pages/public/AboutPage"));
const ContactPage     = lazy(() => import("./pages/public/ContactPage"));
const LoginPage       = lazy(() => import("./pages/public/LoginPage"));
const RegisterPage    = lazy(() => import("./pages/public/RegisterPage"));
const ForgotPasswordPage  = lazy(() => import("./pages/public/ForgotPasswordPage"));
const ResetPasswordPage   = lazy(() => import("./pages/public/ResetPasswordPage"));
const VerifyEmailPage     = lazy(() => import("./pages/public/VerifyEmailPage"));
const BookingPage         = lazy(() => import("./pages/user/BookingPage"));

const UserDashboard   = lazy(() => import("./pages/user/UserDashboard"));
const ProfilePage     = lazy(() => import("./pages/user/ProfilePage"));
const MyBookingsPage  = lazy(() => import("./pages/user/MyBookingsPage"));
const WishlistPage    = lazy(() => import("./pages/user/WishlistPage"));

const OwnerDashboard   = lazy(() => import("./pages/owner/OwnerDashboard"));
const AddVenuePage     = lazy(() => import("./pages/owner/AddVenuePage"));
const ManageVenuesPage = lazy(() => import("./pages/owner/ManageVenuesPage"));
const OwnerBookingsPage= lazy(() => import("./pages/owner/OwnerBookingsPage"));

const AdminDashboard   = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsersPage   = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminVenuesPage  = lazy(() => import("./pages/admin/AdminVenuesPage"));
const AdminBookingsPage= lazy(() => import("./pages/admin/AdminBookingsPage"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* ── PUBLIC routes with Navbar+Footer ── */}
        <Route element={<MainLayout />}>
          <Route path="/"           element={<HomePage />} />
          <Route path="/venues"     element={<VenuesPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
          <Route path="/reset-password"   element={<ResetPasswordPage />} />
          <Route path="/verify-email"     element={<VerifyEmailPage />} />
          <Route path="/book/:venueId"    element={<ProtectedRoute allowedRoles={["user"]}><BookingPage /></ProtectedRoute>} />
        </Route>

        {/* ── USER dashboard ── */}
        <Route element={<ProtectedRoute allowedRoles={["user"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard"   element={<UserDashboard />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/wishlist"    element={<WishlistPage />} />
          <Route path="/profile"     element={<ProfilePage />} />
        </Route>

        {/* ── OWNER dashboard ── */}
        <Route element={<ProtectedRoute allowedRoles={["owner"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/owner/dashboard"  element={<OwnerDashboard />} />
          <Route path="/owner/venues"     element={<ManageVenuesPage />} />
          <Route path="/owner/venues/add" element={<AddVenuePage />} />
          <Route path="/owner/bookings"   element={<OwnerBookingsPage />} />
          <Route path="/profile"          element={<ProfilePage />} />
        </Route>

        {/* ── ADMIN dashboard ── */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users"     element={<AdminUsersPage />} />
          <Route path="/admin/venues"    element={<AdminVenuesPage />} />
          <Route path="/admin/bookings"  element={<AdminBookingsPage />} />
          <Route path="/profile"         element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
              <h1 className="text-8xl font-black text-primary-200">404</h1>
              <p className="text-xl text-gray-600 mt-4 mb-6">Page not found</p>
              <a href="/" className="btn-primary">← Go Home</a>
            </div>
          </div>
        } />
      </Routes>
      <div className="w-full h-screen bg-primary-500"></div>
    </Suspense>
  );
}

export default App;
