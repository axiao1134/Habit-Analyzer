import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Activities API
export const activitiesAPI = {
  getAll: () => api.get('/activities'),
  getById: (id: number) => api.get(`/activities/${id}`),
  create: (data: { name: string; category?: string; color?: string }) => 
    api.post('/activities', data),
  update: (id: number, data: Partial<{ name: string; category: string; color: string }>) => 
    api.put(`/activities/${id}`, data),
  delete: (id: number) => api.delete(`/activities/${id}`),
};

// Activity Records API
export const activityRecordsAPI = {
  getAll: () => api.get('/activity-records'),
  create: (data: { 
    activity_id: number; 
    start_time: string; 
    end_time?: string; 
    duration_seconds?: number;
    notes?: string;
  }) => api.post('/activity-records', data),
  delete: (id: number) => api.delete(`/activity-records/${id}`),
  getByActivity: (activityId: number) => 
    api.get(`/activity-records/activity/${activityId}`),
};

// Habits API
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  create: (data: { name: string; target_days?: string; target_duration?: number }) => 
    api.post('/habits', data),
  delete: (id: number) => api.delete(`/habits/${id}`),
  complete: (id: number) => api.post(`/habits/${id}/completions`),
};

// Chat API
export const chatAPI = {
  send: (query: string, contextWindow: number = 30) => 
    api.post('/chat/', { query, context_window: contextWindow }),
};

export default api;
