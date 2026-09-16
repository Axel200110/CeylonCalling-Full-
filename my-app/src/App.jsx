import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAuthStore } from "./shopowner/store/authStore";
import { useSiteUserAuthStore } from "./store/siteUserAuthStore";

// Common Components
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Join from "./components/Join";

// Shopowner Pages
import ShopOwnerForgotPasswordPage from "./shopowner/pages/ForgotPasswordPage";
import ShopOwnerLoginPage from "./shopowner/pages/LoginPage";
import ShopOwnerMessagesPage from "./shopowner/pages/Messages";
import MyShop from "./shopowner/pages/MyShop";
import ShopOwnerResetPasswordPage from "./shopowner/pages/ResetPasswordPage";
import Settings from "./shopowner/pages/Settings";
import ShopCreate from "./shopowner/pages/ShopCreateAcc";
import ShopForm from "./shopowner/pages/ShopLogUi";
import { default as DashboardPage } from "./shopowner/pages/ShopOwner";

// Site User & Customer Pages
import Home from "./pages/Home";
import SiteUserLoginPage from "./pages/LoginPage";
import PlacesPage from "./pages/MyPlace";
import PartnerWithUs from "./pages/PartnerWithUs/PartnerWithUs";
import PlaceDetails from "./pages/PlaceDetails";
import UserProfile from "./pages/ProfileUser";
import SiteUserSignUpPage from "./pages/SignUpPage";
import SiteUserEmailVerificationPage from "./pages/UserEmailVerificationPage";
import SiteUserForgotPasswordPage from "./pages/UserForgotPasswordPage";
import UserLogUi from "./pages/UserLogUi";
import SiteUserResetPasswordPage from "./pages/UserResetPasswordPage";
import UserSettings from "./pages/UserSettings";
import Shops from "./pages/Shops";
import ShopDetails from "./pages/ShopDetails";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import Foods from "./pages/Foods";
import FoodDetails from "./pages/FoodDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// Components
import LoadingSpinner from "./shopowner/components/LoadingSpinner";

// Admin Pages
import AdminLayout from "./admin/pages/AdminLayout";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminMessages from "./admin/pages/AdminMessages";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminListings from "./admin/pages/ListingsManagement";
import AdminShops from "./admin/pages/ShopsManagement";
import AdminUsers from "./admin/pages/UsersManagement";

// ----------- Route Protection Logic ----------- //

// Shopowner protected route
const ShopOwnerProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Shopowner redirect if auth
const ShopOwnerRedirectAuthenticatedUser = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Site user protected route
const SiteUserProtectedRoute = ({ children }) => {
  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);
  const user = useSiteUserAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/user/verify-email" replace />;
  }
  return children;
};

// Site user redirect if auth
const SiteUserRedirectAuthenticatedUser = ({ children }) => {
  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);
  const user = useSiteUserAuthStore((state) => state.user);

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/discover" replace />;
  }
  return children;
};

function App() {
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const isSiteUserCheckingAuth = useSiteUserAuthStore((state) => state.isCheckingAuth);
  const checkSiteUserAuth = useSiteUserAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkSiteUserAuth();
  }, [checkSiteUserAuth]);

  if (isCheckingAuth || isSiteUserCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Landing Website */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <About />
              <Join />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* Community & Partner Routes */}
        <Route path="/places/:id" element={<PlaceDetails />} />
        <Route path="/partner-with-us" element={<PartnerWithUs />} />

        {/* ----------- CUSTOMER DISCOVERY & FOOD EXPERIENCE ----------- */}
        {/* Discovery Hub */}
        <Route path="/discover" element={<Home />} />
        <Route path="/user/dashboard" element={<Home />} />

        {/* Restaurant & Shop Details */}
        <Route path="/shops" element={<Shops />} />
        <Route path="/shop/:id" element={<ShopDetails />} />
        <Route path="/restaurant/:id" element={<ShopDetails />} />

        {/* Restaurant Food Menus */}
        <Route path="/restaurant/:id/menu" element={<RestaurantMenuPage />} />
        <Route path="/shop/:id/menu" element={<RestaurantMenuPage />} />
        <Route path="/foodpage/:shopId" element={<RestaurantMenuPage />} />

        {/* Food Directory & Details */}
        <Route path="/foods" element={<Foods />} />
        <Route path="/foods/:id" element={<FoodDetails />} />

        {/* Cart & Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <SiteUserProtectedRoute>
              <CheckoutPage />
            </SiteUserProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <SiteUserProtectedRoute>
              <UserProfile />
            </SiteUserProtectedRoute>
          }
        />
        <Route path="/register" element={<Navigate to="/user/signup" replace />} />

        {/* ----------- SHOPOWNER ROUTES ----------- */}
        <Route path="/shop" element={<Navigate to="/dashboard" replace />} />
        <Route path="/shopform" element={<ShopForm />} />

        {/* Shopowner Auth */}
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <ShopOwnerRedirectAuthenticatedUser>
              <ShopOwnerLoginPage />
            </ShopOwnerRedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<Navigate to="/login" replace />} />
        <Route
          path="/forgot-password"
          element={
            <ShopOwnerRedirectAuthenticatedUser>
              <ShopOwnerForgotPasswordPage />
            </ShopOwnerRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ShopOwnerRedirectAuthenticatedUser>
              <ShopOwnerResetPasswordPage />
            </ShopOwnerRedirectAuthenticatedUser>
          }
        />

        {/* Shopowner Protected */}
        <Route
          path="/dashboard"
          element={
            <ShopOwnerProtectedRoute>
              <DashboardPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/myshop"
          element={
            <ShopOwnerProtectedRoute>
              <MyShop />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ShopOwnerProtectedRoute>
              <Settings />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ShopOwnerProtectedRoute>
              <ShopOwnerMessagesPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/shopcreate"
          element={
            <ShopOwnerProtectedRoute>
              <ShopCreate />
            </ShopOwnerProtectedRoute>
          }
        />

        {/* ----------- SITE USER AUTH & PROTECTED ----------- */}
        <Route path="/userlogui" element={<UserLogUi />} />
        <Route
          path="/user/signup"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserSignUpPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/user/login"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserLoginPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email1" element={<SiteUserEmailVerificationPage />} />
        <Route
          path="/user/forgot-password"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserForgotPasswordPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/user/reset-password/:token"
          element={
            <SiteUserRedirectAuthenticatedUser>
              <SiteUserResetPasswordPage />
            </SiteUserRedirectAuthenticatedUser>
          }
        />

        <Route
          path="/usersetting"
          element={
            <SiteUserProtectedRoute>
              <UserSettings />
            </SiteUserProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <SiteUserProtectedRoute>
              <UserProfile />
            </SiteUserProtectedRoute>
          }
        />
        <Route
          path="/user/placepage"
          element={
            <SiteUserProtectedRoute>
              <PlacesPage />
            </SiteUserProtectedRoute>
          }
        />
        <Route
          path="/user/placdetails"
          element={
            <SiteUserProtectedRoute>
              <PlaceDetails />
            </SiteUserProtectedRoute>
          }
        />

        {/* ----------- ADMIN ROUTES ----------- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="shops" element={<AdminShops />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;