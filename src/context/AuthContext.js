import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        // Set basic authenticated user state
        setUser({ isAuthenticated: true });
        
        // Try to fetch personal info, but don't block authentication if it fails
        try {
          const personalInfoResponse = await axios.get(`http://dordod.com/api/personal-info/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(prev => ({ ...prev, ...personalInfoResponse.data }));
        } catch (error) {
          console.log('No personal info found for user');
        }

        setLoading(false);
        return true;
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setLoading(false);
        return false;
      }
    } else {
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`http://dordod.com/api/login/`, {
        email,
        password
      });
      
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        
        // Set basic authenticated user state immediately
        setUser({ 
          isAuthenticated: true,
          email: email // Store at least the email
        });

        navigate('/dashboard'); // Navigate immediately after successful login
        
        // Try to fetch personal info in the background
        try {
          const personalInfoResponse = await axios.get(`http://dordod.com/api/personal-info/`, {
            headers: {
              'Authorization': `Bearer ${response.data.access}`
            }
          });
          setUser(prev => ({ ...prev, ...personalInfoResponse.data }));
        } catch (error) {
          console.log('No personal info found for user');
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: 'Invalid response from server'
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/');
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      logout();
      return;
    }

    try {
      const response = await axios.post(`http://dordod.com/api/auth/refresh/`, {
        refresh
      });
      localStorage.setItem('accessToken', response.data.access);
      return response.data.access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  // Axios interceptor for token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      refreshToken,
      isAuthenticated: !!user?.isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 