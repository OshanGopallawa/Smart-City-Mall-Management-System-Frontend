import axios from 'axios';
import {
  userAuth,
  userService,
  operatorAuth,
  operatorService,
  mallService,
  analyticsService,
} from '../services/api';  // ← update this path to match your actual file location

// ─── Mock axios ───────────────────────────────────────────────────
jest.mock('axios', () => {
  const mockAPI = {
    get:  jest.fn(),
    post: jest.fn(),
    put:  jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request:  { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockAPI),
    default: { create: jest.fn(() => mockAPI) },
  };
});

// ─── Get the mocked API instance ─────────────────────────────────
const mockAPI = axios.create();

// ─── Reset mocks before each test ────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
});

// ══════════════════════════════════════════════════════════════════
// USER AUTH TESTS
// ══════════════════════════════════════════════════════════════════
describe('userAuth', () => {
  test('register calls correct endpoint', () => {
    const data = { name: 'John', email: 'john@test.com', password: '12345678' };
    userAuth.register(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/auth/users/register', data);
  });

  test('login calls correct endpoint', () => {
    const data = { email: 'john@test.com', password: '12345678' };
    userAuth.login(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/auth/users/login', data);
  });

  test('logout calls correct endpoint', () => {
    userAuth.logout();
    expect(mockAPI.post).toHaveBeenCalledWith('/api/auth/users/logout');
  });

  test('me calls correct endpoint', () => {
    userAuth.me();
    expect(mockAPI.get).toHaveBeenCalledWith('/api/auth/users/me');
  });

  test('refresh calls correct endpoint with token', () => {
    const token = 'refresh-token-123';
    userAuth.refresh(token);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/auth/users/refresh', {
      refresh_token: token,
    });
  });
});

