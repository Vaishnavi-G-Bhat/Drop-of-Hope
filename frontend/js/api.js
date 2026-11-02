import { API_BASE } from './config.js';

const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor({ status, code, message, fields = {} }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

function buildUrl(path, query) {
  const url = new URL(`${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

export async function request(method, path, { query, body } = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = { Accept: 'application/json' };
  const options = {
    method,
    credentials: 'include',
    headers,
    signal: controller.signal,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  try {
    let response;
    try {
      response = await fetch(buildUrl(path, query), options);
    } catch (error) {
      const message =
        error.name === 'AbortError'
          ? 'The request timed out. Check that the backend is running.'
          : 'Cannot reach the server. Check that the backend is running.';
      throw new ApiError({
        status: 0,
        code: 'NETWORK_ERROR',
        message,
      });
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError({
        status: response.status,
        code: 'SERVER_ERROR',
        message: 'The server returned an invalid response.',
      });
    }

    if (!response.ok || payload?.success !== true) {
      const error = payload?.error || {};
      throw new ApiError({
        status: response.status,
        code: error.code || 'SERVER_ERROR',
        message: error.message || 'The request could not be completed.',
        fields: error.fields || {},
      });
    }

    return { data: payload.data, message: payload.message };
  } finally {
    window.clearTimeout(timeout);
  }
}

const get = (path, query) => request('GET', path, { query });
const post = (path, body) => request('POST', path, { body });
const put = (path, body) => request('PUT', path, { body });

export const api = Object.freeze({
  auth: Object.freeze({
    registerDonor: (body) => post('/auth/register/donor', body),
    registerPatient: (body) => post('/auth/register/patient', body),
    registerBloodBank: (body) => post('/auth/register/blood-bank', body),
    login: (body) => post('/auth/login', body),
    logout: () => post('/auth/logout', {}),
    me: () => get('/auth/me'),
    setLanguage: (preferred_language) =>
      put('/auth/language', { preferred_language }),
  }),
  search: Object.freeze({
    donors: (params = {}) => get('/search/donors', params),
    bloodBanks: (params = {}) => get('/search/blood-banks', params),
    emergency: (params = {}) => get('/search/emergency', params),
  }),
  donor: Object.freeze({
    me: () => get('/donors/me'),
    update: (body) => put('/donors/me', body),
    setAvailability: (availability_status) =>
      put('/donors/me/availability', { availability_status }),
    confirmAvailability: () => post('/donors/me/confirm', {}),
    updateNotifications: (body) => put('/donors/me/notifications', body),
    requests: (query = {}) => get('/donors/me/requests', query),
    respond: (requestId, body) =>
      post(`/donors/me/requests/${encodeURIComponent(requestId)}/respond`, body),
    history: () => get('/donors/me/history'),
    certificate: () => get('/donors/me/certificate'),
  }),
  patient: Object.freeze({
    me: () => get('/patients/me'),
    update: (body) => put('/patients/me', body),
  }),
  requests: Object.freeze({
    create: (body) => post('/requests', body),
    mine: (query = {}) => get('/requests/mine', query),
    detail: (requestId) =>
      get(`/requests/${encodeURIComponent(requestId)}`),
    setStatus: (requestId, status) =>
      put(`/requests/${encodeURIComponent(requestId)}/status`, { status }),
    confirmDonation: (requestId, donor_id) =>
      post(`/requests/${encodeURIComponent(requestId)}/confirm-donation`, {
        donor_id,
      }),
    bloodBankRequests: () => get('/blood-bank/requests'),
  }),
  bloodBank: Object.freeze({
    me: () => get('/blood-bank/me'),
    update: (body) => put('/blood-bank/me', body),
    stock: () => get('/blood-bank/stock'),
    updateStock: (stock) => put('/blood-bank/stock', { stock }),
    confirmStock: () => post('/blood-bank/stock/confirm', {}),
  }),
  notifications: Object.freeze({
    list: (query = {}) => get('/notifications', query),
    markRead: (notificationId) =>
      put(`/notifications/${encodeURIComponent(notificationId)}/read`, {}),
    markAllRead: () => put('/notifications/read-all', {}),
  }),
  reports: Object.freeze({
    create: (body) => post('/reports', body),
  }),
  admin: Object.freeze({
    stats: () => get('/admin/stats'),
    users: (query = {}) => get('/admin/users', query),
    verifyUser: (userId, is_verified) =>
      put(`/admin/users/${encodeURIComponent(userId)}/verify`, { is_verified }),
    setUserActive: (userId, is_active) =>
      put(`/admin/users/${encodeURIComponent(userId)}/active`, { is_active }),
    deleteUser: (userId) =>
      request('DELETE', `/admin/users/${encodeURIComponent(userId)}`),
    requests: (query = {}) => get('/admin/requests', query),
    reports: (query = {}) => get('/admin/reports', query),
    updateReport: (reportId, body) =>
      put(`/admin/reports/${encodeURIComponent(reportId)}`, body),
    deleteStock: (stockId) =>
      request('DELETE', `/admin/stock/${encodeURIComponent(stockId)}`),
  }),
});
