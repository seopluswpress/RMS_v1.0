import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

/**
 * Custom hook to get user information from JWT token
 * @returns {Object} User information and loading state
 */
const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserFromToken = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserFromToken();
  }, []);

  return { user, loading };
};

export default useUser;
