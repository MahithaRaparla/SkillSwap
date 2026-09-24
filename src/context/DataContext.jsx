import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import * as storageService from '../services/storageService';
import { checkAndUnlockAchievements } from '../services/achievementService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [connections, setConnections] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loadingData, setLoadingData] = useState(false);

  // Toast alert & modal state
  const [toast, setToast] = useState(null);
  const [unlockedAchievementModal, setUnlockedAchievementModal] = useState(null);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    storageService.initializeStorage();
  }, []);

  const refreshAllData = async () => {
    setLoadingData(true);
    try {
      const usersData = await api.getUsers();
      setUsers(usersData);
      storageService.saveUsers(usersData);

      const skillsData = await api.getSkills();
      setSkills(skillsData);
      storageService.saveSkills(skillsData);

      if (currentUser) {
        const goalsData = await api.getGoals();
        setGoals(goalsData);
        storageService.saveGoals(goalsData);

        const activitiesData = await api.getActivities();
        setActivities(activitiesData);
        storageService.saveActivities(activitiesData);

        const connectionsData = await api.getConnections();
        setConnections(connectionsData);
        storageService.saveConnections(connectionsData);

        const notifsData = await api.getNotifications();
        setNotifications(notifsData);
        storageService.saveNotifications(notifsData);
      }
    } catch (error) {
      console.warn('Backend API unavailable, using local storage:', error.message);
      setUsers(storageService.getUsers());
      setSkills(storageService.getSkills());

      if (currentUser) {
        setGoals(storageService.getGoals());
        setActivities(storageService.getActivities());
        setConnections(storageService.getConnections());
        setNotifications(storageService.getNotifications());
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [currentUser?.id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clearToast = () => {
    setToast(null);
  };

  // Achievement unlock check helper
  const triggerAchievementCheck = (updatedGoals, updatedActivities, updatedSkills, updatedConnections) => {
    if (!currentUser) return;
    const newlyUnlocked = checkAndUnlockAchievements(
      currentUser.id,
      updatedGoals || goals,
      updatedActivities || activities,
      updatedSkills || skills,
      updatedConnections || connections
    );

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievementModal(newlyUnlocked[0]);
    }
  };

  // Skill Operations
  const handleAddSkill = async (skillData) => {
    let newSkill;
    try {
      newSkill = await api.addSkill(skillData);
    } catch (error) {
      console.warn('API addSkill failed, adding locally:', error.message);
      newSkill = storageService.addSkill({ userId: currentUser?.id, ...skillData });
    }
    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    showToast(`Added "${newSkill.name}" to your skills!`);
    triggerAchievementCheck(null, null, updatedSkills, null);
    return newSkill;
  };

  const handleUpdateSkill = async (id, fields) => {
    let updated;
    try {
      updated = await api.updateSkill(id, fields);
    } catch (error) {
      console.warn('API updateSkill failed, updating locally:', error.message);
      updated = storageService.updateSkill(id, fields);
    }
    if (updated) {
      const updatedSkills = skills.map((s) => (s.id === id ? updated : s));
      setSkills(updatedSkills);
      showToast('Skill updated successfully.');
      return updated;
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.deleteSkill(id);
    } catch (error) {
      console.warn('API deleteSkill failed, removing locally:', error.message);
      storageService.deleteSkill(id);
    }
    const filtered = skills.filter((s) => s.id !== id);
    setSkills(filtered);
    showToast('Skill removed.', 'info');
  };

  // Goal Operations
  const handleAddGoal = async (goalData) => {
    let newGoal;
    try {
      newGoal = await api.addGoal(goalData);
    } catch (error) {
      console.warn('API addGoal failed, adding locally:', error.message);
      newGoal = storageService.addGoal({ userId: currentUser?.id, ...goalData });
    }
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    showToast(`Learning goal "${newGoal.title}" created!`);
    triggerAchievementCheck(updatedGoals, null, null, null);
    return newGoal;
  };

  const handleUpdateGoal = async (id, fields) => {
    let updated;
    try {
      updated = await api.updateGoal(id, fields);
    } catch (error) {
      console.warn('API updateGoal failed, updating locally:', error.message);
      updated = storageService.updateGoal(id, fields);
    }
    if (updated) {
      const updatedGoals = goals.map((g) => (g.id === id ? updated : g));
      setGoals(updatedGoals);
      showToast('Goal updated!');
      triggerAchievementCheck(updatedGoals, null, null, null);
      return updated;
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await api.deleteGoal(id);
    } catch (error) {
      console.warn('API deleteGoal failed, removing locally:', error.message);
      storageService.deleteGoal(id);
    }
    const filtered = goals.filter((g) => g.id !== id);
    setGoals(filtered);
    showToast('Goal deleted.', 'info');
  };

  // Activity Operations
  const handleAddActivity = async (activityData) => {
    let newAct;
    try {
      newAct = await api.addActivity(activityData);
    } catch (error) {
      console.warn('API addActivity failed, adding locally:', error.message);
      newAct = storageService.addActivity({ userId: currentUser?.id, ...activityData });
    }
    const updatedActs = [newAct, ...activities];
    setActivities(updatedActs);
    showToast(`Logged activity "${newAct.title}"! 🔥`);
    triggerAchievementCheck(null, updatedActs, null, null);
    return newAct;
  };

  const handleDeleteActivity = async (id) => {
    try {
      await api.deleteActivity(id);
    } catch (error) {
      console.warn('API deleteActivity failed, removing locally:', error.message);
      storageService.deleteActivity(id);
    }
    const filtered = activities.filter((a) => a.id !== id);
    setActivities(filtered);
    showToast('Activity deleted from history.', 'info');
  };

  // Connection Operations
  const handleSendConnection = async (receiverId) => {
    if (!currentUser) return;
    let conn;
    try {
      conn = await api.sendConnectionRequest(receiverId);
      await refreshAllData();
    } catch (error) {
      console.warn('API sendConnectionRequest failed, adding locally:', error.message);
      conn = storageService.sendConnectionRequest(currentUser.id, receiverId);
      setConnections(storageService.getConnections());
    }
    showToast('Connection request sent!');
    triggerAchievementCheck(null, null, null, connections);
    return conn;
  };

  const handleUpdateConnection = async (id, status) => {
    try {
      await api.updateConnectionStatus(id, status);
      await refreshAllData();
    } catch (error) {
      console.warn('API updateConnectionStatus failed, updating locally:', error.message);
      storageService.updateConnectionStatus(id, status);
      setConnections(storageService.getConnections());
    }
    showToast(`Connection status updated to ${status}.`);
  };

  // Notification Operations
  const handleMarkNotifRead = async (id) => {
    try {
      await api.markNotifRead(id);
    } catch (error) {
      storageService.markNotificationAsRead(id);
    }
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
  };

  const handleMarkAllNotifsRead = async () => {
    if (!currentUser) return;
    try {
      await api.markAllNotifsRead();
    } catch (error) {
      storageService.markAllNotificationsAsRead(currentUser.id);
    }
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    showToast('All notifications marked as read.');
  };

  return (
    <DataContext.Provider
      value={{
        users,
        skills,
        goals,
        activities,
        connections,
        notifications,
        achievements,
        preferences,
        toast,
        unlockedAchievementModal,
        setUnlockedAchievementModal,
        searchQuery,
        setSearchQuery,
        showToast,
        clearToast,
        refreshAllData,
        loadingData,

        // Handlers
        addSkill: handleAddSkill,
        updateSkill: handleUpdateSkill,
        deleteSkill: handleDeleteSkill,

        addGoal: handleAddGoal,
        updateGoal: handleUpdateGoal,
        deleteGoal: handleDeleteGoal,

        addActivity: handleAddActivity,
        deleteActivity: handleDeleteActivity,

        sendConnectionRequest: handleSendConnection,
        updateConnectionStatus: handleUpdateConnection,

        markNotifRead: handleMarkNotifRead,
        markAllNotifsRead: handleMarkAllNotifsRead
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
