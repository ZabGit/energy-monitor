const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers
    }
  });
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(await response.text());
  }
  return response.json();
};

export const auth = {
  login: (email, password) => request('/auth/login', { 
    method: 'POST', 
    body: JSON.stringify({ email, password }) 
  }),
  register: (email, password) => request('/auth/register', { 
    method: 'POST', 
    body: JSON.stringify({ email, password }) 
  })
};

export const rooms = {
  getAll: () => request('/rooms'),
  create: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
  getPoints: (id) => request(`/rooms/${id}/points`)
};

export const consumptions = {
  add: (data) => request('/consumptions', { method: 'POST', body: JSON.stringify(data) }),
  getByPoint: (pointId, from, to) => request(`/points/${pointId}/consumptions?from=${from}&to=${to}`)
};

export const reports = {
  get: (roomId, from, to) => request(`/reports?roomId=${roomId}&from=${from}&to=${to}`)
};

export const alerts = {
  get: () => request('/alerts'),
  setLimit: (pointId, limitValue) => request('/alerts/limits', { 
    method: 'POST', 
    body: JSON.stringify({ pointId, limitValue }) 
  })
};