const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const getHeaders = (token) => {
  const authToken = token || localStorage.getItem('skillswap_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const error = (data && data.message) || res.statusText;
    throw new Error(error);
  }
  return data;
};

export const api = {
  // Auth APIs
  login: async (emailOrUsername, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ emailOrUsername, password })
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateProfile: async (updatedFields) => {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedFields)
    });
    return handleResponse(res);
  },

  // User Directory APIs
  getUsers: async (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_URL}/users${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getUserById: async (id) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Skill APIs
  getSkills: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/skills${query ? `?${query}` : ''}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addSkill: async (skillData) => {
    const res = await fetch(`${API_URL}/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(skillData)
    });
    return handleResponse(res);
  },

  updateSkill: async (id, updatedFields) => {
    const res = await fetch(`${API_URL}/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedFields)
    });
    return handleResponse(res);
  },

  deleteSkill: async (id) => {
    const res = await fetch(`${API_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Skill Request Exchange APIs
  sendRequest: async (requestData) => {
    const res = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(res);
  },

  getSentRequests: async () => {
    const res = await fetch(`${API_URL}/requests/sent`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getReceivedRequests: async () => {
    const res = await fetch(`${API_URL}/requests/received`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateRequestStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/requests/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Session APIs
  getSessions: async () => {
    const res = await fetch(`${API_URL}/sessions`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addSession: async (sessionData) => {
    const res = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sessionData)
    });
    return handleResponse(res);
  },

  updateSession: async (id, sessionData) => {
    const res = await fetch(`${API_URL}/sessions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(sessionData)
    });
    return handleResponse(res);
  },

  deleteSession: async (id) => {
    const res = await fetch(`${API_URL}/sessions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Message APIs
  getMessages: async (userId) => {
    const res = await fetch(`${API_URL}/messages/${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  sendMessage: async (receiverId, content) => {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ receiverId, content })
    });
    return handleResponse(res);
  },

  markMessageRead: async (id) => {
    const res = await fetch(`${API_URL}/messages/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Review APIs
  getUserReviews: async (userId) => {
    const res = await fetch(`${API_URL}/reviews/user/${userId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addReview: async (reviewData) => {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    return handleResponse(res);
  },

  // Goal APIs
  getGoals: async () => {
    const res = await fetch(`${API_URL}/goals`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addGoal: async (goalData) => {
    const res = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(goalData)
    });
    return handleResponse(res);
  },

  updateGoal: async (id, updatedFields) => {
    const res = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedFields)
    });
    return handleResponse(res);
  },

  deleteGoal: async (id) => {
    const res = await fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Activity Log APIs
  getActivities: async () => {
    const res = await fetch(`${API_URL}/activities`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addActivity: async (activityData) => {
    const res = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activityData)
    });
    return handleResponse(res);
  },

  deleteActivity: async (id) => {
    const res = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Connection APIs
  getConnections: async () => {
    const res = await fetch(`${API_URL}/connections`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  sendConnectionRequest: async (receiverId) => {
    const res = await fetch(`${API_URL}/connections/request`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ receiverId })
    });
    return handleResponse(res);
  },

  updateConnectionStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/connections/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Notification APIs
  getNotifications: async () => {
    const res = await fetch(`${API_URL}/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  markNotifRead: async (id) => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  markAllNotifsRead: async () => {
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
