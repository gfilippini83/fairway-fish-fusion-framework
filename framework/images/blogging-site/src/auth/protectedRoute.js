import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { useAuthSync } from './authSync';

const ProtectedRoute = ({ element }) => {
  const auth = useAuth();
  useAuthSync(); // Synchronize authentication state

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    const storedUser = localStorage.getItem('user');
    if(!storedUser){
      return <Navigate to={auth.signinRedirect()} />;
    }
  }

  return element;
};

export default ProtectedRoute;