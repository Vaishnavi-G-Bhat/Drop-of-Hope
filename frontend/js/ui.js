import { t } from './i18n.js';
import { appUrl } from './config.js';

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function toast(message, { kind = 'info', duration = 5000 } = {}) {
  let region = document.querySelector('[data-toast-region]');
  if (!region) {
    region = makeElement('div', 'toast-region');
    region.dataset.toastRegion = '';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'false');
    document.body.append(region);
  }

  const item = makeElement('div', `toast toast--${kind}`, message);
  item.setAttribute('role', 'status');
  region.append(item);
  window.setTimeout(() => item.remove(), duration);
}

function confirmDialog({ title, message, confirmLabel, cancelLabel }) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'confirm-dialog';
    const content = makeElement('div', 'confirm-dialog__content');
    content.append(makeElement('h2', '', title));
    content.append(makeElement('p', '', message));
    const actions = makeElement('div', 'confirm-dialog__actions');
    const cancel = makeElement('button', 'button button--secondary', cancelLabel);
    cancel.type = 'button';
    const confirm = makeElement('button', 'button button--primary', confirmLabel);
    confirm.type = 'button';
    actions.append(cancel, confirm);
    content.append(actions);
    dialog.append(content);
    document.body.append(dialog);

    const finish = (accepted) => {
      dialog.close();
      dialog.remove();
      resolve(accepted);
    };
    cancel.addEventListener('click', () => finish(false), { once: true });
    confirm.addEventListener('click', () => finish(true), { once: true });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      finish(false);
    }, { once: true });
    dialog.showModal();
    confirm.focus();
  });
}

function showFieldErrors(form, fields) {
  let firstInvalid;
  for (const [name, message] of Object.entries(fields || {})) {
    const input = form.elements.namedItem(name);
    if (!(input instanceof HTMLElement)) {
      continue;
    }

    input.setAttribute('aria-invalid', 'true');
    const errorId = `${input.id || name}-error`;
    input.setAttribute('aria-describedby', errorId);
    let error = form.querySelector(`#${CSS.escape(errorId)}`);
    if (!error) {
      error = makeElement('div', 'field-error');
      error.id = errorId;
      input.insertAdjacentElement('afterend', error);
    }
    error.textContent = message;
    firstInvalid ||= input;
  }
  firstInvalid?.focus();
}

function dashboardPath(role) {
  const paths = {
    donor: 'donor/dashboard.html',
    patient: 'patient/dashboard.html',
    blood_bank: 'bloodbank/dashboard.html',
    admin: 'admin/dashboard.html',
  };
  return paths[role] || 'index.html';
}

function renderNoAccess(role) {
  const main = document.querySelector('main') || document.body;
  main.replaceChildren();
  const section = makeElement('section', 'state-card state-card--error');
  section.setAttribute('role', 'status');
  section.append(makeElement('h1', '', t('noAccessTitle')));
  section.append(makeElement('p', '', t('noAccessBody')));
  const link = makeElement('a', 'button button--primary', t('goToDashboard'));
  link.href = dashboardPath(role);
  section.append(link);
  main.append(section);
}

function showErrorCard(error) {
  const main = document.querySelector('main') || document.body;
  const card = makeElement('section', 'state-card state-card--error');
  card.setAttribute('role', 'alert');
  card.append(makeElement('h2', '', error.message || t('serverError')));
  const retry = makeElement('button', 'button button--secondary', t('retry'));
  retry.type = 'button';
  retry.addEventListener('click', () => location.reload());
  card.append(retry);
  main.prepend(card);
}

