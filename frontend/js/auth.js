import { api, ApiError } from './api.js';
import { appUrl } from './config.js';
import { ui } from './ui.js';

const DASHBOARDS = Object.freeze({
  donor: 'donor/dashboard.html',
  patient: 'patient/dashboard.html',
  blood_bank: 'bloodbank/dashboard.html',
  admin: 'admin/dashboard.html',
});

let mePromise;

export function getMe({ refresh = false } = {}) {
  if (refresh || !mePromise) {
    mePromise = api.auth
      .me()
      .then(({ data }) => data)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }
        mePromise = undefined;
        throw error;
      });
  }
  return mePromise;
}

export function dashboardForRole(role) {
  return DASHBOARDS[role] || 'index.html';
}

export function safeNextTarget(value) {
  if (
    !value ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /^[a-z][a-z\d+.-]*:/i.test(value)
  ) {
    return null;
  }

  try {
    const target = new URL(value, location.href);
    if (target.origin !== location.origin || !target.pathname.endsWith('.html')) {
      return null;
    }
    return `${target.pathname.replace(/^\//, '')}${target.search}${target.hash}`;
  } catch {
    return null;
  }
}

export function redirectAfterLogin(next, role) {
  location.assign(appUrl(safeNextTarget(next) || dashboardForRole(role)));
}

export async function requireRole(...roles) {
  try {
    const data = await getMe();
    if (!data) {
      const next = `${location.pathname}${location.search}`;
      location.assign(`${appUrl('login.html')}?next=${encodeURIComponent(next)}`);
      return null;
    }

    if (!roles.includes(data.user?.role)) {
      ui.renderNoAccess(data.user?.role);
      return null;
    }

    return data;
  } catch (error) {
    ui.handleError(error);
    return null;
  }
}

export function startUnreadCountRefresh() {
  const refresh = async () => {
    if (document.visibilityState !== 'visible') {
      return;
    }
    try {
      const { data } = await api.auth.me();
      const count = Number(data.unread_notifications) || 0;
      document.querySelectorAll('[data-unread-count]').forEach((node) => {
        node.textContent = String(count);
        node.hidden = count === 0;
      });
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        ui.handleError(error);
      }
    }
  };

  window.setInterval(refresh, 60_000);
  document.addEventListener('visibilitychange', refresh);
  void refresh();
}
