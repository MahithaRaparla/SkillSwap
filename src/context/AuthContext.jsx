import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser as saveCurrentUserToStorage, getUsers, saveUsers, initializeStorage } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = (emailOrUsername, password) => {
    const users = getUsers();
    const found = users.find(
      (u) => (u.email.toLowerCase() === emailOrUsername.toLowerCase() || u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
             u.password === password
    );

    if (found) {
      setCurrentUser(found);
      saveCurrentUserToStorage(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid email/username or password.' };
  };

  const register = (userData) => {
    const users = getUsers();
    
    // Check duplicates
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (users.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())) {
      return { success: false, error: 'Username is already taken.' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      portfolio: '',
      github: '',
      linkedin: '',
      bio: userData.bio || 'New learner on SkillSwap eager to share and discover skills!',
      interests: userData.interests || ['Programming'],
      ...userData
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    saveCurrentUserToStorage(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skillswap_current_user');
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);
    saveCurrentUserToStorage(updatedUser);
  };

  const loginAsDemoUser = (userId) => {
    const users = getUsers();
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      saveCurrentUserToStorage(target);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        loginAsDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
