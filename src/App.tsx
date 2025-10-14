import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPageSimple';
import EstablishmentsListing from './pages/EstablishmentsListing';
import EstablishmentDetail from './pages/EstablishmentDetail';
import ProgramDetail from './pages/ProgramDetail';
import StudentProfile from './pages/StudentProfile';
import InstitutionRegistration from './pages/InstitutionRegistration';
import EducationAgentRegistration from './pages/EducationAgentRegistration';
import StudentAmbassadorRegistration from './pages/StudentAmbassadorRegistration';
import ScholarshipSponsorRegistration from './pages/ScholarshipSponsorRegistration';
import Services from './pages/Services';
import EducationTools from './pages/EducationTools';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/establishments" element={<EstablishmentsListing />} />
          <Route path="/establishments/:establishmentId" element={<EstablishmentDetail />} />
          <Route path="/programs/:programId" element={<ProgramDetail />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/institution-registration" element={<InstitutionRegistration />} />
          <Route path="/agent-registration" element={<EducationAgentRegistration />} />
          <Route path="/ambassador-registration" element={<StudentAmbassadorRegistration />} />
          <Route path="/sponsor-registration" element={<ScholarshipSponsorRegistration />} />
          <Route path="/services" element={<Services />} />
          <Route path="/education-tools" element={<EducationTools />} />
          
          {/* Routes protégées */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;