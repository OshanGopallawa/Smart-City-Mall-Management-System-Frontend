import axios from 'axios';

// ─── Base API instances ────────────────────────────────────────────
const USER_API    = axios.create({ baseURL: 'http://localhost:3001' });
const OPERATOR_API = axios.create({ baseURL: 'http://localhost:3002' });
const MALL_API    = axios.create({ baseURL: 'http://localhost:3003' });
const ANALYTICS_API = axios.create({ baseURL: 'http://localhost:3004' });

// ─── Token injection ───────────────────────────────────────────────
const injectToken = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
};

[USER_API, OPERATOR_API, MALL_API, ANALYTICS_API].forEach(injectToken);

// ══════════════════════════════════════════════════════════════════
// USER SERVICE APIs (port 3001)
// ══════════════════════════════════════════════════════════════════
export const userAuth = {
  register: (data) => USER_API.post('/api/auth/register', data),
  login:    (data) => USER_API.post('/api/auth/login', data),
  refresh:  (token) => USER_API.post('/api/auth/refresh', { refresh_token: token }),
  logout:   () => USER_API.post('/api/auth/logout'),
  me:       () => USER_API.get('/api/auth/me'),
};

export const userService = {
  getAll:         (params) => USER_API.get('/api/users', { params }),
  getById:        (id) => USER_API.get(`/api/users/${id}`),
  update:         (id, data) => USER_API.put(`/api/users/${id}`, data),
  changePassword: (id, data) => USER_API.put(`/api/users/${id}/password`, data),
  delete:         (id) => USER_API.delete(`/api/users/${id}`),
  visitedStores:  (id) => USER_API.get(`/api/users/${id}/visited-stores`),
  visitStore:     (id, data) => USER_API.post(`/api/users/${id}/visit-store`, data),
  browseStores:   (id, params) => USER_API.get(`/api/users/${id}/browse-stores`, { params }),
  browseDeals:    (id) => USER_API.get(`/api/users/${id}/browse-deals`),
  browseEvents:   (id) => USER_API.get(`/api/users/${id}/browse-events`),
};

// ══════════════════════════════════════════════════════════════════
// OPERATOR SERVICE APIs (port 3002)
// ══════════════════════════════════════════════════════════════════
export const operatorAuth = {
  register: (data) => OPERATOR_API.post('/api/auth/register', data),
  login:    (data) => OPERATOR_API.post('/api/auth/login', data),
  logout:   () => OPERATOR_API.post('/api/auth/logout'),
  me:       () => OPERATOR_API.get('/api/auth/me'),
};

export const operatorService = {
  getAll:         (params) => OPERATOR_API.get('/api/operators', { params }),
  getById:        (id) => OPERATOR_API.get(`/api/operators/${id}`),
  update:         (id, data) => OPERATOR_API.put(`/api/operators/${id}`, data),
  changePassword: (id, data) => OPERATOR_API.put(`/api/operators/${id}/password`, data),
  delete:         (id) => OPERATOR_API.delete(`/api/operators/${id}`),
  createStore:    (data) => OPERATOR_API.post('/api/operators/actions/stores', data),
  updateStore:    (storeId, data) => OPERATOR_API.put(`/api/operators/actions/stores/${storeId}`, data),
  createDeal:     (data) => OPERATOR_API.post('/api/operators/actions/deals', data),
  createEvent:    (data) => OPERATOR_API.post('/api/operators/actions/events', data),
  myStore:        () => OPERATOR_API.get('/api/operators/actions/my-store'),
};

// ══════════════════════════════════════════════════════════════════
// MALL API SERVICE APIs (port 3003)
// ══════════════════════════════════════════════════════════════════
export const mallService = {
  // Stores
  getStores:    (params) => MALL_API.get('/api/stores', { params }),
  getStore:     (id) => MALL_API.get(`/api/stores/${id}`),
  createStore:  (data) => MALL_API.post('/api/stores', data),
  updateStore:  (id, data) => MALL_API.put(`/api/stores/${id}`, data),
  deleteStore:  (id) => MALL_API.delete(`/api/stores/${id}`),
  storeDeals:   (id) => MALL_API.get(`/api/stores/${id}/deals`),
  // Deals
  getDeals:     (params) => MALL_API.get('/api/deals', { params }),
  getDeal:      (id) => MALL_API.get(`/api/deals/${id}`),
  createDeal:   (data) => MALL_API.post('/api/deals', data),
  updateDeal:   (id, data) => MALL_API.put(`/api/deals/${id}`, data),
  deleteDeal:   (id) => MALL_API.delete(`/api/deals/${id}`),
  // Events
  getEvents:    (params) => MALL_API.get('/api/events', { params }),
  getEvent:     (id) => MALL_API.get(`/api/events/${id}`),
  createEvent:  (data) => MALL_API.post('/api/events', data),
  updateEvent:  (id, data) => MALL_API.put(`/api/events/${id}`, data),
  deleteEvent:  (id) => MALL_API.delete(`/api/events/${id}`),
};

// ══════════════════════════════════════════════════════════════════
// ANALYTICS SERVICE APIs (port 3004)
// ══════════════════════════════════════════════════════════════════
export const analyticsService = {
  summary:            () => ANALYTICS_API.get('/api/analytics/summary'),
  popularStores:      (params) => ANALYTICS_API.get('/api/analytics/popular-stores', { params }),
  activeUsers:        (params) => ANALYTICS_API.get('/api/analytics/active-users', { params }),
  eventAttendance:    () => ANALYTICS_API.get('/api/analytics/event-attendance-stats'),
  popularDeals:       (params) => ANALYTICS_API.get('/api/analytics/popular-deals', { params }),
  dailyFootfall:      (params) => ANALYTICS_API.get('/api/analytics/daily-footfall', { params }),
  storeVisits:        (params) => ANALYTICS_API.get('/api/analytics/store-visits', { params }),
  dealClicks:         (params) => ANALYTICS_API.get('/api/analytics/deal-clicks', { params }),
  logs:               (params) => ANALYTICS_API.get('/api/analytics/logs', { params }),
  deleteLog:          (id) => ANALYTICS_API.delete(`/api/analytics/logs/${id}`),
  sendEvent:          (data) => ANALYTICS_API.post('/api/internal/events', data, {
    headers: { 'x-api-key': process.env.REACT_APP_INTERNAL_API_KEY || 'MallInternalKey2026' }
  }),
};
