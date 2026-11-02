import { api, ApiError } from '../js/api.js';
import { ui } from '../js/ui.js';

const form = document.querySelector('#check-form');
const results = document.querySelector('#check-results');
const summary = document.querySelector('#check-summary');

function addResult(name, passed, details) {
  const row = document.createElement('tr');
  const endpoint = document.createElement('td');
  const result = document.createElement('td');
  const message = document.createElement('td');
  endpoint.textContent = name;
  result.textContent = passed ? 'PASS' : 'FAIL';
  result.className = passed ? 'check-pass' : 'check-fail';
  message.textContent = details;
  row.append(endpoint, result, message);
  results.append(row);
}

async function check(name, run, shape) {
  try {
    const { data } = await run();
    const valid = shape(data);
    addResult(name, valid, valid ? 'Expected response fields are present.' : 'Response shape did not match.');
    return valid;
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND' && name.endsWith('certificate')) {
      addResult(name, true, 'No certificate yet; endpoint returned the expected not-found response.');
      return true;
    }
    addResult(name, false, error.message);
    return false;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  results.replaceChildren();
  summary.textContent = '';
  const button = form.querySelector('button[type="submit"]');
  ui.setBusy(button, true, 'Run API checks');

  let passed = 0;
  let total = 0;
  const runCheck = async (...args) => {
    total += 1;
    if (await check(...args)) {
      passed += 1;
    }
  };

  try {
    await runCheck('GET /api/search/donors', () => api.search.donors(), (data) => Array.isArray(data.items));
    await runCheck('GET /api/search/blood-banks', () => api.search.bloodBanks(), (data) => Array.isArray(data.items));
    await runCheck(
      'GET /api/search/emergency',
      () => api.search.emergency(),
      (data) => Array.isArray(data.donors?.items) && Array.isArray(data.blood_banks?.items) && typeof data.disclaimer === 'string',
    );

    const values = new FormData(form);
    const role = String(values.get('role'));
    if (role !== 'guest') {
      const email = String(values.get('email') || '');
      const password = String(values.get('password') || '');
      await runCheck(
        'POST /api/auth/login',
        () => api.auth.login({ email, password }),
        (data) => Boolean(data.user?.id && data.user?.role === role),
      );
      await runCheck(
        'GET /api/auth/me',
        () => api.auth.me(),
        (data) => Boolean(data.user?.id && data.user?.role === role && 'profile' in data && 'verification_pending' in data),
      );

      const roleChecks = {
        donor: [
          ['GET /api/donors/me', api.donor.me, (data) => 'blood_group' in data && 'availability_status' in data],
          ['GET /api/donors/me/requests', api.donor.requests, (data) => Array.isArray(data.items)],
          ['GET /api/donors/me/history', api.donor.history, (data) => Array.isArray(data.responses)],
          ['GET /api/donors/me/certificate', api.donor.certificate, (data) => 'certificate_id' in data],
        ],
        patient: [
          ['GET /api/patients/me', api.patient.me, (data) => 'city' in data && 'pin_code' in data],
          ['GET /api/requests/mine', api.requests.mine, (data) => Array.isArray(data.items)],
        ],
        blood_bank: [
          ['GET /api/blood-bank/me', api.bloodBank.me, (data) => 'name' in data && 'verified' in data],
          ['GET /api/blood-bank/stock', api.bloodBank.stock, (data) => Boolean(data.stock?.['O+'])],
          ['GET /api/blood-bank/requests', api.requests.bloodBankRequests, (data) => Array.isArray(data.items)],
        ],
        admin: [
          ['GET /api/admin/stats', api.admin.stats, (data) => 'requests_by_status' in data && 'requests_per_day' in data],
          ['GET /api/admin/users', api.admin.users, (data) => Array.isArray(data.items)],
          ['GET /api/admin/requests', api.admin.requests, (data) => Array.isArray(data.items)],
          ['GET /api/admin/reports', api.admin.reports, (data) => Array.isArray(data.items)],
        ],
      };

      for (const [name, run, shape] of roleChecks[role]) {
        await runCheck(name, run, shape);
      }
      await runCheck(
        'GET /api/notifications',
        () => api.notifications.list(),
        (data) => Array.isArray(data.items),
      );
    }
  } catch (error) {
    ui.handleError(error, form);
  } finally {
    summary.textContent = `${passed} of ${total} checks passed.`;
    ui.setBusy(button, false, 'Run API checks');
  }
});
