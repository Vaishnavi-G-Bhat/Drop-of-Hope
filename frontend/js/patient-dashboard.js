import { api } from './api.js';
import { requireRole } from './auth.js';
import { ui } from './ui.js';
import { element, renderSearchResults, setFormValues, setMessage } from './view-utils.js';

const message = document.querySelector('#dashboard-message');
const requestForm = document.querySelector('#request-form');
const requestTarget = document.querySelector('#patient-requests');
const detailTarget = document.querySelector('#request-detail');
const availabilityForm = document.querySelector('#availability-search-form');
const availabilityMessage = document.querySelector('#availability-search-message');
const donorResults = document.querySelector('#patient-donor-results');
const bankResults = document.querySelector('#patient-bank-results');
const requestButton = requestForm.querySelector('button[type="submit"]');
const today = new Date();
const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
requestForm.elements.required_date.min = todayString;
requestForm.elements.required_date.value = todayString;

async function loadRequests() {
  const { data } = await api.requests.mine({ per_page: 50 });
  requestTarget.replaceChildren();
  requestTarget.setAttribute('aria-busy', 'false');
  if (!data.items.length) {
    requestTarget.append(ui.emptyState('No requests yet', 'Your blood requests will appear here after you submit one.', null, null));
    return;
  }
  for (const request of data.items) {
    const card = element('article', 'data-card');
    card.append(element('h3', '', `${request.blood_group} · ${request.status}`));
    card.append(element('p', '', [request.hospital_name, request.city].filter(Boolean).join(' · ')));
    card.append(element('p', 'muted', `Required date: ${request.required_date || 'not specified'}`));
    const actions = element('div', 'data-card__actions');
    const view = element('button', 'button button--secondary button--small', 'View details and responses');
    view.type = 'button';
    view.addEventListener('click', () => void loadRequestDetail(request.id));
    actions.append(view);
    if (!['Resolved', 'Cancelled'].includes(request.status)) {
      for (const status of ['Resolved', 'Cancelled']) {
        const closeButton = element('button', `button button--small ${status === 'Cancelled' ? 'button--danger' : 'button--secondary'}`, status === 'Resolved' ? 'Mark resolved' : 'Cancel request');
        closeButton.type = 'button';
        closeButton.addEventListener('click', async () => {
          closeButton.disabled = true;
          try {
            const result = await api.requests.setStatus(request.id, status);
            setMessage(message, result.message || `Request ${status.toLowerCase()}.`, 'success');
            await loadRequests();
          } catch (error) {
            setMessage(message, error.message, 'error');
            ui.handleError(error);
            closeButton.disabled = false;
          }
        });
        actions.append(closeButton);
      }
    }
    card.append(actions);
    requestTarget.append(card);
  }
}

async function loadRequestDetail(requestId) {
  detailTarget.hidden = false;
  detailTarget.replaceChildren(element('p', 'muted', 'Loading request details…'));
  try {
    const { data } = await api.requests.detail(requestId);
    const request = data.request;
    detailTarget.replaceChildren(
      element('h3', '', `Request #${request.id}: ${request.blood_group}`),
      element('p', '', `${request.units_needed} unit(s) · ${request.urgency} · ${request.status}`),
      element('p', '', [request.patient_name, request.hospital_name, request.area, request.city, request.pin_code].filter(Boolean).join(' · ')),
    );
    const close = element('button', 'button button--secondary button--small', 'Close details');
    close.type = 'button';
    close.addEventListener('click', () => {
      detailTarget.hidden = true;
    });
    detailTarget.append(close);

    const responseHeading = element('h4', '', 'Donor responses');
    detailTarget.append(responseHeading);
    const responses = data.responses || [];
    if (!responses.length) {
      detailTarget.append(element('p', 'muted', 'No donor responses yet.'));
    }
    for (const response of responses) {
      const responseCard = element('article', 'data-card');
      responseCard.append(element('p', '', `Donor #${response.donor_id}: ${response.response}`));
      if (response.message) {
        responseCard.append(element('p', '', response.message));
      }
      if (response.full_phone) {
        responseCard.append(element('p', '', `Contact: ${response.full_phone}`));
      }
      if (response.response === 'Accepted' && request.status !== 'Resolved') {
        const confirm = element('button', 'button button--primary button--small', 'Confirm donation');
        confirm.type = 'button';
        confirm.addEventListener('click', async () => {
          confirm.disabled = true;
          try {
            const result = await api.requests.confirmDonation(request.id, response.donor_id);
            setMessage(message, result.message || 'Donation confirmed.', 'success');
            await loadRequests();
            await loadRequestDetail(request.id);
          } catch (error) {
            setMessage(message, error.message, 'error');
            ui.handleError(error);
            confirm.disabled = false;
          }
        });
        responseCard.append(confirm);
      }
      detailTarget.append(responseCard);
    }
    detailTarget.append(element('h4', '', 'Status history'));
    const timeline = element('ol', 'timeline');
    for (const item of data.timeline || []) {
      const entry = element('li', 'timeline__item');
      entry.append(element('strong', '', item.status));
      if (item.at) {
        const time = document.createElement('time');
        time.dateTime = item.at;
        time.textContent = new Date(item.at).toLocaleString();
        entry.append(time);
      }
      timeline.append(entry);
    }
    detailTarget.append(timeline);
  } catch (error) {
    detailTarget.replaceChildren(element('p', 'notice notice--error', error.message));
    ui.handleError(error);
  }
}