function handleError(error, form) {
  const code = error?.code || 'SERVER_ERROR';
  const message = error?.message || t(code);

  if (code === 'VALIDATION_ERROR' && form) {
    showFieldErrors(form, error.fields);
    toast(message, { kind: 'error' });
    return;
  }

  if (code === 'UNAUTHENTICATED' && !form?.matches('[data-login-form]')) {
    const next = `${location.pathname}${location.search}`;
    toast(t('loginRequired'), { kind: 'warning' });
    location.assign(`${appUrl('login.html')}?next=${encodeURIComponent(next)}`);
    return;
  }

  if (code === 'NOT_FOUND') {
    const state = emptyState(message, '', null, null);
    (document.querySelector('main') || document.body).prepend(state);
    return;
  }

  if (code === 'FORBIDDEN') {
    renderNoAccess();
    return;
  }

  if (code === 'NOT_VERIFIED') {
    const banner = makeElement('div', 'notice notice--warning', message);
    document.querySelector('main')?.prepend(banner);
    return;
  }

  if (code === 'SERVER_ERROR' || code === 'NETWORK_ERROR') {
    showErrorCard({ message });
    return;
  }

  toast(
    code === 'RATE_LIMITED' ? t('rateLimited') : message,
    { kind: code === 'CONFLICT' ? 'warning' : 'error' },
  );
}

function setBusy(button, busy, label) {
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  button.disabled = busy;
  button.setAttribute('aria-busy', String(busy));
  if (label) {
    button.textContent = busy ? t('loading') : label;
  }
}

function createBloodGroupSelector(container, { name = 'blood_group', value } = {}) {
  const fieldset = makeElement('fieldset', 'blood-group-selector');
  const legend = makeElement('legend', '', t('bloodGroup'));
  fieldset.append(legend);

  for (const group of ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']) {
    const label = makeElement('label', 'blood-chip');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = group;
    input.checked = value === group;
    const text = makeElement('span', '', group);
    label.append(input, text);
    fieldset.append(label);
  }

  container.replaceChildren(fieldset);
}

function statusBadge(label, kind = 'neutral') {
  const badge = makeElement('span', `status-badge status-badge--${kind}`);
  const iconText = {
    Available: '✓',
    'Contact me first': '!',
    Unavailable: '×',
    Current: '●',
    'Needs confirmation': '!',
  }[label];
  if (iconText) {
    const icon = makeElement('span', 'status-badge__icon', iconText);
    icon.setAttribute('aria-hidden', 'true');
    badge.append(icon, document.createTextNode(' '));
  }
  badge.append(document.createTextNode(label));
  badge.setAttribute('aria-label', label);
  return badge;
}

function emptyState(title, description, href, actionLabel) {
  const section = makeElement('section', 'empty-state');
  section.append(makeElement('h2', '', title));
  section.append(makeElement('p', '', description));
  if (href && actionLabel) {
    const link = makeElement('a', 'button button--primary', actionLabel);
    link.href = href;
    section.append(link);
  }
  return section;
}

function skeleton(container, count = 3) {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < count; index += 1) {
    const item = makeElement('div', 'skeleton');
    item.setAttribute('aria-hidden', 'true');
    fragment.append(item);
  }
  container.setAttribute('aria-busy', 'true');
  container.replaceChildren(fragment);
}

function renderTimeline(container, timeline, currentStatus) {
  const list = makeElement('ol', 'timeline');
  for (const item of timeline || []) {
    const entry = makeElement('li', 'timeline__item');
    entry.append(makeElement('strong', '', item.status));
    if (item.at) {
      const time = document.createElement('time');
      time.dateTime = item.at;
      time.textContent = new Date(item.at).toLocaleString();
      time.title = item.at;
      entry.append(time);
    }
    list.append(entry);
  }
  if (!timeline?.length && currentStatus) {
    const entry = makeElement('li', 'timeline__item');
    entry.append(makeElement('strong', '', currentStatus));
    list.append(entry);
  }
  container.replaceChildren(list);
}

export const ui = Object.freeze({
  toast,
  confirmDialog,
  handleError,
  setBusy,
  createBloodGroupSelector,
  statusBadge,
  emptyState,
  skeleton,
  renderTimeline,
  renderNoAccess,
});
