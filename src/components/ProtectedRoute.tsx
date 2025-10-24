import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthCheck } from '../hooks/useAuthCheck';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { currentUser, isLoading, token } = useAuth();
  const { currentUser: checkedUser, token: checkedToken } = useAuthCheck();
  const location = useLocation();

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = (currentUser || checkedUser) && (token || checkedToken);

  // Si on charge encore les données d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner text="Vérification de l'authentification..." />
      </div>
    );
  }

  // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si la route ne nécessite pas d'authentification et que l'utilisateur est connecté
  // (pour éviter que les utilisateurs connectés accèdent aux pages de login/register)
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/establishments';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
