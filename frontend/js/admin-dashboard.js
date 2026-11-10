import { api } from './api.js';
import { requireRole } from './auth.js';
import { ui } from './ui.js';
import { element, setMessage } from './view-utils.js';

const message = document.querySelector('#dashboard-message');
const statsTarget = document.querySelector('#admin-stats');
const usersTarget = document.querySelector('#admin-users');
const requestsTarget = document.querySelector('#admin-requests');
const reportsTarget = document.querySelector('#admin-reports');

function table(headers, rows) {
  const tableNode = element('table', 'data-table');
  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (const label of headers) {
    headerRow.append(element('th', '', label));
  }
  head.append(headerRow);
  tableNode.append(head);
  const body = document.createElement('tbody');
  for (const row of rows) {
    body.append(row);
  }
  tableNode.append(body);
  return tableNode;
}

async function loadStats() {
  statsTarget.setAttribute('aria-busy', 'true');
  const { data } = await api.admin.stats();
  statsTarget.replaceChildren();
  const items = [
    ['Donors', data.donors],
    ['Patients', data.patients],
    ['Blood banks', data.blood_banks],
    ['Open reports', data.open_reports],
    ['Pending verification', data.pending_verifications],
  ];
  for (const [label, value] of items) {
    const card = element('article', 'stat-card');
    card.append(element('span', '', label), element('strong', '', String(value ?? 0)));
    statsTarget.append(card);
  }
  const requestCard = element('article', 'data-card');
  requestCard.append(element('h3', '', 'Requests by status'));
  for (const [status, count] of Object.entries(data.requests_by_status || {})) {
    requestCard.append(element('p', '', `${status}: ${count}`));
  }
  statsTarget.append(requestCard);
  const groupCard = element('article', 'data-card');
  groupCard.append(element('h3', '', 'Requests by blood group'));
  for (const [group, count] of Object.entries(data.requests_by_blood_group || {})) {
    groupCard.append(element('p', '', `${group}: ${count}`));
  }
  statsTarget.append(groupCard);
  statsTarget.setAttribute('aria-busy', 'false');
}

async function loadUsers() {
  usersTarget.setAttribute('aria-busy', 'true');
  const values = new FormData(document.querySelector('#user-filter-form'));
  const params = {
    role: values.get('role') || undefined,
    q: String(values.get('q') || '').trim() || undefined,
    is_verified: values.get('is_verified') || undefined,
    per_page: 50,
  };
  const { data } = await api.admin.users(params);
  const rows = data.items.map((user) => {
    const row = document.createElement('tr');
    for (const value of [user.full_name, user.email, user.role, user.is_verified ? 'Verified' : 'Pending', user.is_active ? 'Active' : 'Inactive']) {
      row.append(element('td', '', String(value)));
    }
    const actions = element('td');
    if (user.role === 'donor' || user.role === 'blood_bank') {
      const verify = element('button', 'button button--secondary button--small', user.is_verified ? 'Revoke verification' : 'Verify');
      verify.type = 'button';
      verify.addEventListener('click', async () => {
        verify.disabled = true;
        try {
          await api.admin.verifyUser(user.id, !user.is_verified);
          setMessage(message, `Verification updated for ${user.email}.`, 'success');
          await Promise.all([loadUsers(), loadStats()]);
        } catch (error) {
          setMessage(message, error.message, 'error');
          ui.handleError(error);
          verify.disabled = false;
        }
      });
      actions.append(verify);
    }
    const active = element('button', `button button--small ${user.is_active ? 'button--danger' : 'button--secondary'}`, user.is_active ? 'Deactivate' : 'Reactivate');
    active.type = 'button';
    active.addEventListener('click', async () => {
      active.disabled = true;
      try {
        await api.admin.setUserActive(user.id, !user.is_active);
        setMessage(message, `Account status updated for ${user.email}.`, 'success');
        await Promise.all([loadUsers(), loadStats()]);
      } catch (error) {
        setMessage(message, error.message, 'error');
        ui.handleError(error);
        active.disabled = false;
      }
    });
    actions.append(active);
    row.append(actions);
    return row;
  });
  usersTarget.replaceChildren(
    table(['Name', 'Email', 'Role', 'Verification', 'Account', 'Actions'], rows),
  );
  if (!rows.length) {
    usersTarget.append(element('p', 'muted', 'No users match these filters.'));
  }
  usersTarget.setAttribute('aria-busy', 'false');
}

