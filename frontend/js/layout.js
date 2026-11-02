import { APP_NAME, STORAGE_KEYS, appUrl } from './config.js';
import { getLanguage, setLanguage, t } from './i18n.js';
import { startUnreadCountRefresh } from './auth.js';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text) {
    node.textContent = text;
  }
  return node;
}

function link(href, key) {
  const label = t(key);
  const node = element('a', 'nav-link', label);
  node.href = appUrl(href);
  node.dataset.i18n = key;
  return node;
}

function buildNavbar() {
  const header = element('header', 'site-header');
  const nav = element('nav', 'site-nav');
  nav.setAttribute('aria-label', 'Main navigation');

  const brand = element('a', 'brand');
  brand.href = appUrl('index.html');
  const logo = document.createElement('img');
  logo.src = appUrl('assets/logo.svg');
  logo.alt = '';
  logo.width = 38;
  logo.height = 38;
  brand.append(logo, element('span', '', APP_NAME));

  const links = element('div', 'site-nav__links');
  links.append(
    link('index.html', 'home'),
    link('search.html', 'search'),
    link('login.html', 'login'),
    link('register.html', 'register'),
    link('notifications.html', 'notifications'),
  );

  const unread = element('span', 'unread-count', '0');
  unread.dataset.unreadCount = '';
  unread.hidden = true;
  unread.setAttribute('aria-label', t('notifications'));
  const notificationLink = links.querySelector('a[href="notifications.html"]');
  notificationLink?.append(' ', unread);

  const controls = element('div', 'site-nav__controls');
  const language = document.createElement('button');
  language.type = 'button';
  language.className = 'text-button';
  language.textContent = getLanguage() === 'en' ? 'EN | ಕನ್ನಡ' : 'ಕನ್ನಡ | EN';
  language.setAttribute('aria-label', t('language'));
  language.addEventListener('click', () => {
    setLanguage(getLanguage() === 'en' ? 'kn' : 'en');
    language.textContent = getLanguage() === 'en' ? 'EN | ಕನ್ನಡ' : 'ಕನ್ನಡ | EN';
  });
  window.addEventListener('app:languagechange', () => {
    language.setAttribute('aria-label', t('language'));
  });

  const textControls = element('div', 'text-size-controls');
  textControls.setAttribute('aria-label', t('textSize'));
  for (const [label, delta] of [['A−', -1], ['A', 0], ['A+', 1]]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'text-button';
    button.textContent = label;
    button.setAttribute('aria-label', `${t('textSize')} ${label}`);
    button.addEventListener('click', () => adjustTextSize(delta));
    textControls.append(button);
  }

  controls.append(language, textControls);
  nav.append(brand, links, controls);
  header.append(nav);
  return header;
}

function adjustTextSize(delta) {
  const current = Number(localStorage.getItem(STORAGE_KEYS.textScale) || 0);
  const next = delta === 0 ? 0 : Math.max(-1, Math.min(3, current + delta));
  localStorage.setItem(STORAGE_KEYS.textScale, String(next));
  document.documentElement.style.setProperty('--text-scale', String(1 + next * 0.1));
}

function buildFooter() {
  const footer = element('footer', 'site-footer');
  const logo = document.createElement('img');
  logo.src = appUrl('assets/logo.svg');
  logo.alt = '';
  logo.width = 30;
  logo.height = 30;
  const text = element('p', '', `${APP_NAME} — ${t('footerText')}`);
  text.dataset.i18n = 'footerText';
  footer.append(logo, text);
  window.addEventListener('app:languagechange', () => {
    text.textContent = `${APP_NAME} — ${t('footerText')}`;
  });
  return footer;
}

function initializeLayout() {
  document.documentElement.lang = getLanguage();
  const storedScale = Number(localStorage.getItem(STORAGE_KEYS.textScale) || 0);
  document.documentElement.style.setProperty(
    '--text-scale',
    String(1 + Math.max(-1, Math.min(3, storedScale)) * 0.1),
  );

  const skipLink = element('a', 'skip-link', t('skipToContent'));
  skipLink.href = '#main-content';
  document.body.prepend(skipLink);

  const header = buildNavbar();
  const footer = buildFooter();
  const main = document.querySelector('main');
  if (main) {
    if (!main.id) {
      main.id = 'main-content';
    }
    main.classList.add('page-content');
    main.before(header);
    main.after(footer);
  } else {
    document.body.append(header, footer);
  }
  startUnreadCountRefresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLayout, { once: true });
} else {
  initializeLayout();
}
