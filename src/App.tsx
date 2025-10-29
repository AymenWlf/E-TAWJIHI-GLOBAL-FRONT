import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import { ToastProvider, useToastContext } from './contexts/ToastContext';

// Lazy loading des pages pour de meilleures performances
const LandingPage = lazy(() => import('./pages/LandingPageSimple'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const EstablishmentsListing = lazy(() => import('./pages/EstablishmentsListing'));
const EstablishmentDetail = lazy(() => import('./pages/EstablishmentDetail'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const ApplicationWizard = lazy(() => import('./components/ApplicationWizard'));
const StudentProfile = lazy(() => import('./pages/StudentProfileUpdated'));
const InstitutionRegistration = lazy(() => import('./pages/InstitutionRegistration'));
const EducationAgentRegistration = lazy(() => import('./pages/EducationAgentRegistration'));
const StudentAmbassadorRegistration = lazy(() => import('./pages/StudentAmbassadorRegistration'));
const ScholarshipSponsorRegistration = lazy(() => import('./pages/ScholarshipSponsorRegistration'));
const Services = lazy(() => import('./pages/Services'));
const EducationTools = lazy(() => import('./pages/EducationTools'));
const AuthTestPage = lazy(() => import('./pages/AuthTestPage'));
const DesignSystem = lazy(() => import('./components/DesignSystem'));
const HeaderComparison = lazy(() => import('./components/HeaderComparison'));
const ProfileNavigationPage = lazy(() => import('./pages/ProfileNavigationPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminEstablishmentEdit = lazy(() => import('./pages/AdminEstablishmentEdit'));
const AdminProgramEdit = lazy(() => import('./pages/AdminProgramEdit'));
const AdminParameters = lazy(() => import('./pages/AdminParameters.jsx'));
const ApplicationProcess = lazy(() => import('./pages/ApplicationProcess'));

// Composant de chargement
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

function AppContent() {
  const { toasts, removeToast } = useToastContext();
  
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/establishments" element={<EstablishmentsListing />} />
              <Route path="/establishments/:slug" element={<EstablishmentDetail />} />
              <Route path="/programs/:establishmentSlug/:programSlug" element={<ProgramDetail />} />
              <Route path="/apply/:programId" element={<ApplicationWizard />} />
              <Route path="/application-process" element={<Navigate to="/" replace />} />
              <Route path="/application/process" element={<Navigate to="/" replace />} />
              <Route path="/application/:establishmentId/:programId" element={<ApplicationProcess />} />
              <Route path="/institution-registration" element={<InstitutionRegistration />} />
              <Route path="/agent-registration" element={<EducationAgentRegistration />} />
              <Route path="/ambassador-registration" element={<StudentAmbassadorRegistration />} />
              <Route path="/sponsor-registration" element={<ScholarshipSponsorRegistration />} />
              <Route path="/services" element={<Services />} />
              <Route path="/education-tools" element={<EducationTools />} />
              <Route path="/auth-test" element={<AuthTestPage />} />
              <Route path="/design-system" element={<DesignSystem />} />
              <Route path="/header-comparison" element={<HeaderComparison />} />
              
              {/* Routes d'authentification (redirigent si déjà connecté) */}
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <ForgotPasswordPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reset-password" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <ResetPasswordPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes protégées */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:section" 
                element={
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:section/:subsection" 
                element={
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile-navigation" 
                element={
                  <ProtectedRoute>
                    <ProfileNavigationPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes d'administration */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/parameters" 
                element={
                  <ProtectedRoute>
                    <AdminParameters />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/establishments/new" 
                element={
                  <ProtectedRoute>
                    <AdminEstablishmentEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/establishments/:id/edit" 
                element={
                  <ProtectedRoute>
                    <AdminEstablishmentEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/programs/new" 
                element={
                  <ProtectedRoute>
                    <AdminProgramEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/programs/:id/edit" 
                element={
                  <ProtectedRoute>
                    <AdminProgramEdit />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Router>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CurrencyProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </CurrencyProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;