import { api } from './api';

export const postsApi = {
  getAll: () => api.get('/posts'),
  create: (data) => api.post('/posts', data),
  like: (id) => api.post(`/posts/${id}/like`),
  unlike: (id) => api.delete(`/posts/${id}/like`),
  comment: (id, data) => api.post(`/posts/${id}/comments`, data),
  share: (id) => api.post(`/posts/${id}/share`),
  delete: (id) => api.delete(`/posts/${id}`),
  update: (id, data) => api.put(`/posts/${id}`, data)
}; 