import { api } from './api.js';
import { requireRole } from './auth.js';
import { BLOOD_GROUPS } from './enums.js';
import { ui } from './ui.js';
import { element, setFormValues, setMessage } from './view-utils.js';

const main = document.querySelector('[data-dashboard="blood_bank"]');
const message = document.querySelector('#dashboard-message');
const profileForm = document.querySelector('#bank-profile-form');
const inventoryForm = document.querySelector('#inventory-form');
const inventoryTarget = document.querySelector('#inventory-fields');
const incomingTarget = document.querySelector('#incoming-requests');

function renderInventory(stock) {
  const fragment = document.createDocumentFragment();
  for (const group of BLOOD_GROUPS) {
    const item = stock[group] || { units: 0 };
    const label = element('label', 'form-field data-card', `${group} blood group`);
    const units = document.createElement('input');
    units.type = 'number';
    units.name = group;
    units.min = '0';
    units.step = '1';
    units.required = true;
    units.value = String(item.units ?? 0);
    units.dataset.bloodGroup = group;
    units.setAttribute('aria-label', `${group} units in inventory`);
    label.append(units);
    label.append(element('span', 'form-hint', item.last_updated_at ? `Last updated ${new Date(item.last_updated_at).toLocaleString()}` : 'No stock update recorded'));
    fragment.append(label);
  }
  inventoryTarget.replaceChildren(fragment);
  inventoryTarget.setAttribute('aria-busy', 'false');
}

async function loadInventory() {
  const { data } = await api.bloodBank.stock();
  renderInventory(data.stock || {});
}

async function loadIncomingRequests() {
  const { data } = await api.requests.bloodBankRequests();
  incomingTarget.replaceChildren();
  incomingTarget.setAttribute('aria-busy', 'false');
  if (!data.items.length) {
    incomingTarget.append(ui.emptyState('No open requests in your city', 'New matching city requests will appear here when available.', null, null));
    return;
  }
  for (const request of data.items) {
    const card = element('article', 'data-card');
    card.append(element('h3', '', `${request.blood_group} request #${request.id}`));
    card.append(element('p', '', `${request.city} · ${request.status}`));
    card.append(element('p', '', `Your reported stock: ${request.stock?.units ?? 0} units`));
    card.append(element('p', 'muted', `Stock last updated: ${request.stock?.last_updated_at ? new Date(request.stock.last_updated_at).toLocaleString() : 'not recorded'}`));
    incomingTarget.append(card);
  }
}

async function initialize() {
  const account = await requireRole('blood_bank');
  if (!account) {
    return;
  }
  const [{ data: profile }] = await Promise.all([api.bloodBank.me()]);
  document.querySelector('[data-bank-name]').textContent = profile.name || 'Blood bank';
  const verification = document.querySelector('#verification-status');
  verification.textContent = profile.verified ? 'Verified blood bank' : 'Verification pending';
  verification.classList.add(profile.verified ? 'status-badge--success' : 'status-badge--warning');
  setFormValues(profileForm, profile);
  await Promise.all([loadInventory(), loadIncomingRequests()]);

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!profileForm.reportValidity()) {
      return;
    }
    const values = new FormData(profileForm);
    const payload = {
      name: String(values.get('name')).trim(),
      phone: String(values.get('phone')).trim(),
      city: String(values.get('city')).trim(),
      area: String(values.get('area') || '').trim(),
      pin_code: String(values.get('pin_code')).trim(),
      contact_phone: String(values.get('contact_phone') || '').trim(),
      open_hours: String(values.get('open_hours') || '').trim(),
    };
    const button = profileForm.querySelector('button[type="submit"]');
    ui.setBusy(button, true, 'Save profile');
    try {
      const result = await api.bloodBank.update(payload);
      setMessage(message, result.message || 'Blood bank profile updated.', 'success');
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error, profileForm);
    } finally {
      ui.setBusy(button, false, 'Save profile');
    }
  });

  inventoryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!inventoryForm.reportValidity()) {
      return;
    }
    const button = inventoryForm.querySelector('button[type="submit"]');
    const stock = [...inventoryTarget.querySelectorAll('[data-blood-group]')].map((input) => ({
      blood_group: input.dataset.bloodGroup,
      units: Number(input.value),
    }));
    ui.setBusy(button, true, 'Save inventory');
    try {
      const result = await api.bloodBank.updateStock(stock);
      setMessage(message, result.message || 'Inventory updated.', 'success');
      await Promise.all([loadInventory(), loadIncomingRequests()]);
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error, inventoryForm);
    } finally {
      ui.setBusy(button, false, 'Save inventory');
    }
  });

  document.querySelector('#confirm-stock').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    ui.setBusy(button, true, 'Confirm current stock');
    try {
      const result = await api.bloodBank.confirmStock();
      setMessage(message, result.message || 'Stock confirmation recorded.', 'success');
      await Promise.all([loadInventory(), loadIncomingRequests()]);
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error);
    } finally {
      ui.setBusy(button, false, 'Confirm current stock');
    }
  });
}

initialize().catch((error) => {
  setMessage(message, error.message || 'Could not load the blood-bank dashboard.', 'error');
  ui.handleError(error);
  main.setAttribute('aria-busy', 'false');
});
