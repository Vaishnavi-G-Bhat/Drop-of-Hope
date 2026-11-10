import { ui } from './ui.js';

export function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== '') {
    node.textContent = text;
  }
  return node;
}

export function setMessage(node, message, kind = '') {
  if (!node) {
    return;
  }
  node.textContent = message;
  node.className = kind ? `notice notice--${kind}` : '';
}

export function setFormValues(form, values) {
  for (const [name, value] of Object.entries(values)) {
    const control = form.elements.namedItem(name);
    if (control instanceof HTMLElement && 'value' in control) {
      control.value = value ?? '';
    }
  }
}

export function renderSearchResults({ donors, banks }, donorTarget, bankTarget) {
  donorTarget.replaceChildren();
  bankTarget.replaceChildren();

  for (const donor of donors || []) {
    const card = element('article', 'data-card');
    card.append(element('h3', '', donor.display_name || 'Registered donor'));
    card.append(element('p', '', `${donor.blood_group} · ${donor.city}${donor.area ? `, ${donor.area}` : ''}`));
    card.append(ui.statusBadge(donor.availability_status));
    card.append(ui.statusBadge(donor.freshness || 'Needs confirmation', donor.freshness === 'Current' ? 'success' : 'warning'));
    if (donor.masked_phone) {
      card.append(element('p', '', `Contact: ${donor.masked_phone}`));
    } else {
      card.append(element('p', 'muted', 'Sign in to view contact details when the backend permits.'));
    }
    if (donor.donation_gap_notice) {
      card.append(element('p', 'form-hint', donor.donation_gap_notice));
    }
    donorTarget.append(card);
  }

  for (const bank of banks || []) {
    const card = element('article', 'data-card');
    card.append(element('h3', '', bank.name));
    card.append(element('p', '', [bank.address, bank.area, bank.city].filter(Boolean).join(', ')));
    if (bank.units_reported !== undefined) {
      card.append(element('p', '', `${bank.units_reported} reported units for the selected group`));
    }
    card.append(ui.statusBadge(bank.verified ? 'Verified' : 'Unverified', bank.verified ? 'success' : 'warning'));
    card.append(ui.statusBadge(bank.freshness || 'Needs confirmation', bank.freshness === 'Current' ? 'success' : 'warning'));
    if (bank.contact_phone) {
      card.append(element('p', '', `Contact: ${bank.contact_phone}`));
    } else {
      card.append(element('p', 'muted', 'Sign in to view contact details when the backend permits.'));
    }
    bankTarget.append(card);
  }

  if (!donorTarget.childElementCount) {
    donorTarget.append(ui.emptyState('No matching donors found', 'Try another blood group or location.', null, null));
  }
  if (!bankTarget.childElementCount) {
    bankTarget.append(ui.emptyState('No matching blood banks found', 'Try another location or blood group.', null, null));
  }
}

export function showApiError(error, messageNode) {
  setMessage(messageNode, error?.message || 'The request could not be completed.', 'error');
  ui.handleError(error);
}