// ══════════════════════════════════════════════════════════════════
// USER SERVICE TESTS
// ══════════════════════════════════════════════════════════════════
describe('userService', () => {
  test('getAll calls correct endpoint', () => {
    const params = { page: 1, limit: 10 };
    userService.getAll(params);
    expect(mockAPI.get).toHaveBeenCalledWith('/api/users', { params });
  });

  test('getById calls correct endpoint', () => {
    userService.getById('user123');
    expect(mockAPI.get).toHaveBeenCalledWith('/api/users/user123');
  });

  test('update calls correct endpoint', () => {
    const data = { name: 'Updated Name' };
    userService.update('user123', data);
    expect(mockAPI.put).toHaveBeenCalledWith('/api/users/user123', data);
  });

  test('delete calls correct endpoint', () => {
    userService.delete('user123');
    expect(mockAPI.delete).toHaveBeenCalledWith('/api/users/user123');
  });

  test('visitStore calls correct endpoint', () => {
    const data = { storeId: 'store456' };
    userService.visitStore('user123', data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/users/user123/visit-store', data);
  });

  test('browseDeals calls correct endpoint', () => {
    userService.browseDeals('user123');
    expect(mockAPI.get).toHaveBeenCalledWith('/api/users/user123/browse-deals');
  });

  test('browseEvents calls correct endpoint', () => {
    userService.browseEvents('user123');
    expect(mockAPI.get).toHaveBeenCalledWith('/api/users/user123/browse-events');
  });
});

// ══════════════════════════════════════════════════════════════════
// OPERATOR AUTH TESTS
// ══════════════════════════════════════════════════════════════════
describe('operatorAuth', () => {
  test('register calls correct endpoint', () => {
    const data = { name: 'Operator', email: 'op@test.com', password: '12345678' };
    operatorAuth.register(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/auth/operators/register', data);
  });

  test('login calls correct endpoint', () => {
    const data = { email: 'op@test.com', password: '12345678' };
    operatorAuth.login(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/auth/operators/login', data);
  });

  test('logout calls correct endpoint', () => {
    operatorAuth.logout();
    expect(mockAPI.post).toHaveBeenCalledWith('/api/auth/operators/logout');
  });

  test('me calls correct endpoint', () => {
    operatorAuth.me();
    expect(mockAPI.get).toHaveBeenCalledWith('/api/auth/operators/me');
  });
});

// ══════════════════════════════════════════════════════════════════
// OPERATOR SERVICE TESTS
// ══════════════════════════════════════════════════════════════════
describe('operatorService', () => {
  test('createStore calls correct endpoint', () => {
    const data = { name: 'New Shop', category: 'food' };
    operatorService.createStore(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/operators/actions/stores', data);
  });

  test('updateStore calls correct endpoint', () => {
    const data = { name: 'Updated Shop' };
    operatorService.updateStore('store123', data);
    expect(mockAPI.put).toHaveBeenCalledWith('/api/operators/actions/stores/store123', data);
  });

  test('createDeal calls correct endpoint', () => {
    const data = { title: '50% Off', storeId: 'store123' };
    operatorService.createDeal(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/operators/actions/deals', data);
  });

  test('createEvent calls correct endpoint', () => {
    const data = { title: 'Sale Event', date: '2026-04-01' };
    operatorService.createEvent(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/operators/actions/events', data);
  });

  test('myStore calls correct endpoint', () => {
    operatorService.myStore();
    expect(mockAPI.get).toHaveBeenCalledWith('/api/operators/actions/my-store');
  });
});

// ══════════════════════════════════════════════════════════════════
// MALL SERVICE TESTS
// ══════════════════════════════════════════════════════════════════
describe('mallService - stores', () => {
  test('getStores calls correct endpoint', () => {
    const params = { category: 'food' };
    mallService.getStores(params);
    expect(mockAPI.get).toHaveBeenCalledWith('/api/stores', { params });
  });

  test('getStore calls correct endpoint', () => {
    mallService.getStore('store123');
    expect(mockAPI.get).toHaveBeenCalledWith('/api/stores/store123');
  });

  test('createStore calls correct endpoint', () => {
    const data = { name: 'Shop A', floor: 2 };
    mallService.createStore(data);
    expect(mockAPI.post).toHaveBeenCalledWith('/api/stores', data);
  });

  test('updateStore calls correct endpoint', () => {
    const data = { name: 'Shop A Updated' };
    mallService.updateStore('store123', data);
    expect(mockAPI.put).toHaveBeenCalledWith('/api/stores/store123', data);
  });

  test('deleteStore calls correct endpoint', () => {
    mallService.deleteStore('store123');
    expect(mockAPI.delete).toHaveBeenCalledWith('/api/stores/store123');
  });

  test('storeDeals calls correct endpoint', () => {
    mallService.storeDeals('store123');
    expect(mockAPI.get).toHaveBeenCalledWith('/api/stores/store123/deals');
  });
});

describe('mallService - deals', () => {
  test('getDeals calls correct endpoint', () => {
    mallService.getDeals({ active: true });
    expect(mockAPI.get).toHaveBeenCalledWith('/api/deals', { params: { active: true } });
  });

  test('getDeal calls correct endpoint', () => {
    mallService.getDeal('deal123');
    expect(mockAPI.get).toHaveBeenCalledWith('/api/deals/deal123');
  });

  test('deleteDeal calls correct endpoint', () => {
    mallService.deleteDeal('deal123');
    expect(mockAPI.delete).toHaveBeenCalledWith('/api/deals/deal123');
  });
});

describe('mallService - events', () => {
  test('getEvents calls correct endpoint', () => {
    mallService.getEvents({ upcoming: true });
    expect(mockAPI.get).toHaveBeenCalledWith('/api/events', { params: { upcoming: true } });
  });

  test('getEvent calls correct endpoint', () => {
    mallService.getEvent('event123');
    expect(mockAPI.get).toHaveBeenCalledWith('/api/events/event123');
  });

  test('deleteEvent calls correct endpoint', () => {
    mallService.deleteEvent('event123');
    expect(mockAPI.delete).toHaveBeenCalledWith('/api/events/event123');
  });
});

// ══════════════════════════════════════════════════════════════════
// ANALYTICS SERVICE TESTS
// ══════════════════════════════════════════════════════════════════
describe('analyticsService', () => {
  test('summary calls correct endpoint', () => {
    analyticsService.summary();
    expect(mockAPI.get).toHaveBeenCalledWith('/api/analytics/summary');
  });

  test('popularStores calls correct endpoint', () => {
    const params = { limit: 5 };
    analyticsService.popularStores(params);
    expect(mockAPI.get).toHaveBeenCalledWith('/api/analytics/popular-stores', { params });
  });

  test('activeUsers calls correct endpoint', () => {
    analyticsService.activeUsers({ period: 'week' });
    expect(mockAPI.get).toHaveBeenCalledWith('/api/analytics/active-users', {
      params: { period: 'week' },
    });
  });

  test('eventAttendance calls correct endpoint', () => {
    analyticsService.eventAttendance();
    expect(mockAPI.get).toHaveBeenCalledWith('/api/analytics/event-attendance-stats');
  });

  test('dailyFootfall calls correct endpoint', () => {
    analyticsService.dailyFootfall({ date: '2026-03-29' });
    expect(mockAPI.get).toHaveBeenCalledWith('/api/analytics/daily-footfall', {
      params: { date: '2026-03-29' },
    });
  });

  test('deleteLog calls correct endpoint', () => {
    analyticsService.deleteLog('log123');
    expect(mockAPI.delete).toHaveBeenCalledWith('/api/analytics/logs/log123');
  });

  test('sendEvent calls correct endpoint with api key header', () => {
    const data = { type: 'store_visit', storeId: 'store123' };
    analyticsService.sendEvent(data);
    expect(mockAPI.post).toHaveBeenCalledWith(
      '/api/internal/events',
      data,
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': expect.any(String),
        }),
      })
    );
  });
});