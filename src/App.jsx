import React, { lazy, Suspense, memo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components (loaded immediately)
import ErrorBoundary from "./components/ErrorBoundary";

// Route Guards (loaded immediately)
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AdminRoute from "./routes/AdminRoute";

// Lazy-loaded Pages (code splitting)
const Login = lazy(() => import("./auth/Login"));
const Profile = lazy(() => import("./profile/Profile"));
const Home = lazy(() => import("./pages/Home"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const OAuthCallback = lazy(() => import("./pages/OAuthCallback"));
const AdminDashboard = lazy(() => import("./admin/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BuyXpPage = lazy(() => import("./pages/BuyXpPage"));
const GameRedirectPage = lazy(() => import("./pages/GameRedirectPage"));
const CertificateVerification = lazy(
  () => import("./pages/CertificateVerification"),
);

const ChallengeWorkspace = lazy(() => import("./game/ChallengeWorkspace"));
const MarketplacePage = lazy(() => import("./marketplace/MarketplacePage"));

// Skeletons (eagerly loaded — tiny)
import {
  SkeletonGenericPage,
  SkeletonAdminDashboard,
  SkeletonCode
} from "./common/SkeletonPrimitives";
import LoginSkeleton from "./auth/LoginSkeleton";
import HomeSkeleton from "./pages/HomeSkeleton";
import ProfileSkeleton from "./profile/ProfileSkeleton";
import MarketplacePageSkeleton from "./marketplace/MarketplacePageSkeleton";
import BuyXpPageSkeleton from "./pages/BuyXpPageSkeleton";

import { useInitializeApp } from "./hooks/useInitializeApp";
import MainLayout from "./common/MainLayout";
import { Toaster } from "./components/ui/sonner";

/**
 * AppContent — core routing layer.
 * Wrapped in memo so Router context changes don't cascade.
 */
const AppContent = memo(() => {
  const { user, authLoading } = useInitializeApp();

  // Root application loader (skeleton-only)
  if (authLoading) {
    return <SkeletonGenericPage />;
  }

  return (
    <ErrorBoundary>
      <Toaster />
      <div className="min-h-screen">
        <main>
          <MainLayout>
            <Routes>
              {/* Public Landing (Game Map) - Visible to all */}
              <Route
                path="/"
                element={
                  user ? (
                    <Suspense fallback={<HomeSkeleton />}>
                      <Home />
                    </Suspense>
                  ) : (
                    <Suspense fallback={<SkeletonGenericPage />}>
                      <LandingPage />
                    </Suspense>
                  )
                }
              />

              {/* Authentication - Public Only */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Suspense fallback={<LoginSkeleton />}>
                      <Login />
                    </Suspense>
                  </PublicOnlyRoute>
                }
              />

              {/* Redirect legacy routes to / */}
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* OAuth Callbacks */}
              <Route
                path="/auth/github/callback"
                element={
                  <Suspense fallback={<LoginSkeleton />}>
                    <OAuthCallback provider="github" />
                  </Suspense>
                }
              />
              <Route
                path="/auth/google/callback"
                element={
                  <Suspense fallback={<LoginSkeleton />}>
                    <OAuthCallback provider="google" />
                  </Suspense>
                }
              />

              {/* Admin Dashboard - Admin Only */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <Suspense fallback={<SkeletonAdminDashboard />}>
                      <AdminDashboard />
                    </Suspense>
                  </AdminRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<ProfileSkeleton />}>
                      <Profile />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<ProfileSkeleton />}>
                      <Profile />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/level/:id"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<SkeletonCode />}>
                      <ChallengeWorkspace />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<BuyXpPageSkeleton />}>
                      <BuyXpPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/buy-xp"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<BuyXpPageSkeleton />}>
                      <BuyXpPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/game"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<SkeletonGenericPage />}>
                      <GameRedirectPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/store"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<MarketplacePageSkeleton />}>
                      <MarketplacePage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Public Certificate Verification */}
              <Route
                path="/verify/:certificateId"
                element={
                  <Suspense fallback={<SkeletonGenericPage />}>
                    <CertificateVerification />
                  </Suspense>
                }
              />

              {/* Fallback */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Suspense fallback={<SkeletonAdminDashboard />}>
                      <AdminDashboard />
                    </Suspense>
                  </AdminRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </main>
      </div>
    </ErrorBoundary>
  );
});

AppContent.displayName = "AppContent";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
