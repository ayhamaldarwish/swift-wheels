import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PageLoader from "@/components/PageLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageTransition } from "@/components/ui/loader";

// Import the Index page directly for better initial loading experience
import Index from "@/pages/Index";

// Lazy load other pages for better performance
const NotFound = lazy(() => import("@/pages/NotFound"));
const CarsPage = lazy(() => import("@/pages/CarsPage"));
const CarDetailsPage = lazy(() => import("@/pages/CarDetailsPage"));
const ComparePage = lazy(() => import("@/pages/ComparePage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const UserDashboard = lazy(() => import("@/pages/UserDashboard"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const FaqPage = lazy(() => import("@/pages/FaqPage"));
const BookingConfirmation = lazy(() => import("@/pages/BookingConfirmation"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const UserGuidePage = lazy(() => import("@/pages/UserGuidePage"));

/**
 * AppRoutes component
 *
 * Manages all application routes with lazy loading for better performance
 * Includes page transition animations
 */
const AppRoutes = () => {
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [prevPathname, setPrevPathname] = useState("");

  // Handle page transitions
  useEffect(() => {
    // Only show transition when changing main routes, not query params
    const currentMainPath = location.pathname.split("/")[1];
    const prevMainPath = prevPathname.split("/")[1];

    if (currentMainPath !== prevMainPath && prevPathname !== "") {
      setIsPageTransitioning(true);

      // Hide transition after a short delay
      const timer = setTimeout(() => {
        setIsPageTransitioning(false);
      }, 800); // Adjust timing as needed

      return () => clearTimeout(timer);
    }

    setPrevPathname(location.pathname);
  }, [location.pathname, prevPathname]);



  return (
    <>
      {/* Page transition overlay */}
      {isPageTransitioning && <PageTransition text="Loading..." />}

      <Routes>
        {/* Home page is loaded directly */}
        <Route path="/" element={<Index />} />

        {/* Other pages are lazy loaded */}
        <Route path="/cars" element={
          <Suspense fallback={<PageLoader />}>
            <CarsPage />
          </Suspense>
        } />
      <Route path="/cars/:id" element={
        <Suspense fallback={<PageLoader />}>
          <CarDetailsPage />
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<PageLoader />}>
          <Register />
        </Suspense>
      } />
      <Route path="/dashboard" element={
        <Suspense fallback={<PageLoader />}>
          <ProtectedRoute requiredPermission="view_own_bookings">
            <UserDashboard />
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="/profile" element={
        <Suspense fallback={<PageLoader />}>
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="/favorites" element={
        <Suspense fallback={<PageLoader />}>
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="/admin" element={
        <Suspense fallback={<PageLoader />}>
          <ProtectedRoute requireAdmin={true}>
            <AdminPage />
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<PageLoader />}>
          <AboutPage />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<PageLoader />}>
          <ContactPage />
        </Suspense>
      } />
      <Route path="/faq" element={
        <Suspense fallback={<PageLoader />}>
          <FaqPage />
        </Suspense>
      } />
      <Route path="/compare" element={
        <Suspense fallback={<PageLoader />}>
          <ComparePage />
        </Suspense>
      } />
      <Route path="/booking-confirmation" element={
        <Suspense fallback={<PageLoader />}>
          <BookingConfirmation />
        </Suspense>
      } />
      <Route path="/privacy" element={
        <Suspense fallback={<PageLoader />}>
          <PrivacyPolicy />
        </Suspense>
      } />
      <Route path="/terms" element={
        <Suspense fallback={<PageLoader />}>
          <TermsOfService />
        </Suspense>
      } />
      <Route path="/guide" element={
        <Suspense fallback={<PageLoader />}>
          <UserGuidePage />
        </Suspense>
      } />
      <Route path="*" element={
        <Suspense fallback={<PageLoader />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
    </>
  );
};

export default AppRoutes;