async function runAvailabilitySearch(event) {
  event.preventDefault();
  if (!availabilityForm.reportValidity()) {
    return;
  }
  const button = availabilityForm.querySelector('button[type="submit"]');
  ui.setBusy(button, true, 'Search availability');
  setMessage(availabilityMessage, '');
  const values = new FormData(availabilityForm);
  try {
    const { data } = await api.search.emergency({
      blood_group: values.get('blood_group'),
      city: String(values.get('city') || '').trim() || undefined,
      pin_code: String(values.get('pin_code') || '').trim() || undefined,
      compatible: values.get('compatible') === 'true',
    });
    renderSearchResults(
      { donors: data.donors?.items || [], banks: data.blood_banks?.items || [] },
      donorResults,
      bankResults,
    );
    setMessage(availabilityMessage, data.disclaimer || 'Results show reported availability; confirm directly.', '');
  } catch (error) {
    setMessage(availabilityMessage, error.message, 'error');
    ui.handleError(error);
  } finally {
    ui.setBusy(button, false, 'Search availability');
  }
}

async function initialize() {
  const account = await requireRole('patient');
  if (!account) {
    return;
  }
  document.querySelector('[data-user-name]').textContent = account.user.full_name;
  const { data: profile } = await api.patient.me();
  setFormValues(requestForm, profile);
  requestForm.elements.contact_phone.value = profile.phone || '';
  requestForm.elements.patient_name.value = profile.full_name || account.user.full_name;
  requestForm.elements.required_date.value = todayString;

  requestForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requestForm.reportValidity()) {
      return;
    }
    const values = new FormData(requestForm);
    const payload = {
      patient_name: String(values.get('patient_name') || '').trim() || undefined,
      blood_group: String(values.get('blood_group')),
      units_needed: Number(values.get('units_needed')),
      urgency: String(values.get('urgency')),
      required_date: String(values.get('required_date')),
      hospital_name: String(values.get('hospital_name') || '').trim() || undefined,
      city: String(values.get('city')).trim(),
      area: String(values.get('area') || '').trim() || undefined,
      pin_code: String(values.get('pin_code')).trim(),
      contact_phone: String(values.get('contact_phone') || '').trim() || undefined,
      notes: String(values.get('notes') || '').trim() || undefined,
    };
    ui.setBusy(requestButton, true, 'Submit blood request');
    try {
      const result = await api.requests.create(payload);
      setMessage(message, result.message || `Request #${result.data.id} created.`, 'success');
      requestForm.elements.blood_group.value = '';
      requestForm.elements.units_needed.value = '';
      requestForm.elements.notes.value = '';
      await loadRequests();
      await loadRequestDetail(result.data.id);
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error, requestForm);
    } finally {
      ui.setBusy(requestButton, false, 'Submit blood request');
    }
  });
  availabilityForm.addEventListener('submit', (event) => void runAvailabilitySearch(event));
  await loadRequests();
}

initialize().catch((error) => {
  setMessage(message, error.message || 'Could not load the requester dashboard.', 'error');
  ui.handleError(error);
});
