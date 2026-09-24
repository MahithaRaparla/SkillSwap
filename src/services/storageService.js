import {
  INITIAL_USERS,
  INITIAL_SKILLS,
  INITIAL_GOALS,
  INITIAL_ACTIVITIES,
  INITIAL_CONNECTIONS,
  INITIAL_NOTIFICATIONS
} from '../data/demoData';

const KEYS = {
  USERS: 'skillswap_users',
  CURRENT_USER: 'skillswap_current_user',
  SKILLS: 'skillswap_skills',
  GOALS: 'skillswap_goals',
  ACTIVITIES: 'skillswap_activities',
  CONNECTIONS: 'skillswap_connections',
  NOTIFICATIONS: 'skillswap_notifications',
  ACHIEVEMENTS: 'skillswap_achievements',
  PREFERENCES: 'skillswap_preferences'
};

// Safe JSON parser
const safeParse = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage`, err);
    return fallback;
  }
};

// Safe JSON writer
const safeSave = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to LocalStorage`, err);
    return false;
  }
};

// Seed LocalStorage if not already present
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    safeSave(KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(KEYS.SKILLS)) {
    safeSave(KEYS.SKILLS, INITIAL_SKILLS);
  }
  if (!localStorage.getItem(KEYS.GOALS)) {
    safeSave(KEYS.GOALS, INITIAL_GOALS);
  }
  if (!localStorage.getItem(KEYS.ACTIVITIES)) {
    safeSave(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }
  if (!localStorage.getItem(KEYS.CONNECTIONS)) {
    safeSave(KEYS.CONNECTIONS, INITIAL_CONNECTIONS);
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    safeSave(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
    safeSave(KEYS.ACHIEVEMENTS, ['first_step', 'skill_explorer', 'community_builder']);
  }
  if (!localStorage.getItem(KEYS.PREFERENCES)) {
    safeSave(KEYS.PREFERENCES, {
      categories: ['Programming & Tech', 'Design & UI/UX'],
      notificationsEnabled: true,
      publicVisibility: true,
      recommendationEngine: true
    });
  }
};

// User Operations
export const getUsers = () => safeParse(KEYS.USERS, INITIAL_USERS);
export const saveUsers = (users) => safeSave(KEYS.USERS, users);

export const getCurrentUser = () => safeParse(KEYS.CURRENT_USER, null);
export const setCurrentUser = (user) => {
  if (user) {
    safeSave(KEYS.CURRENT_USER, user);
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id || u._id === user._id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...user };
      saveUsers(users);
    }
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
};

export const login = (emailOrUsername, password) => {
  const users = getUsers();
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
      u.username.toLowerCase() === emailOrUsername.toLowerCase()
  );

  if (found) {
    setCurrentUser(found);
    return { success: true, user: found, token: `demo_token_${found.id || found._id}` };
  }

  return { success: false, error: 'Invalid email/username or password.' };
};

export const register = (userData) => {
  const users = getUsers();
  const newUser = {
    id: `u_${Date.now()}`,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'Student',
    location: 'San Francisco, CA',
    bio: 'New learner on SkillBridge!',
    interests: ['Programming', 'Design'],
    ...userData
  };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return { success: true, user: newUser, token: `demo_token_${newUser.id}` };
};

export const updateUserProfile = (userId, updatedFields) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedFields };
    saveUsers(users);
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[index]);
    }
    return users[index];
  }
  return null;
};

// Skill Operations
export const getSkills = () => safeParse(KEYS.SKILLS, INITIAL_SKILLS);
export const saveSkills = (skills) => safeSave(KEYS.SKILLS, skills);

export const addSkill = (skillData) => {
  const skills = getSkills();
  const newSkill = {
    id: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    active: true,
    ...skillData
  };
  skills.push(newSkill);
  saveSkills(skills);
  return newSkill;
};

export const updateSkill = (id, updatedFields) => {
  const skills = getSkills();
  const index = skills.findIndex((s) => s.id === id);
  if (index !== -1) {
    skills[index] = { ...skills[index], ...updatedFields };
    saveSkills(skills);
    return skills[index];
  }
  return null;
};

export const deleteSkill = (id) => {
  const skills = getSkills();
  const filtered = skills.filter((s) => s.id !== id);
  saveSkills(filtered);
  return filtered;
};

// Goal Operations
export const getGoals = () => safeParse(KEYS.GOALS, INITIAL_GOALS);
export const saveGoals = (goals) => safeSave(KEYS.GOALS, goals);

export const addGoal = (goalData) => {
  const goals = getGoals();
  const newGoal = {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    startDate: new Date().toISOString().split('T')[0],
    currentProgress: goalData.currentProgress || 0,
    status: 'Active',
    milestones: goalData.milestones || [],
    ...goalData
  };
  goals.push(newGoal);
  saveGoals(goals);
  return newGoal;
};

