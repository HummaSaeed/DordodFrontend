import axios from 'axios';

const api = axios.create({
  baseURL: 'http://dordod.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const goalsApi = {
  getAll: () => api.get('/goals/'),
  create: (data) => api.post('/goals/', data),
  update: (id, data) => api.put(`/goals/${id}/`, data),
  delete: (id) => api.delete(`/goals/${id}/`),
  share: (id, users) => api.post(`/goals/${id}/share/`, { users }),
  getTemplates: () => api.get('/goals/templates/'),
  getMilestones: (id) => api.get(`/goals/${id}/milestones/`),
  updateProgress: (id, progress) => api.put(`/goals/${id}/progress/`, { progress })
};

export const habitsApi = {
  getAll: () => api.get('/habits/'),
  create: (data) => api.post('/habits/', data),
  update: (id, data) => api.put(`/habits/${id}/`, data),
  delete: (id) => api.delete(`/habits/${id}/`),
  getStreak: (id) => api.get(`/habits/${id}/streak/`),
  logProgress: (id, date) => api.post(`/habits/${id}/log/`, { date })
};

// Add more API services for other features...

export const coachApi = {
  getProfile: () => api.get('/coaches/profile/'),
  updateProfile: (data) => api.post('/coaches/profile/', data),
  getCoaches: () => api.get('/coaches/'),
  rateCoach: (coachId, rating) => api.post(`/coaches/${coachId}/rate/`, { rating }),
  requestCoaching: (coachId) => api.post(`/coaches/${coachId}/request/`),
  getStudents: () => api.get('/coaches/students/'),
  getSessions: () => api.get('/coaches/sessions/'),
  createSession: (data) => api.post('/coaches/sessions/', data)
};

export const activitiesApi = {
  getAll: () => api.get('/activities/'),
  create: (data) => api.post('/activities/', data),
  update: (id, data) => api.put(`/activities/${id}/`, data),
  delete: (id) => api.delete(`/activities/${id}/`),
  getStats: () => api.get('/activities/stats/'),
  share: (id, users) => api.post(`/activities/${id}/share/`, { users })
};

export const accomplishmentsApi = {
  getAll: () => api.get('/accomplishments/'),
  create: (data) => api.post('/accomplishments/', data),
  update: (id, data) => api.put(`/accomplishments/${id}/`, data),
  delete: (id) => api.delete(`/accomplishments/${id}/`),
  share: (id, users) => api.post(`/accomplishments/${id}/share/`, { users })
};

export const skillsApi = {
  getAll: () => api.get('/skills/'),
  create: (data) => api.post('/skills/', data),
  update: (id, data) => api.put(`/skills/${id}/`, data),
  delete: (id) => api.delete(`/skills/${id}/`),
  assess: (id, assessment) => api.post(`/skills/${id}/assess/`, assessment),
  getRecommendations: () => api.get('/skills/recommendations/')
};

export const emailApi = {
  getInbox: () => api.get('/emails/inbox/'),
  getSent: () => api.get('/emails/sent/'),
  getDrafts: () => api.get('/emails/drafts/'),
  send: (data) => api.post('/emails/send/', data),
  saveDraft: (data) => api.post('/emails/drafts/', data),
  delete: (id) => api.delete(`/emails/${id}/`)
};

export const groupsApi = {
  getAll: () => api.get('/groups/'),
  create: (data) => api.post('/groups/', data),
  update: (id, data) => api.put(`/groups/${id}/`, data),
  delete: (id) => api.delete(`/groups/${id}/`),
  addMember: (groupId, userId) => api.post(`/groups/${groupId}/members/`, { user_id: userId }),
  removeMember: (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}/`),
  getActivities: (groupId) => api.get(`/groups/${groupId}/activities/`)
};

export const messengerApi = {
  getConversations: () => api.get('/messenger/conversations/'),
  getMessages: (conversationId) => api.get(`/messenger/conversations/${conversationId}/messages/`),
  sendMessage: (conversationId, data) => api.post(`/messenger/conversations/${conversationId}/messages/`, data),
  createConversation: (data) => api.post('/messenger/conversations/', data),
  markAsRead: (messageId) => api.put(`/messenger/messages/${messageId}/read/`)
};

export const resumeApi = {
  generate: () => api.get('/resume/generate/'),
  update: (data) => api.put('/resume/', data),
  download: (format) => api.get(`/resume/download/${format}/`),
  share: (data) => api.post('/resume/share/', data)
};

export const assessmentApi = {
  getAll: () => api.get('/assessments/'),
  start: (id) => api.post(`/assessments/${id}/start/`),
  submit: (id, answers) => api.post(`/assessments/${id}/submit/`, { answers }),
  getResults: (id) => api.get(`/assessments/${id}/results/`),
  getRecommendations: (id) => api.get(`/assessments/${id}/recommendations/`)
};

export const notesApi = {
  getAll: () => api.get('/notes/'),
  create: (data) => api.post('/notes/', data),
  update: (id, data) => api.put(`/notes/${id}/`, data),
  delete: (id) => api.delete(`/notes/${id}/`),
  share: (id, users) => api.post(`/notes/${id}/share/`, { users }),
  getTags: () => api.get('/notes/tags/')
};

export const rewardsApi = {
  getAll: () => api.get('/rewards/'),
  claim: (id) => api.post(`/rewards/${id}/claim/`),
  getHistory: () => api.get('/rewards/history/'),
  getPoints: () => api.get('/rewards/points/'),
  getLeaderboard: () => api.get('/rewards/leaderboard/')
};

export const surveyApi = {
  getAll: () => api.get('/surveys/'),
  create: (data) => api.post('/surveys/', data),
  update: (id, data) => api.put(`/surveys/${id}/`, data),
  delete: (id) => api.delete(`/surveys/${id}/`),
  respond: (id, answers) => api.post(`/surveys/${id}/respond/`, { answers }),
  getResults: (id) => api.get(`/surveys/${id}/results/`),
  share: (id, data) => api.post(`/surveys/${id}/share/`, data)
};

export const whiteboardApi = {
  save: (data) => api.post('/whiteboard/save/', data),
  get: (id) => api.get(`/whiteboard/${id}/`),
  share: (id, users) => api.post(`/whiteboard/${id}/share/`, { users }),
  export: (id, format) => api.get(`/whiteboard/${id}/export/${format}/`)
}; 