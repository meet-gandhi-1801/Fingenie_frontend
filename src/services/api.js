import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);

      } catch (err) {
        // Refresh failed — logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  logout: (data) => api.post('/auth/logout', data)
};

// Transaction APIs
export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`)
};

// SMS APIs
export const smsAPI = {
  parse: (smsText) => api.post('/sms/parse', { smsText }),
  save: (smsText) => api.post('/sms/save', { smsText })
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getCategories: () => api.get('/dashboard/categories'),
  getTrend: () => api.get('/dashboard/trend'),
  getRecent: () => api.get('/dashboard/recent')
};

// Chat APIs
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history')
};

// Insights APIs
export const insightAPI = {
  getAll: () => api.get('/insights'),
  getSubscriptions: () => api.get('/insights/subscriptions'),
  markRead: (id) => api.patch(`/insights/${id}/read`)
};

// Goals APIs
export const goalAPI = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  canAfford: (data) => api.post('/goals/afford', data)
};

export default api;