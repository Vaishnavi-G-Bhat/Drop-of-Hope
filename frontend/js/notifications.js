import { api } from './api.js';
import { requireRole } from './auth.js';
import { ui } from './ui.js';
import { element, setMessage } from './view-utils.js';

const target = document.querySelector('#notifications-list');
const message = document.querySelector('#notifications-message');

async function loadNotifications() {
  target.setAttribute('aria-busy', 'true');
  const { data } = await api.notifications.list({ per_page: 50 });
  target.replaceChildren();
  target.setAttribute('aria-busy', 'false');
  if (!data.items.length) {
    target.append(ui.emptyState('You are all caught up', 'New updates for your account will appear here.', null, null));
    return;
  }
  for (const notification of data.items) {
    const card = element('article', 'data-card');
    const heading = element('div', 'section-heading');
    heading.append(
      element('h2', '', notification.title),
      ui.statusBadge(notification.is_read ? 'Read' : 'Unread', notification.is_read ? 'neutral' : 'warning'),
    );
    card.append(heading);
    card.append(element('p', '', notification.message));
    if (notification.created_at) {
      card.append(element('p', 'muted', new Date(notification.created_at).toLocaleString()));
    }
    if (!notification.is_read) {
      const button = element('button', 'button button--secondary button--small', 'Mark as read');
      button.type = 'button';
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          await api.notifications.markRead(notification.id);
          await loadNotifications();
        } catch (error) {
          setMessage(message, error.message, 'error');
          ui.handleError(error);
          button.disabled = false;
        }
      });
      card.append(button);
    }
    target.append(card);
  }
}

async function initialize() {
  const account = await requireRole('donor', 'patient', 'blood_bank', 'admin');
  if (!account) {
    return;
  }
  document.querySelector('#mark-all-read').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    ui.setBusy(button, true, 'Mark all as read');
    try {
      await api.notifications.markAllRead();
      setMessage(message, 'All notifications marked as read.', 'success');
      await loadNotifications();
    } catch (error) {
      setMessage(message, error.message, 'error');
      ui.handleError(error);
    } finally {
      ui.setBusy(button, false, 'Mark all as read');
    }
  });
  await loadNotifications();
}

initialize().catch((error) => {
  setMessage(message, error.message || 'Could not load notifications.', 'error');
  ui.handleError(error);
  target.setAttribute('aria-busy', 'false');
});
