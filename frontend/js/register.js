import { api } from './api.js';
import { ui } from './ui.js';
import { setMessage } from './view-utils.js';

const form = document.querySelector('#register-form');
const message = document.querySelector('#form-message');
const button = form.querySelector('button[type="submit"]');
const accountOptions = document.querySelector('#account-options');
const formPanel = document.querySelector('#registration-form-panel');
const fieldsets = {
  donor: document.querySelector('#donor-fields'),
  patient: document.querySelector('#patient-fields'),
  blood_bank: document.querySelector('#bank-fields'),
};

const roleDetails = {
  donor: {
    title: 'Register as a blood donor',
    description: 'Create a donor profile with your blood group and location. You can update your availability from your dashboard.',
  },
  patient: {
    title: 'Register as a blood requester',
    description: 'Create an account to submit and track blood requests.',
  },
  blood_bank: {
    title: 'Register a blood bank',
    description: 'Create an account for your blood bank. An administrator must verify it before it appears in public search.',
  },
};

function updateRoleFields(selectedRole) {
  for (const [role, fieldset] of Object.entries(fieldsets)) {
    const selected = role === selectedRole;
    fieldset.hidden = !selected;
    fieldset.disabled = !selected;
  }
}

document.querySelector('#show-password').addEventListener('change', (event) => {
  form.elements.password.type = event.currentTarget.checked ? 'text' : 'password';
});

const requestedRole = new URLSearchParams(location.search).get('role');
if (Object.hasOwn(fieldsets, requestedRole)) {
  accountOptions.hidden = true;
  formPanel.hidden = false;
  document.querySelector('.auth-card').setAttribute('aria-labelledby', 'registration-title');
  document.querySelector('#registration-title').textContent = roleDetails[requestedRole].title;
  document.querySelector('#registration-description').textContent = roleDetails[requestedRole].description;
  updateRoleFields(requestedRole);
} else {
  formPanel.hidden = true;
  accountOptions.hidden = false;
  document.querySelector('.auth-card').setAttribute('aria-labelledby', 'register-title');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(message, '');
  if (!form.reportValidity()) {
    return;
  }

  const values = new FormData(form);
  const role = requestedRole;
  const payload = {
    full_name: String(values.get('full_name')).trim(),
    email: String(values.get('email')).trim(),
    phone: String(values.get('phone')).trim(),
    password: String(values.get('password')),
    city: String(values.get('city') || '').trim(),
    country: String(values.get('country') || '').trim() || undefined,
    state: String(values.get('state') || '').trim() || undefined,
    district: String(values.get('district') || '').trim() || undefined,
    area: String(values.get('area') || '').trim() || undefined,
    pin_code: String(values.get('pin_code') || '').trim() || undefined,
  };
  let submit;
  if (role === 'donor') {
    payload.age = Number(values.get('age'));
    payload.blood_group = String(values.get('blood_group'));
    submit = api.auth.registerDonor;
  } else if (role === 'patient') {
    submit = api.auth.registerPatient;
  } else {
    payload.name = String(values.get('name') || '').trim();
    payload.license_number = String(values.get('license_number') || '').trim() || undefined;
    payload.address = String(values.get('address') || '').trim() || undefined;
    payload.contact_phone = String(values.get('contact_phone') || '').trim() || undefined;
    payload.open_hours = String(values.get('open_hours') || '').trim() || undefined;
    submit = api.auth.registerBloodBank;
  }

  ui.setBusy(button, true, 'Create account');
  try {
    const result = await submit(payload);
    const verificationNote =
      role === 'donor' || role === 'blood_bank'
        ? ' An administrator must verify this account before it appears in public search.'
        : '';
    setMessage(message, `${result.message || 'Account created successfully.'}${verificationNote} You can now log in.`, 'success');
    form.reset();
  } catch (error) {
    setMessage(message, error.message || 'Unable to create the account. Check the form and try again.', 'error');
    ui.handleError(error, form);
  } finally {
    ui.setBusy(button, false, 'Create account');
  }
});
