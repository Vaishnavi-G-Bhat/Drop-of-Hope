const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

export function formatDateTime(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
}

export function formatRelativeTime(value, now = Date.now()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const minutes = Math.round((date.getTime() - now) / 60_000);
  if (Math.abs(minutes) < 60) {
    return relativeTimeFormatter.format(minutes, 'minute');
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return relativeTimeFormatter.format(hours, 'hour');
  }
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) {
    return relativeTimeFormatter.format(days, 'day');
  }
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) {
    return relativeTimeFormatter.format(months, 'month');
  }
  return relativeTimeFormatter.format(Math.round(months / 12), 'year');
}

export function setRelativeTime(element, value) {
  if (!value) {
    element.textContent = '';
    element.removeAttribute('datetime');
    element.removeAttribute('title');
    return;
  }

  element.textContent = formatRelativeTime(value);
  element.dateTime = value;
  element.title = formatDateTime(value);
}
