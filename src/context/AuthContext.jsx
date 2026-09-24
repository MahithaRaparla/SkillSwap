import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import * as storageService from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('skillswap_token');
      if (token) {
        try {
          const user = await api.getCurrentUser();
          if (user && (user.id || user._id)) {
            setCurrentUser(user);
            storageService.setCurrentUser(user);
          } else {
            localStorage.removeItem('skillswap_token');
            storageService.setCurrentUser(null);
            setCurrentUser(null);
          }
        } catch (error) {
          console.warn('Invalid or expired authentication token:', error.message);
          localStorage.removeItem('skillswap_token');
          storageService.setCurrentUser(null);
          setCurrentUser(null);
        }
      } else {
        localStorage.removeItem('skillswap_token');
        storageService.setCurrentUser(null);
        setCurrentUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const data = await api.login(emailOrUsername, password);
      if (data && data.token) {
        localStorage.setItem('skillswap_token', data.token);
        setCurrentUser(data);
        storageService.setCurrentUser(data);
        return { success: true, user: data };
      }
      return { success: false, error: data?.message || 'Invalid email/username or password.' };
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message || 'Invalid email/username or password.' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data && data.token) {
        localStorage.setItem('skillswap_token', data.token);
        setCurrentUser(data);
        storageService.setCurrentUser(data);
        return { success: true, user: data };
      }
      return { success: false, error: data?.message || 'Registration failed.' };
    } catch (error) {
      console.error('Registration error:', error.message);
      return { success: false, error: error.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    storageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const updateProfile = async (updatedFields) => {
    try {
      const updatedUser = await api.updateProfile(updatedFields);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        storageService.setCurrentUser(updatedUser);
        return { success: true, user: updatedUser };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
