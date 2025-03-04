import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

export const useAuthSync = () => {
  const auth = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !auth.isAuthenticated && !auth.isLoading && !auth.error) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          auth.signinSilent()
          .catch((error)=>{
            console.error("error during silent login during local storage sync", error);
            localStorage.removeItem('user');
          });
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, [auth]);
};