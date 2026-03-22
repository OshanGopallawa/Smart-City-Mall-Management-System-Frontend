import axios from 'axios';

// ─── Single gateway URL ────────────────────────────────────────────
// All requests go through the API gateway which routes to the right service
const RAW_URL = process.env.REACT_APP_USER_API_URL
  || process.env.REACT_APP_MALL_API_URL
  || process.env.REACT_APP_ANALYTICS_API_URL
  || process.env.REACT_APP_OPERATOR_API_URL
  || 'https://api-gateway-kd0r.onrender.com';

// Force HTTPS to prevent mixed content errors
const GATEWAY_URL = RAW_URL.replace(/^http:\/\//i, 'https://');

// ─── Single axios instance pointing at gateway ─────────────────────
const API = axios.create({ baseURL: GATEWAY_URL });

// ─── Token injection ───────────────────────────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ══════════════════════════════════════════════════════════════════
// USER SERVICE APIs  →  gateway routes to user-service
// ══════════════════════════════════════════════════════════════════
export const userAuth = {
  register: (data)  => API.post('/api/auth/users/register', data),
  login:    (data)  => API.post('/api/auth/users/login', data),
  refresh:  (token) => API.post('/api/auth/users/refresh', { refresh_token: token }),
  logout:   ()      => API.post('/api/auth/users/logout'),
  me:       ()      => API.get('/api/auth/users/me'),
};

export const userService = {
  getAll:         (params) => API.get('/api/users', { params }),
  getById:        (id)     => API.get(`/api/users/${id}`),
  update:         (id, data) => API.put(`/api/users/${id}`, data),
  changePassword: (id, data) => API.put(`/api/users/${id}/password`, data),
  delete:         (id)     => API.delete(`/api/users/${id}`),
  visitedStores:  (id)     => API.get(`/api/users/${id}/visited-stores`),
  visitStore:     (id, data) => API.post(`/api/users/${id}/visit-store`, data),
  browseStores:   (id, params) => API.get(`/api/users/${id}/browse-stores`, { params }),
  browseDeals:    (id)     => API.get(`/api/users/${id}/browse-deals`),
  browseEvents:   (id)     => API.get(`/api/users/${id}/browse-events`),
};

// ══════════════════════════════════════════════════════════════════
// OPERATOR SERVICE APIs  →  gateway routes to operator-service
// ══════════════════════════════════════════════════════════════════
export const operatorAuth = {
  register: (data) => API.post('/api/auth/operators/register', data),
  login:    (data) => API.post('/api/auth/operators/login', data),
  logout:   ()     => API.post('/api/auth/operators/logout'),
  me:       ()     => API.get('/api/auth/operators/me'),
};

export const operatorService = {
  getAll:         (params)   => API.get('/api/operators', { params }),
  getById:        (id)       => API.get(`/api/operators/${id}`),
  update:         (id, data) => API.put(`/api/operators/${id}`, data),
  changePassword: (id, data) => API.put(`/api/operators/${id}/password`, data),
  delete:         (id)       => API.delete(`/api/operators/${id}`),
  createStore:    (data)     => API.post('/api/operators/actions/stores', data),
  updateStore:    (storeId, data) => API.put(`/api/operators/actions/stores/${storeId}`, data),
  createDeal:     (data)     => API.post('/api/operators/actions/deals', data),
  createEvent:    (data)     => API.post('/api/operators/actions/events', data),
  myStore:        ()         => API.get('/api/operators/actions/my-store'),
};

// ══════════════════════════════════════════════════════════════════
// MALL API SERVICE APIs  →  gateway routes to mall-api-service
// ══════════════════════════════════════════════════════════════════
export const mallService = {
  // Stores
  getStores:   (params)   => API.get('/api/stores', { params }),
  getStore:    (id)       => API.get(`/api/stores/${id}`),
  createStore: (data)     => API.post('/api/stores', data),
  updateStore: (id, data) => API.put(`/api/stores/${id}`, data),
  deleteStore: (id)       => API.delete(`/api/stores/${id}`),
  storeDeals:  (id)       => API.get(`/api/stores/${id}/deals`),
  // Deals
  getDeals:    (params)   => API.get('/api/deals', { params }),
  getDeal:     (id)       => API.get(`/api/deals/${id}`),
  createDeal:  (data)     => API.post('/api/deals', data),
  updateDeal:  (id, data) => API.put(`/api/deals/${id}`, data),
  deleteDeal:  (id)       => API.delete(`/api/deals/${id}`),
  // Events
  getEvents:   (params)   => API.get('/api/events', { params }),
  getEvent:    (id)       => API.get(`/api/events/${id}`),
  createEvent: (data)     => API.post('/api/events', data),
  updateEvent: (id, data) => API.put(`/api/events/${id}`, data),
  deleteEvent: (id)       => API.delete(`/api/events/${id}`),
};

// ══════════════════════════════════════════════════════════════════
// ANALYTICS SERVICE APIs  →  gateway routes to analytics-service
// ══════════════════════════════════════════════════════════════════
export const analyticsService = {
  summary:         ()       => API.get('/api/analytics/summary'),
  popularStores:   (params) => API.get('/api/analytics/popular-stores', { params }),
  activeUsers:     (params) => API.get('/api/analytics/active-users', { params }),
  eventAttendance: ()       => API.get('/api/analytics/event-attendance-stats'),
  popularDeals:    (params) => API.get('/api/analytics/popular-deals', { params }),
  dailyFootfall:   (params) => API.get('/api/analytics/daily-footfall', { params }),
  storeVisits:     (params) => API.get('/api/analytics/store-visits', { params }),
  dealClicks:      (params) => API.get('/api/analytics/deal-clicks', { params }),
  logs:            (params) => API.get('/api/analytics/logs', { params }),
  deleteLog:       (id)     => API.delete(`/api/analytics/logs/${id}`),
  sendEvent:       (data)   => API.post('/api/internal/events', data, {
    headers: {
      'x-api-key': process.env.REACT_APP_INTERNAL_API_KEY || 'MallInternalKey2026'
    }
  }),
};