export const updateGoal = (id, updatedFields) => {
  const goals = getGoals();
  const index = goals.findIndex((g) => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updatedFields };
    // Auto calculate progress from milestones if milestones were updated
    if (updatedFields.milestones && updatedFields.milestones.length > 0) {
      const completed = updatedFields.milestones.filter((m) => m.completed).length;
      goals[index].currentProgress = Math.round((completed / updatedFields.milestones.length) * 100);
      if (goals[index].currentProgress === 100) {
        goals[index].status = 'Completed';
      }
    }
    saveGoals(goals);
    return goals[index];
  }
  return null;
};

export const deleteGoal = (id) => {
  const goals = getGoals();
  const filtered = goals.filter((g) => g.id !== id);
  saveGoals(filtered);
  return filtered;
};

// Activity Operations
export const getActivities = () => safeParse(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
export const saveActivities = (activities) => safeSave(KEYS.ACTIVITIES, activities);

export const addActivity = (activityData) => {
  const activities = getActivities();
  const newActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    date: new Date().toISOString().split('T')[0],
    ...activityData
  };
  activities.unshift(newActivity);
  saveActivities(activities);
  return newActivity;
};

export const deleteActivity = (id) => {
  const activities = getActivities();
  const filtered = activities.filter((a) => a.id !== id);
  saveActivities(filtered);
  return filtered;
};

// Connections Operations
export const getConnections = () => safeParse(KEYS.CONNECTIONS, INITIAL_CONNECTIONS);
export const saveConnections = (connections) => safeSave(KEYS.CONNECTIONS, connections);

export const sendConnectionRequest = (requesterId, receiverId) => {
  const connections = getConnections();
  const existing = connections.find(
    (c) => (c.requesterId === requesterId && c.receiverId === receiverId) ||
           (c.requesterId === receiverId && c.receiverId === requesterId)
  );

  if (existing) return existing;

  const newConn = {
    id: `conn_${Date.now()}`,
    requesterId,
    receiverId,
    status: 'Pending',
    createdAt: new Date().toISOString().split('T')[0]
  };

  connections.push(newConn);
  saveConnections(connections);
  return newConn;
};

export const updateConnectionStatus = (id, status) => {
  const connections = getConnections();
  const index = connections.findIndex((c) => c.id === id);
  if (index !== -1) {
    if (status === 'Removed' || status === 'Rejected') {
      connections.splice(index, 1);
    } else {
      connections[index].status = status;
    }
    saveConnections(connections);
    return true;
  }
  return false;
};

// Notifications Operations
export const getNotifications = () => safeParse(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
export const saveNotifications = (notifs) => safeSave(KEYS.NOTIFICATIONS, notifs);

export const addNotification = (notif) => {
  const notifications = getNotifications();
  const newNotif = {
    id: `notif_${Date.now()}`,
    read: false,
    date: new Date().toISOString(),
    ...notif
  };
  notifications.unshift(newNotif);
  saveNotifications(notifications);
  return newNotif;
};

export const markNotificationAsRead = (id) => {
  const notifications = getNotifications();
  const index = notifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
  }
};

export const markAllNotificationsAsRead = (userId) => {
  const notifications = getNotifications();
  const updated = notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n));
  saveNotifications(updated);
};

// Achievements Operations
export const getUnlockedAchievements = () => safeParse(KEYS.ACHIEVEMENTS, ['first_step', 'skill_explorer', 'community_builder']);
export const saveUnlockedAchievements = (achievements) => safeSave(KEYS.ACHIEVEMENTS, achievements);

export const unlockAchievementInStorage = (achievementId) => {
  const current = getUnlockedAchievements();
  if (!current.includes(achievementId)) {
    current.push(achievementId);
    saveUnlockedAchievements(current);
    return true; // Newly unlocked
  }
  return false;
};

// Preferences
export const getPreferences = () => safeParse(KEYS.PREFERENCES, {});
export const savePreferences = (prefs) => safeSave(KEYS.PREFERENCES, prefs);

// Data Export & Backup Services
export const exportDataJSON = () => {
  const data = {
    users: getUsers(),
    currentUser: getCurrentUser(),
    skills: getSkills(),
    goals: getGoals(),
    activities: getActivities(),
    connections: getConnections(),
    notifications: getNotifications(),
    achievements: getUnlockedAchievements(),
    preferences: getPreferences(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importDataJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.users || !data.skills) {
      throw new Error('Invalid SkillSwap backup data structure');
    }
    if (data.users) safeSave(KEYS.USERS, data.users);
    if (data.currentUser) safeSave(KEYS.CURRENT_USER, data.currentUser);
    if (data.skills) safeSave(KEYS.SKILLS, data.skills);
    if (data.goals) safeSave(KEYS.GOALS, data.goals);
    if (data.activities) safeSave(KEYS.ACTIVITIES, data.activities);
    if (data.connections) safeSave(KEYS.CONNECTIONS, data.connections);
    if (data.notifications) safeSave(KEYS.NOTIFICATIONS, data.notifications);
    if (data.achievements) safeSave(KEYS.ACHIEVEMENTS, data.achievements);
    if (data.preferences) safeSave(KEYS.PREFERENCES, data.preferences);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const resetAllData = () => {
  localStorage.clear();
  initializeStorage();
};
