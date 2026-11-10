import { ApiError, api } from './api.js';
import { redirectAfterLogin } from './auth.js';
import { STORAGE_KEYS } from './config.js';
import { ui } from './ui.js';
import { setMessage } from './view-utils.js';

const form = document.querySelector('#login-form');
const message = document.querySelector('#form-message');
const button = form.querySelector('button[type="submit"]');

document.querySelector('#show-password').addEventListener('change', (event) => {
  form.elements.password.type = event.currentTarget.checked ? 'text' : 'password';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(message, '');
  if (!form.reportValidity()) {
    return;
  }

  ui.setBusy(button, true, 'Log in');
  try {
    const { data, message: successMessage } = await api.auth.login({
      email: form.elements.email.value.trim(),
      password: form.elements.password.value,
    });
    const role = data.user?.role;
    if (!role) {
      throw new ApiError({
        status: 500,
        code: 'SERVER_ERROR',
        message: 'The server signed in the account but did not return its role.',
      });
    }
    localStorage.setItem(STORAGE_KEYS.authenticated, 'true');
    setMessage(message, successMessage || 'Logged in successfully.', 'success');
    const next = new URLSearchParams(location.search).get('next');
    window.setTimeout(() => redirectAfterLogin(next, role), 350);
  } catch (error) {
    setMessage(message, error.message || 'Unable to log in. Check your details and try again.', 'error');
    ui.handleError(error, form);
  } finally {
    ui.setBusy(button, false, 'Log in');
  }
});
