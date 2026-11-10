import { api, ApiError } from './api.js';
import { STORAGE_KEYS, appUrl } from './config.js';
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
      .then(({ data }) => {
        localStorage.setItem(STORAGE_KEYS.authenticated, 'true');
        return data;
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.authenticated);
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
  const protectedPage = document.querySelector('[data-dashboard], [data-page="notifications"]');
  if (
    localStorage.getItem(STORAGE_KEYS.authenticated) !== 'true' &&
    !protectedPage
  ) {
    return;
  }

  const dashboardLink = document.querySelector('[data-user-dashboard]');
  const logoutButton = document.querySelector('[data-logout]');
  const guestLinks = document.querySelectorAll('[data-guest-link]');

  const refresh = async () => {
    if (document.visibilityState !== 'visible') {
      return;
    }
    try {
      const data = await getMe();
      if (!data) {
        dashboardLink && (dashboardLink.hidden = true);
        guestLinks.forEach((node) => {
          node.hidden = false;
        });
        if (logoutButton) {
          logoutButton.hidden = true;
        }
        return;
      }
      const role = data.user?.role;
      if (dashboardLink && DASHBOARDS[role]) {
        dashboardLink.href = appUrl(dashboardForRole(role));
        dashboardLink.hidden = false;
        guestLinks.forEach((node) => {
          node.hidden = true;
        });
        if (logoutButton) {
          logoutButton.hidden = false;
        }
      }
      const { data: notifications } = await api.notifications.list({
        unread: 'true',
        per_page: 50,
      });
      const count = Number(notifications.total) || 0;
      document.querySelectorAll('[data-unread-count]').forEach((node) => {
        node.textContent = String(count);
        node.hidden = count === 0;
      });
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        ui.handleError(error);
      } else {
        dashboardLink && (dashboardLink.hidden = true);
        guestLinks.forEach((node) => {
          node.hidden = false;
        });
        if (logoutButton) {
          logoutButton.hidden = true;
        }
      }
    }
  };

  logoutButton?.addEventListener('click', async () => {
    ui.setBusy(logoutButton, true, 'Log out');
    try {
      await api.auth.logout();
      mePromise = null;
      localStorage.removeItem(STORAGE_KEYS.authenticated);
      location.assign(appUrl('index.html'));
    } catch (error) {
      ui.handleError(error);
      ui.setBusy(logoutButton, false, 'Log out');
    }
  });

  window.setInterval(refresh, 60_000);
  document.addEventListener('visibilitychange', refresh);
  void refresh();
}