async function loadRequests() {
  requestsTarget.setAttribute('aria-busy', 'true');
  const status = document.querySelector('#request-status-filter').value;
  const { data } = await api.admin.requests({ status: status || undefined });
  const rows = data.items.map((request) => {
    const row = document.createElement('tr');
    for (const value of [request.id, request.status, request.blood_group, request.city, request.flagged_for_review ? 'Flagged' : '—']) {
      row.append(element('td', '', String(value ?? '')));
    }
    return row;
  });
  requestsTarget.replaceChildren(table(['ID', 'Status', 'Blood group', 'City', 'Review flag'], rows));
  if (!rows.length) {
    requestsTarget.append(element('p', 'muted', 'No blood requests match this filter.'));
  }
  requestsTarget.setAttribute('aria-busy', 'false');
}

async function loadReports() {
  reportsTarget.setAttribute('aria-busy', 'true');
  const status = document.querySelector('#report-status-filter').value;
  const { data } = await api.admin.reports({ status: status || undefined });
  const rows = data.items.map((report) => {
    const row = document.createElement('tr');
    for (const value of [report.id, report.target_type, report.target_id, report.reason, report.status]) {
      row.append(element('td', '', String(value ?? '')));
    }
    const actions = element('td');
    const select = document.createElement('select');
    select.setAttribute('aria-label', `Status for report ${report.id}`);
    for (const statusValue of ['Open', 'Resolved', 'Dismissed']) {
      const option = element('option', '', statusValue);
      option.value = statusValue;
      option.selected = report.status === statusValue;
      select.append(option);
    }
    const save = element('button', 'button button--secondary button--small', 'Save');
    save.type = 'button';
    save.addEventListener('click', async () => {
      save.disabled = true;
      try {
        await api.admin.updateReport(report.id, { status: select.value });
        setMessage(message, `Report #${report.id} updated.`, 'success');
        await loadReports();
      } catch (error) {
        setMessage(message, error.message, 'error');
        ui.handleError(error);
        save.disabled = false;
      }
    });
    actions.append(select, save);
    row.append(actions);
    return row;
  });
  reportsTarget.replaceChildren(table(['ID', 'Target type', 'Target ID', 'Reason', 'Status', 'Update'], rows));
  if (!rows.length) {
    reportsTarget.append(element('p', 'muted', 'No reports match this filter.'));
  }
  reportsTarget.setAttribute('aria-busy', 'false');
}

async function initialize() {
  const account = await requireRole('admin');
  if (!account) {
    return;
  }
  await Promise.all([loadStats(), loadUsers(), loadRequests(), loadReports()]);
  document.querySelector('#user-filter-form').addEventListener('submit', (event) => {
    event.preventDefault();
    void loadUsers().catch((error) => {
      setMessage(message, error.message, 'error');
      ui.handleError(error);
    });
  });
  document.querySelector('#request-status-filter').addEventListener('change', () => {
    void loadRequests().catch((error) => {
      setMessage(message, error.message, 'error');
      ui.handleError(error);
    });
  });
  document.querySelector('#report-status-filter').addEventListener('change', () => {
    void loadReports().catch((error) => {
      setMessage(message, error.message, 'error');
      ui.handleError(error);
    });
  });
}

initialize().catch((error) => {
  setMessage(message, error.message || 'Could not load the admin dashboard.', 'error');
  ui.handleError(error);
});
