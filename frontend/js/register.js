import { api } from './api.js';
import { ui } from './ui.js';
import { setMessage } from './view-utils.js';

const form = document.querySelector('#register-form');
const message = document.querySelector('#form-message');
const roleControl = form.elements.role;
const button = form.querySelector('button[type="submit"]');
const fieldsets = {
  donor: document.querySelector('#donor-fields'),
  patient: document.querySelector('#patient-fields'),
  blood_bank: document.querySelector('#bank-fields'),
};

function updateRoleFields() {
  for (const [role, fieldset] of Object.entries(fieldsets)) {
    const selected = role === roleControl.value;
    fieldset.hidden = !selected;
    fieldset.disabled = !selected;
  }
}

roleControl.addEventListener('change', updateRoleFields);
document.querySelector('#show-password').addEventListener('change', (event) => {
  form.elements.password.type = event.currentTarget.checked ? 'text' : 'password';
});

const requestedRole = new URLSearchParams(location.search).get('role');
if (Object.hasOwn(fieldsets, requestedRole)) {
  roleControl.value = requestedRole;
}
updateRoleFields();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(message, '');
  if (!form.reportValidity()) {
    return;
  }

  const values = new FormData(form);
  const role = String(values.get('role'));
  const payload = {
    full_name: String(values.get('full_name')).trim(),
    email: String(values.get('email')).trim(),
    phone: String(values.get('phone')).trim(),
    password: String(values.get('password')),
    city: String(values.get('city') || '').trim(),
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
    roleControl.value = role;
    updateRoleFields();
  } catch (error) {
    setMessage(message, error.message || 'Unable to create the account. Check the form and try again.', 'error');
    ui.handleError(error, form);
  } finally {
    ui.setBusy(button, false, 'Create account');
  }
});
