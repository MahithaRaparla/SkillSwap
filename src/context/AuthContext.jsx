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
          setCurrentUser(user);
          storageService.setCurrentUser(user);
        } catch (error) {
          console.warn('Backend Auth Error, using local session:', error.message);
          const localUser = storageService.getCurrentUser();
          if (localUser) {
            setCurrentUser(localUser);
          } else {
            localStorage.removeItem('skillswap_token');
            setCurrentUser(null);
          }
        }
      } else {
        const localUser = storageService.getCurrentUser();
        if (localUser) {
          setCurrentUser(localUser);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const data = await api.login(emailOrUsername, password);
      if (data.token) {
        localStorage.setItem('skillswap_token', data.token);
      }
      setCurrentUser(data);
      storageService.setCurrentUser(data);
      return { success: true, user: data };
    } catch (error) {
      console.warn('API login failed, using local authentication:', error.message);
      const res = storageService.login(emailOrUsername, password);
      if (res.token) {
        localStorage.setItem('skillswap_token', res.token);
      }
      setCurrentUser(res.user);
      return res;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data.token) {
        localStorage.setItem('skillswap_token', data.token);
      }
      setCurrentUser(data);
      storageService.setCurrentUser(data);
      return { success: true, user: data };
    } catch (error) {
      console.warn('API register failed, registering locally:', error.message);
      const res = storageService.register(userData);
      if (res.token) {
        localStorage.setItem('skillswap_token', res.token);
      }
      setCurrentUser(res.user);
      return res;
    }
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    setCurrentUser(null);
  };

  const updateProfile = async (updatedFields) => {
    try {
      const updatedUser = await api.updateProfile(updatedFields);
      setCurrentUser(updatedUser);
      storageService.setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.warn('API updateProfile failed, updating locally:', error.message);
      const updated = storageService.updateUserProfile(currentUser.id, updatedFields);
      if (updated) {
        setCurrentUser(updated);
        return { success: true, user: updated };
      }
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
