import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThreatProvider } from './context/ThreatContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/guard/ProtectedRoute';
import { AdminRoute } from './components/guard/AdminRoute';
import { CardSkeleton } from './components/common/SkeletonLoader';

// Lazy-loaded Pages for Bundle Size & Code Splitting Optimization
const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard').then(m => ({ default: m.UserDashboard })));
const OrgDashboard = lazy(() => import('./pages/dashboard/OrgDashboard').then(m => ({ default: m.OrgDashboard })));
const UniversalSecurityCenter = lazy(() => import('./pages/security-center/UniversalSecurityCenter').then(m => ({ default: m.UniversalSecurityCenter })));
const ThreatIntelPage = lazy(() => import('./pages/threat-intel/ThreatIntelPage').then(m => ({ default: m.ThreatIntelPage })));
const ScanTimelinePage = lazy(() => import('./pages/timeline/ScanTimelinePage').then(m => ({ default: m.ScanTimelinePage })));
const RecommendationCenter = lazy(() => import('./pages/recommendations/RecommendationCenter').then(m => ({ default: m.RecommendationCenter })));

const ModuleDirectory = lazy(() => import('./pages/modules/ModuleDirectory').then(m => ({ default: m.ModuleDirectory })));
const PhishingScanner = lazy(() => import('./pages/modules/PhishingScanner').then(m => ({ default: m.PhishingScanner })));
const ScamTextScanner = lazy(() => import('./pages/modules/ScamTextScanner').then(m => ({ default: m.ScamTextScanner })));
const FakeWebsiteScanner = lazy(() => import('./pages/modules/FakeWebsiteScanner').then(m => ({ default: m.FakeWebsiteScanner })));
const QrCodeScanner = lazy(() => import('./pages/modules/QrCodeScanner').then(m => ({ default: m.QrCodeScanner })));
const DocScanner = lazy(() => import('./pages/modules/DocScanner').then(m => ({ default: m.DocScanner })));
const PrivacyLeakScanner = lazy(() => import('./pages/modules/PrivacyLeakScanner').then(m => ({ default: m.PrivacyLeakScanner })));
const ThreatHistoryPage = lazy(() => import('./pages/history/ThreatHistoryPage').then(m => ({ default: m.ThreatHistoryPage })));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/user/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

const AttackSimulatorPage = lazy(() => import('./pages/modules/AttackSimulatorPage'));
const SecurityCopilotPage = lazy(() => import('./pages/copilot/SecurityCopilotPage'));
const DataBreachMonitorPage = lazy(() => import('./pages/breach/DataBreachMonitorPage'));
const IncidentResponseCenter = lazy(() => import('./pages/incident/IncidentResponseCenter'));
const IncidentManagementPage = lazy(() => import('./pages/incidents/IncidentManagementPage'));

import { PageTransition } from './components/common/PageTransition';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AmbientCursorGlow } from './components/common/AmbientCursorGlow';
import { AegisBootIntro } from './components/common/AegisBootIntro';
import { AegisParticles } from './components/common/AegisParticles';

// Page Loading Suspense Fallback
const PageFallback = () => (
  <div className="space-y-4 p-4">
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

// Main App Layout Wrapper
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0b08] text-[#f2e8d8] antialiased selection:bg-[#d98a3d]/30 selection:text-[#d98a3d] relative">
      <AegisParticles count={150} />
      <AmbientCursorGlow />
      <Navbar />
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative z-10">
        <Sidebar />
        <main className="flex-1 min-w-0" tabIndex={-1}>
          <ErrorBoundary>
            <Suspense fallback={<PageFallback />}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThreatProvider>
          <ToastProvider>
            <BrowserRouter>
              <AegisBootIntro />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* Public Guest Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Authenticated User Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                      <Route path="/app/dashboard" element={<UserDashboard />} />
                      <Route path="/app/security-center" element={<UniversalSecurityCenter />} />
                      <Route path="/app/threat-intelligence" element={<ThreatIntelPage />} />
                      <Route path="/app/timeline" element={<ScanTimelinePage />} />
                      <Route path="/app/recommendations" element={<RecommendationCenter />} />
                      <Route path="/app/org-dashboard" element={<OrgDashboard />} />

                      <Route path="/app/simulator" element={<AttackSimulatorPage />} />
                      <Route path="/app/copilot" element={<SecurityCopilotPage />} />
                      <Route path="/app/breach-monitor" element={<DataBreachMonitorPage />} />
                      <Route path="/app/incident-response" element={<IncidentResponseCenter />} />
                      <Route path="/app/cases" element={<IncidentManagementPage />} />

                      <Route path="/app/modules" element={<ModuleDirectory />} />
                      <Route path="/app/modules/phishing" element={<PhishingScanner />} />
                      <Route path="/app/modules/scam-text" element={<ScamTextScanner />} />
                      <Route path="/app/modules/fake-website" element={<FakeWebsiteScanner />} />
                      <Route path="/app/modules/qr-scanner" element={<QrCodeScanner />} />
                      <Route path="/app/modules/doc-scanner" element={<DocScanner />} />
                      <Route path="/app/modules/privacy-leak" element={<PrivacyLeakScanner />} />
                      <Route path="/app/history" element={<ThreatHistoryPage />} />
                      <Route path="/app/analytics" element={<AnalyticsPage />} />
                      <Route path="/app/profile" element={<ProfilePage />} />
                      <Route path="/app/settings" element={<SettingsPage />} />
                    </Route>
                  </Route>

                  {/* Admin Portal Routes */}
                  <Route element={<AdminRoute />}>
                    <Route element={<AppLayout />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                  </Route>

                  {/* Fallback Redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </ThreatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
