import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const res = await axios.get('/api/auth/me');
          
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            // Clear localStorage if token is invalid
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.user.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.user.token}`;
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post('/api/auth/login', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.user.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.user.token}`;
        setUser(res.data.user);
        return { success: true };
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
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put('/api/users/profile', userData);
      
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
      const res = await axios.get('/api/users/usage');
      
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
