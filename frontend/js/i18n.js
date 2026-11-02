import { LANGUAGES } from './enums.js';
import { STORAGE_KEYS } from './config.js';

const dictionaries = Object.freeze({
  en: Object.freeze({
    appName: 'Drop of Hope',
    home: 'Home',
    search: 'Find blood',
    login: 'Log in',
    register: 'Create account',
    notifications: 'Notifications',
    bloodGroup: 'Blood group',
    language: 'Language',
    textSize: 'Text size',
    noAccessTitle: 'You do not have access to this page',
    noAccessBody: 'Sign in with an account that has permission to continue.',
    goToDashboard: 'Go to your dashboard',
    retry: 'Retry',
    loading: 'Please wait…',
    serverError: 'The server could not complete this request.',
    loginRequired: 'Please log in to continue.',
    rateLimited: 'Too many attempts. Please wait a minute.',
    notFound: 'The requested item could not be found.',
    NETWORK_ERROR: 'Cannot reach the server. Check that the backend is running.',
    SERVER_ERROR: 'The server could not complete this request.',
    skipToContent: 'Skip to content',
    footerText: 'A clear path from urgent need to a human connection.',
    languageEnglish: 'English',
    languageKannada: 'ಕನ್ನಡ',
  }),
  kn: Object.freeze({
    appName: 'Drop of Hope',
    home: 'ಮುಖಪುಟ',
    search: 'ರಕ್ತ ಹುಡುಕಿ',
    login: 'ಲಾಗಿನ್',
    register: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
    language: 'ಭಾಷೆ',
    textSize: 'ಅಕ್ಷರದ ಗಾತ್ರ',
    noAccessTitle: 'ಈ ಪುಟವನ್ನು ತೆರೆಯಲು ಅನುಮತಿ ಇಲ್ಲ',
    noAccessBody: 'ಮುಂದುವರಿಯಲು ಅನುಮತಿ ಇರುವ ಖಾತೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ.',
    goToDashboard: 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ',
    retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    loading: 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ…',
    serverError: 'ಸರ್ವರ್ ಈ ವಿನಂತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
    loginRequired: 'ಮುಂದುವರಿಯಲು ಲಾಗಿನ್ ಮಾಡಿ.',
    rateLimited: 'ಹಲವು ಪ್ರಯತ್ನಗಳಾಗಿವೆ. ದಯವಿಟ್ಟು ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.',
    notFound: 'ಕೋರಿದ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ.',
    NETWORK_ERROR: 'ಸರ್ವರ್ ಸಂಪರ್ಕವಾಗುತ್ತಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಪರಿಶೀಲಿಸಿ.',
    SERVER_ERROR: 'ಸರ್ವರ್ ಈ ವಿನಂತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
    skipToContent: 'ವಿಷಯಕ್ಕೆ ತೆರಳಿ',
    footerText: 'ತುರ್ತು ಅಗತ್ಯದಿಂದ ಮಾನವೀಯ ಸಂಪರ್ಕದವರೆಗೆ ಸ್ಪಷ್ಟ ದಾರಿ.',
    languageEnglish: 'English',
    languageKannada: 'ಕನ್ನಡ',
  }),
});

let activeLanguage = LANGUAGES.includes(localStorage.getItem(STORAGE_KEYS.language))
  ? localStorage.getItem(STORAGE_KEYS.language)
  : 'en';

export function t(key) {
  return dictionaries[activeLanguage][key] || dictionaries.en[key] || key;
}

export function getLanguage() {
  return activeLanguage;
}

export function setLanguage(language) {
  if (!LANGUAGES.includes(language)) {
    throw new RangeError(`Unsupported language: ${language}`);
  }

  activeLanguage = language;
  localStorage.setItem(STORAGE_KEYS.language, language);
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  window.dispatchEvent(new CustomEvent('app:languagechange', { detail: language }));
}
