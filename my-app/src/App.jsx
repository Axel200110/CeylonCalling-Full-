import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAdminStore } from "./admin/store/adminStore";
import { useAuthStore } from "./shopowner/store/authStore";
import { useSiteUserAuthStore } from "./store/siteUserAuthStore";

// Common Landing Components (Rendered eagerly on initial landing)
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Join from "./components/Join";
import RouteLoadingFallback from "./components/common/RouteLoadingFallback";
import LoadingSpinner from "./shopowner/components/LoadingSpinner";

// Lazy-loaded Shopowner Pages
const AnnouncementsPage = lazy(() => import("./shopowner/pages/AnnouncementsPage"));
const FeedbackPage = lazy(() => import("./shopowner/pages/FeedbackPage"));
const ShopOwnerForgotPasswordPage = lazy(() => import("./shopowner/pages/ForgotPasswordPage"));
const ShopOwnerLoginPage = lazy(() => import("./shopowner/pages/LoginPage"));
const ShopOwnerMessagesPage = lazy(() => import("./shopowner/pages/Messages"));
const MyShop = lazy(() => import("./shopowner/pages/MyShop"));
const OrdersPage = lazy(() => import("./shopowner/pages/OrdersPage"));
const PromotionsPage = lazy(() => import("./shopowner/pages/PromotionsPage"));
const ShopOwnerResetPasswordPage = lazy(() => import("./shopowner/pages/ResetPasswordPage"));
const RoomsPage = lazy(() => import("./shopowner/pages/RoomsPage"));
const Settings = lazy(() => import("./shopowner/pages/Settings"));
const DashboardPage = lazy(() => import("./shopowner/pages/ShopOwner"));

// Lazy-loaded Site User & Customer Pages
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));
const FoodDetails = lazy(() => import("./pages/FoodDetails"));
const Foods = lazy(() => import("./pages/Foods"));
const SiteUserLoginPage = lazy(() => import("./pages/LoginPage"));
const PlacesPage = lazy(() => import("./pages/MyPlace"));
const PartnerWithUs = lazy(() => import("./pages/PartnerWithUs/PartnerWithUs"));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails"));
const UserProfile = lazy(() => import("./pages/ProfileUser"));
const RestaurantMenuPage = lazy(() => import("./pages/RestaurantMenuPage"));
const ShopDetails = lazy(() => import("./pages/ShopDetails"));
const Shops = lazy(() => import("./pages/Shops"));
const SiteUserSignUpPage = lazy(() => import("./pages/SignUpPage"));
const SiteUserEmailVerificationPage = lazy(() => import("./pages/UserEmailVerificationPage"));
const SiteUserForgotPasswordPage = lazy(() => import("./pages/UserForgotPasswordPage"));
const SiteUserResetPasswordPage = lazy(() => import("./pages/UserResetPasswordPage"));
const UserSettings = lazy(() => import("./pages/UserSettings"));

// Lazy-loaded Admin Pages
const AdminLayout = lazy(() => import("./admin/pages/AdminLayout"));
const AdminLoginPage = lazy(() => import("./admin/pages/AdminLoginPage"));
const AdminMessages = lazy(() => import("./admin/pages/AdminMessages"));
const AdminSettings = lazy(() => import("./admin/pages/AdminSettings"));
const AuditLogsPage = lazy(() => import("./admin/pages/AuditLogsPage"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminListings = lazy(() => import("./admin/pages/ListingsManagement"));
const ReviewModeration = lazy(() => import("./admin/pages/ReviewModeration"));
const AdminShops = lazy(() => import("./admin/pages/ShopsManagement"));
const AdminUsers = lazy(() => import("./admin/pages/UsersManagement"));

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

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }
  return children;
};

// Site user redirect if authenticated
const SiteUserRedirectAuthenticatedUser = ({ children }) => {
  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }
  return children;
};

// Admin protected route
const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const isAdminCheckingAuth = useAdminStore((state) => state.isAdminCheckingAuth);

  useEffect(() => {
    useAdminStore.getState().checkAuth();
  }, []);

  if (isAdminCheckingAuth) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Admin redirect if auth
const AdminRedirectAuthenticatedUser = ({ children }) => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            fontSize: "13px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
          },
        }}
      />
      <Suspense fallback={<RouteLoadingFallback />}>
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
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/user/dashboard" element={<DiscoverPage />} />

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
        {/* Guest checkout is allowed — no login required */}
        <Route path="/checkout" element={<CheckoutPage />} />
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
        <Route path="/shopform" element={<Navigate to="/partner-with-us" replace />} />

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
        <Route path="/login-shop" element={<Navigate to="/login" replace />} />
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
          path="/dashboard/orders"
          element={
            <ShopOwnerProtectedRoute>
              <OrdersPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/dashboard/rooms"
          element={
            <ShopOwnerProtectedRoute>
              <RoomsPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/dashboard/promotions"
          element={
            <ShopOwnerProtectedRoute>
              <PromotionsPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/dashboard/announcements"
          element={
            <ShopOwnerProtectedRoute>
              <AnnouncementsPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reviews"
          element={
            <ShopOwnerProtectedRoute>
              <FeedbackPage />
            </ShopOwnerProtectedRoute>
          }
        />
        <Route path="/shopcreate" element={<Navigate to="/dashboard" replace />} />

        {/* ----------- SITE USER AUTH & PROTECTED ----------- */}
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
        <Route path="/user/verify-email" element={<SiteUserEmailVerificationPage />} />
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
        <Route
          path="/admin/login"
          element={
            <AdminRedirectAuthenticatedUser>
              <AdminLoginPage />
            </AdminRedirectAuthenticatedUser>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="shops" element={<AdminShops />} />
          <Route path="reviews" element={<ReviewModeration />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </Router>
  );
}

export default App;