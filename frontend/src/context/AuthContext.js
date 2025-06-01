import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Set auth token header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const res = await api.get('/api/auth/me');
          
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            // Clear localStorage if token is invalid
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      console.log('Attempting to register user:', userData.email);
      const res = await api.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      if (res.data && res.data.success) {
        console.log('Registration successful:', res.data.user.email);
        localStorage.setItem('token', res.data.user.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.user.token}`;
        setUser(res.data.user);
        return { success: true };
      } else {
        console.error('Registration failed:', res.data?.message || 'Unknown error');
        return { 
          success: false, 
          message: res.data?.message || 'Registration failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data?.message || 
                     `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || 'Error setting up registration request';
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      console.log('Attempting to login user:', userData.email);
      const res = await api.post('/api/auth/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      if (res.data && res.data.success) {
        console.log('Login successful:', res.data.user.email);
        localStorage.setItem('token', res.data.user.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.user.token}`;
        setUser(res.data.user);
        return { success: true };
      } else {
        console.error('Login failed:', res.data?.message || 'Unknown error');
        return { 
          success: false, 
          message: res.data?.message || 'Login failed. Please try again.' 
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await api.put('/api/users/profile', userData);
      
      if (res.data.success) {
        setUser({ ...user, ...res.data.user });
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  // Get user usage
  const getUserUsage = async () => {
    try {
      const res = await api.get('/api/users/usage');
      
      if (res.data.success) {
        return { success: true, usage: res.data.usage };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get usage data'
      };
    }
  };

  // Update user plan
  const updateUserPlan = (planData) => {
    setUser({ ...user, ...planData });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        getUserUsage,
        updateUserPlan
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
