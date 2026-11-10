import { api } from './api.js';
import { requireRole } from './auth.js';
import { ui } from './ui.js';
import { element, setFormValues, setMessage } from './view-utils.js';

const main = document.querySelector('[data-dashboard="donor"]');
const message = document.querySelector('#dashboard-message');
const profileForm = document.querySelector('#donor-profile-form');
const availabilityForm = document.querySelector('#availability-form');
const requestsTarget = document.querySelector('#donor-requests');
const historyTarget = document.querySelector('#donor-history');
const saveProfileButton = profileForm.querySelector('button[type="submit"]');
const saveAvailabilityButton = availabilityForm.querySelector('button[type="submit"]');

async function loadRequests(history = []) {
  const { data } = await api.donor.requests({ per_page: 50 });
  const responded = new Set(history.map((item) => item.request_id));
  requestsTarget.replaceChildren();
  requestsTarget.setAttribute('aria-busy', 'false');

  if (!data.items.length) {
    requestsTarget.append(ui.emptyState('No matching requests right now', 'Requests are shown here when they match your blood group.', null, null));
    return;
  }

  for (const request of data.items) {
    const card = element('article', 'data-card');
    card.append(element('h3', '', `${request.blood_group} request`));
    card.append(element('p', '', [request.hospital_name, request.area, request.city, request.pin_code].filter(Boolean).join(' · ')));
    card.append(element('p', '', `Urgency: ${request.urgency} · Status: ${request.status}`));
    if (responded.has(request.id)) {
      card.append(element('p', 'muted', `You already responded: ${history.find((item) => item.request_id === request.id)?.response || ''}`));
    } else if (['Resolved', 'Cancelled'].includes(request.status)) {
      card.append(element('p', 'muted', 'This request is closed.'));
    } else {
      const actions = element('div', 'data-card__actions');
      for (const response of ['Accepted', 'Declined']) {
        const button = element('button', `button ${response === 'Accepted' ? 'button--primary' : 'button--secondary'} button--small`, response);
        button.type = 'button';
        button.addEventListener('click', async () => {
          button.disabled = true;
          try {
            const result = await api.donor.respond(request.id, { response });
            setMessage(message, result.message || 'Your response was recorded.', 'success');
            await loadDashboard();
          } catch (error) {
            setMessage(message, error.message, 'error');
            ui.handleError(error);
            button.disabled = false;
          }
        });
        actions.append(button);
      }
      card.append(actions);
    }
    requestsTarget.append(card);
  }
}

function renderHistory(responses) {
  historyTarget.replaceChildren();
  if (!responses.length) {
    historyTarget.append(ui.emptyState('No responses yet', 'Your responses to matching requests will appear here.', null, null));
    return;
  }
  for (const response of responses) {
    const item = element('article', 'data-card');
    item.append(element('strong', '', `Request #${response.request_id}: ${response.response}`));
    if (response.responded_at) {
      item.append(element('p', 'muted', new Date(response.responded_at).toLocaleString()));
    }
    historyTarget.append(item);
  }
}

async function loadDashboard() {
  const [{ data: profile }, { data: history }] = await Promise.all([
    api.donor.me(),
    api.donor.history(),
  ]);
  setFormValues(profileForm, profile);
  document.querySelector('#current-availability').textContent = profile.availability_status;
  availabilityForm.elements.availability_status.value = profile.availability_status;
  document.querySelector('#donor-summary').textContent =
    `${profile.total_donations} recorded donation${profile.total_donations === 1 ? '' : 's'} · Last donation: ${profile.last_donation_date || 'not recorded'}`;
  renderHistory(history.responses || []);
  await loadRequests(history.responses || []);
}

async function initialize() {
  const account = await requireRole('donor');
  if (!account) {
    return;
  }
  document.querySelector('[data-user-name]').textContent = account.user.full_name;
  const verification = document.querySelector('#verification-status');
  verification.textContent = account.user.is_verified ? 'Verified donor' : 'Verification pending';
  verification.classList.add(account.user.is_verified ? 'status-badge--success' : 'status-badge--warning');

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!profileForm.reportValidity()) {
      return;
    }
    const values = new FormData(profileForm);
    const payload = {
      age: Number(values.get('age')),
      phone: String(values.get('phone')).trim(),
      city: String(values.get('city')).trim(),
      area: String(values.get('area') || '').trim(),
      pin_code: String(values.get('pin_code')).trim(),
    };
    if (values.get('last_donation_date')) {
      payload.last_donation_date = String(values.get('last_donation_date'));
    }
    ui.setBusy(saveProfileButton, true, 'Save profile');
    try {
      const result = await api.donor.update(payload);
      setMessage(message, result.message || 'Profile updated.', 'success');
      await loadDashboard();
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error, profileForm);
    } finally {
      ui.setBusy(saveProfileButton, false, 'Save profile');
    }
  });

  availabilityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    ui.setBusy(saveAvailabilityButton, true, 'Update availability');
    try {
      const result = await api.donor.setAvailability(availabilityForm.elements.availability_status.value);
      document.querySelector('#current-availability').textContent = result.data.availability_status;
      setMessage(message, result.message || 'Availability updated.', 'success');
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error, availabilityForm);
    } finally {
      ui.setBusy(saveAvailabilityButton, false, 'Update availability');
    }
  });

  document.querySelector('#confirm-availability').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    ui.setBusy(button, true, 'Confirm current status');
    try {
      const result = await api.donor.confirmAvailability();
      setMessage(message, result.message || 'Availability confirmed.', 'success');
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error);
    } finally {
      ui.setBusy(button, false, 'Confirm current status');
    }
  });

  await loadDashboard();
}

initialize().catch((error) => {
  setMessage(message, error.message || 'Could not load the donor dashboard.', 'error');
  ui.handleError(error);
  main.setAttribute('aria-busy', 'false');
});
