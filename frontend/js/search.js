import { api } from './api.js';
import { ui } from './ui.js';
import { renderSearchResults, setMessage } from './view-utils.js';

const form = document.querySelector('#search-form');
const message = document.querySelector('#search-message');
const donorResults = document.querySelector('#donor-results');
const bankResults = document.querySelector('#bank-results');
const button = form.querySelector('button[type="submit"]');

async function search() {
  setMessage(message, '');
  if (!form.reportValidity()) {
    return;
  }
  ui.setBusy(button, true, 'Search availability');
  donorResults.setAttribute('aria-busy', 'true');
  bankResults.setAttribute('aria-busy', 'true');
  const values = new FormData(form);
  const params = {
    blood_group: values.get('blood_group') || undefined,
    city: String(values.get('city') || '').trim() || undefined,
    pin_code: String(values.get('pin_code') || '').trim() || undefined,
    area: String(values.get('area') || '').trim() || undefined,
  };
  const donorParams = {
    ...params,
    compatible: values.get('compatible') === 'true',
  };
  const [donorResult, bankResult] = await Promise.allSettled([
    api.search.donors(donorParams),
    api.search.bloodBanks(params),
  ]);
  const donors = donorResult.status === 'fulfilled' ? donorResult.value.data.items || [] : [];
  const banks = bankResult.status === 'fulfilled' ? bankResult.value.data.items || [] : [];
  renderSearchResults({ donors, banks }, donorResults, bankResults);
  donorResults.setAttribute('aria-busy', 'false');
  bankResults.setAttribute('aria-busy', 'false');

  const failures = [donorResult, bankResult].filter((result) => result.status === 'rejected');
  if (failures.length) {
    const error = failures[0].reason;
    setMessage(message, `Some results could not be loaded: ${error.message}`, 'error');
    ui.handleError(error);
  } else {
    setMessage(message, `${donors.length} donor listings and ${banks.length} blood-bank listings returned. Confirm availability directly.`, '');
  }
  ui.setBusy(button, false, 'Search availability');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  void search();
});

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    donorResults.replaceChildren();
    bankResults.replaceChildren();
    setMessage(message, '');
  });
});
