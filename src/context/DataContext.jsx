import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getUsers,
  getSkills,
  getGoals,
  getActivities,
  getConnections,
  getNotifications,
  getUnlockedAchievements,
  getPreferences,
  addSkill as apiAddSkill,
  updateSkill as apiUpdateSkill,
  deleteSkill as apiDeleteSkill,
  addGoal as apiAddGoal,
  updateGoal as apiUpdateGoal,
  deleteGoal as apiDeleteGoal,
  addActivity as apiAddActivity,
  deleteActivity as apiDeleteActivity,
  sendConnectionRequest as apiSendConnectionRequest,
  updateConnectionStatus as apiUpdateConnectionStatus,
  markNotificationAsRead as apiMarkNotifRead,
  markAllNotificationsAsRead as apiMarkAllNotifsRead,
  exportDataJSON,
  importDataJSON,
  resetAllData as apiResetAllData
} from '../services/storageService';

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

  // Toast alert & modal state
  const [toast, setToast] = useState(null);
  const [unlockedAchievementModal, setUnlockedAchievementModal] = useState(null);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');

  const refreshAllData = () => {
    setUsers(getUsers());
    setSkills(getSkills());
    setGoals(getGoals());
    setActivities(getActivities());
    setConnections(getConnections());
    setNotifications(getNotifications());
    setAchievements(getUnlockedAchievements());
    setPreferences(getPreferences());
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
      setAchievements(getUnlockedAchievements());
      setNotifications(getNotifications());
      setUnlockedAchievementModal(newlyUnlocked[0]); // Show first unlocked badge
    }
  };

  // Skill Operations
  const handleAddSkill = (skillData) => {
    const newSkill = apiAddSkill({ userId: currentUser?.id, ...skillData });
    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    showToast(`Added "${newSkill.name}" to your skills!`);
    triggerAchievementCheck(null, null, updatedSkills, null);
    return newSkill;
  };

  const handleUpdateSkill = (id, fields) => {
    const updated = apiUpdateSkill(id, fields);
    const updatedSkills = skills.map((s) => (s.id === id ? updated : s));
    setSkills(updatedSkills);
    showToast('Skill updated successfully.');
    return updated;
  };

  const handleDeleteSkill = (id) => {
    const filtered = apiDeleteSkill(id);
    setSkills(filtered);
    showToast('Skill removed.', 'info');
  };

  // Goal Operations
  const handleAddGoal = (goalData) => {
    const newGoal = apiAddGoal({ userId: currentUser?.id, ...goalData });
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    showToast(`Learning goal "${newGoal.title}" created!`);
    triggerAchievementCheck(updatedGoals, null, null, null);
    return newGoal;
  };

  const handleUpdateGoal = (id, fields) => {
    const updated = apiUpdateGoal(id, fields);
    const updatedGoals = goals.map((g) => (g.id === id ? updated : g));
    setGoals(updatedGoals);
    showToast('Goal updated!');
    triggerAchievementCheck(updatedGoals, null, null, null);
    return updated;
  };

  const handleDeleteGoal = (id) => {
    const filtered = apiDeleteGoal(id);
    setGoals(filtered);
    showToast('Goal deleted.', 'info');
  };

  // Activity Operations
  const handleAddActivity = (activityData) => {
    const newAct = apiAddActivity({ userId: currentUser?.id, ...activityData });
    const updatedActs = [newAct, ...activities];
    setActivities(updatedActs);
    showToast(`Logged activity "${newAct.title}"! 🔥`);
    triggerAchievementCheck(null, updatedActs, null, null);
    return newAct;
  };

  const handleDeleteActivity = (id) => {
    const filtered = apiDeleteActivity(id);
    setActivities(filtered);
    showToast('Activity deleted from history.', 'info');
  };

  // Connection Operations
  const handleSendConnection = (receiverId) => {
    if (!currentUser) return;
    const conn = apiSendConnectionRequest(currentUser.id, receiverId);
    refreshAllData();
    showToast('Connection request sent!');
    triggerAchievementCheck(null, null, null, getConnections());
    return conn;
  };

  const handleUpdateConnection = (id, status) => {
    apiUpdateConnectionStatus(id, status);
    refreshAllData();
    showToast(`Connection status updated to ${status}.`);
  };

  // Notification Operations
  const handleMarkNotifRead = (id) => {
    apiMarkNotifRead(id);
    setNotifications(getNotifications());
  };

  const handleMarkAllNotifsRead = () => {
    if (!currentUser) return;
    apiMarkAllNotifsRead(currentUser.id);
    setNotifications(getNotifications());
    showToast('All notifications marked as read.');
  };

  // Import / Export / Reset
  const handleExportData = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillSwap_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported SkillSwap data successfully!');
  };

  const handleImportData = (jsonString) => {
    const result = importDataJSON(jsonString);
    if (result.success) {
      refreshAllData();
      showToast('Data imported and state restored successfully!');
      return true;
    } else {
      showToast(`Import failed: ${result.error}`, 'error');
      return false;
    }
  };

  const handleResetData = () => {
    apiResetAllData();
    refreshAllData();
    showToast('All data has been reset to demo state.', 'info');
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
        refreshAllData,

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
        markAllNotifsRead: handleMarkAllNotifsRead,

        exportData: handleExportData,
        importData: handleImportData,
        resetData: handleResetData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
