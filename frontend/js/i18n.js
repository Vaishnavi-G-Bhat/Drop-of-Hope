import { LANGUAGES } from './enums.js';
import { STORAGE_KEYS } from './config.js?v=3';

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
    textSizeDecrease: 'Decrease',
    textSizeReset: 'Reset',
    textSizeIncrease: 'Increase',
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
    textSizeDecrease: 'ಕಡಿಮೆ ಮಾಡಿ',
    textSizeReset: 'ಮರುಹೊಂದಿಸಿ',
    textSizeIncrease: 'ಹೆಚ್ಚಿಸಿ',
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

const kannadaText = Object.freeze({
  'Together, in the moments that matter': 'ಮುಖ್ಯ ಕ್ಷಣಗಳಲ್ಲಿ ಒಟ್ಟಾಗಿ',
  'A little hope can go a long way.': 'ಒಂದು ಚಿಕ್ಕ ಆಶೆಯೂ ದೊಡ್ಡ ಬದಲಾವಣೆ ತರಬಹುದು.',
  'Connect with registered blood donors and verified blood banks. Find the next step when someone needs blood, or be ready to give when you can.': 'ನೋಂದಾಯಿತ ರಕ್ತದಾನಿಗಳು ಮತ್ತು ಪರಿಶೀಲಿತ ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ. ರಕ್ತದ ಅಗತ್ಯವಿದ್ದಾಗ ಮುಂದಿನ ಹೆಜ್ಜೆ ಕಂಡುಕೊಳ್ಳಿ ಅಥವಾ ಸಾಧ್ಯವಾದಾಗ ದಾನಕ್ಕೆ ಸಿದ್ಧರಾಗಿ.',
  'Information helps you connect; medical eligibility and availability must always be confirmed with a healthcare professional or blood bank.': 'ಮಾಹಿತಿಯು ಸಂಪರ್ಕಕ್ಕೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ; ವೈದ್ಯಕೀಯ ಅರ್ಹತೆ ಮತ್ತು ಲಭ್ಯತೆಯನ್ನು ಆರೋಗ್ಯ ವೃತ್ತಿಪರರು ಅಥವಾ ರಕ್ತ ಬ್ಯಾಂಕ್‌ನೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.',
  'How it works': 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
  'A clear path to help': 'ಸಹಾಯಕ್ಕೆ ಸ್ಪಷ್ಟ ದಾರಿ',
  'Share what is needed': 'ಅಗತ್ಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
  'Requesters can post a blood group, location, number of units and urgency.': 'ರಕ್ತದ ಗುಂಪು, ಸ್ಥಳ, ಘಟಕಗಳ ಸಂಖ್ಯೆ ಮತ್ತು ತುರ್ತು ಮಟ್ಟವನ್ನು ವಿನಂತಿದಾರರು ಪ್ರಕಟಿಸಬಹುದು.',
  'Find local availability': 'ಸ್ಥಳೀಯ ಲಭ್ಯತೆಯನ್ನು ಹುಡುಕಿ',
  'Search verified donors and blood banks using their reported information.': 'ಪರಿಶೀಲಿತ ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳನ್ನು ಅವರ ವರದಿಯಾದ ಮಾಹಿತಿಯಿಂದ ಹುಡುಕಿ.',
  'Confirm directly': 'ನೇರವಾಗಿ ದೃಢೀಕರಿಸಿ',
  'Contact the listed service or donor and confirm current availability before travelling.': 'ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಪಟ್ಟಿಯಲ್ಲಿರುವ ಸೇವೆ ಅಥವಾ ದಾನಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ಪ್ರಸ್ತುತ ಲಭ್ಯತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
  'About us': 'ನಮ್ಮ ಬಗ್ಗೆ',
  'Drop of Hope brings urgent care closer to the community.': 'ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್ ತುರ್ತು ಸಹಾಯವನ್ನು ಸಮುದಾಯಕ್ಕೆ ಹತ್ತಿರ ತರುತ್ತದೆ.',
  'We help emergency blood requests reach nearby donors and verified blood banks faster. The portal is designed to make blood donation coordination simpler, safer and more transparent for patients, families and healthcare teams.': 'ತುರ್ತು ರಕ್ತದ ವಿನಂತಿಗಳು ಹತ್ತಿರದ ದಾನಿಗಳು ಮತ್ತು ಪರಿಶೀಲಿತ ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳನ್ನು ವೇಗವಾಗಿ ತಲುಪಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ. ರೋಗಿಗಳು, ಕುಟುಂಬಗಳು ಮತ್ತು ಆರೋಗ್ಯ ತಂಡಗಳಿಗೆ ರಕ್ತದಾನ ಸಮನ್ವಯವನ್ನು ಸರಳ, ಸುರಕ್ಷಿತ ಮತ್ತು ಪಾರದರ್ಶಕಗೊಳಿಸಲು ಈ ಪೋರ್ಟಲ್ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
  'Every listing is a real-world connection, and every donor is encouraged to confirm readiness directly with the receiving hospital or bank before donating.': 'ಪ್ರತಿ ಪಟ್ಟಿಯೂ ನೈಜ ಸಂಪರ್ಕವಾಗಿದೆ. ದಾನ ಮಾಡುವ ಮೊದಲು ಸ್ವೀಕರಿಸುವ ಆಸ್ಪತ್ರೆ ಅಥವಾ ಬ್ಯಾಂಕ್‌ನೊಂದಿಗೆ ಸಿದ್ಧತೆಯನ್ನು ನೇರವಾಗಿ ದೃಢೀಕರಿಸಲು ದಾನಿಗಳಿಗೆ ಸಲಹೆ ನೀಡಲಾಗುತ್ತದೆ.',
  'Important': 'ಮುಖ್ಯ',
  'Drop of Hope is a connection portal, not a medical service. Search results and stock information may change; verify them directly with the donor or blood bank.': 'ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್ ಸಂಪರ್ಕ ಪೋರ್ಟಲ್ ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ಸೇವೆಯಲ್ಲ. ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಸ್ಟಾಕ್ ಮಾಹಿತಿ ಬದಲಾಗಬಹುದು; ದಾನಿ ಅಥವಾ ರಕ್ತ ಬ್ಯಾಂಕ್‌ನೊಂದಿಗೆ ನೇರವಾಗಿ ಪರಿಶೀಲಿಸಿ.',
  'Blood groups': 'ರಕ್ತದ ಗುಂಪುಗಳು',
  'Know the basics before you donate or request': 'ದಾನ ಅಥವಾ ವಿನಂತಿಗೂ ಮೊದಲು ಮೂಲಭೂತ ಮಾಹಿತಿ ತಿಳಿಯಿರಿ',
  'Most common': 'ಸಾಮಾನ್ಯವಾಗಿ ಕಂಡುಬರುವುದು',
  'A+ is among the most requested blood groups and often appears in local emergency searches.': 'A+ ಹೆಚ್ಚು ಬೇಡಿಕೆಯಿರುವ ರಕ್ತದ ಗುಂಪುಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ ಮತ್ತು ಸ್ಥಳೀಯ ತುರ್ತು ಹುಡುಕಾಟಗಳಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಕಾಣಿಸುತ್ತದೆ.',
  'Universal donor': 'ಸಾರ್ವತ್ರಿಕ ದಾನಿ',
  'O- is a critical emergency type used when the donor blood group is unknown or urgent.': 'ದಾನಿಯ ರಕ್ತದ ಗುಂಪು ತಿಳಿದಿಲ್ಲದ ಅಥವಾ ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ O- ಅನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.',
  'Plasma rich': 'ಪ್ಲಾಸ್ಮಾ ದಾನಕ್ಕೆ ಮುಖ್ಯ',
  'AB+ donors play a vital role in many transfusion cases, and availability should always be confirmed.': 'AB+ ದಾನಿಗಳು ಅನೇಕ ರಕ್ತಸೇರಿಕೆ ಸಂದರ್ಭಗಳಲ್ಲಿ ಪ್ರಮುಖ ಪಾತ್ರ ವಹಿಸುತ್ತಾರೆ; ಲಭ್ಯತೆಯನ್ನು ಯಾವಾಗಲೂ ದೃಢೀಕರಿಸಿ.',
  'Verified listings': 'ಪರಿಶೀಲಿತ ಪಟ್ಟಿಗಳು',
  'Check live blood-bank stock and donor availability to match the correct group and location.': 'ಸರಿಯಾದ ಗುಂಪು ಮತ್ತು ಸ್ಥಳಕ್ಕೆ ಹೊಂದಿಸಲು ರಕ್ತ ಬ್ಯಾಂಕ್‌ನ ನೇರ ಸ್ಟಾಕ್ ಮತ್ತು ದಾನಿಗಳ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
  'Live availability': 'ನೇರ ಲಭ್ಯತೆ',
  'Blood groups reported by verified blood banks': 'ಪರಿಶೀಲಿತ ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳು ವರದಿ ಮಾಡಿದ ರಕ್ತದ ಗುಂಪುಗಳು',
  'Live totals are loaded from the backend. A missing result means no verified stock record was returned, not that a group is medically compatible.': 'ನೇರ ಒಟ್ಟುಗಳನ್ನು ಬ್ಯಾಕೆಂಡ್‌ನಿಂದ ಪಡೆಯಲಾಗುತ್ತದೆ. ಫಲಿತಾಂಶ ಕಾಣದಿರುವುದು ಪರಿಶೀಲಿತ ಸ್ಟಾಕ್ ದಾಖಲೆ ಸಿಗಲಿಲ್ಲ ಎಂದರ್ಥ; ವೈದ್ಯಕೀಯ ಹೊಂದಾಣಿಕೆ ಎಂದಲ್ಲ.',
  'Search live availability': 'ನೇರ ಲಭ್ಯತೆಯನ್ನು ಹುಡುಕಿ',
  'Register a blood bank': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ನೋಂದಾಯಿಸಿ',
  'Need help now?': 'ಈಗಲೇ ಸಹಾಯ ಬೇಕೇ?',
  'Start with a local search.': 'ಸ್ಥಳೀಯ ಹುಡುಕಾಟದಿಂದ ಪ್ರಾರಂಭಿಸಿ.',
  'Search current donor and blood-bank listings by blood group and location, then confirm details directly.': 'ರಕ್ತದ ಗುಂಪು ಮತ್ತು ಸ್ಥಳದ ಮೂಲಕ ಪ್ರಸ್ತುತ ದಾನಿ ಹಾಗೂ ರಕ್ತ ಬ್ಯಾಂಕ್ ಪಟ್ಟಿಗಳನ್ನು ಹುಡುಕಿ, ನಂತರ ವಿವರಗಳನ್ನು ನೇರವಾಗಿ ದೃಢೀಕರಿಸಿ.',
  'Find blood availability': 'ರಕ್ತದ ಲಭ್ಯತೆ ಹುಡುಕಿ',
  'Create a request': 'ವಿನಂತಿ ರಚಿಸಿ',
  'Contact us': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
  'Support and coordination': 'ಬೆಂಬಲ ಮತ್ತು ಸಮನ್ವಯ',
  'For urgent medical needs': 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಅಗತ್ಯಗಳಿಗೆ',
  'For medical advice or emergency treatment, contact your healthcare provider or local emergency services directly. For portal support, use the contact details above or sign in to manage your account.': 'ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಥವಾ ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ನಿಮ್ಮ ಆರೋಗ್ಯ ಸೇವಾದಾರರು ಅಥವಾ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಗಳನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ. ಪೋರ್ಟಲ್ ಬೆಂಬಲಕ್ಕಾಗಿ ಮೇಲಿನ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಬಳಸಿ ಅಥವಾ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ.',
  'Welcome back': 'ಮತ್ತೆ ಸ್ವಾಗತ',
  'Log in to Drop of Hope': 'ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
  'Use your registered email and password.': 'ನೋಂದಾಯಿತ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ.',
  'Email address': 'ಇಮೇಲ್ ವಿಳಾಸ',
  'Password': 'ಪಾಸ್‌ವರ್ಡ್',
  'Show password': 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
  'New to Drop of Hope?': 'ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್‌ಗೆ ಹೊಸಬರೇ?',
  'Create an account': 'ಖಾತೆ ರಚಿಸಿ',
  'Join the community': 'ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ',
  'Choose one account type to continue. Each account has its own registration form.': 'ಮುಂದುವರಿಯಲು ಒಂದು ಖಾತೆ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಪ್ರತಿ ಖಾತೆಗೆ ಪ್ರತ್ಯೇಕ ನೋಂದಣಿ ಫಾರ್ಮ್ ಇದೆ.',
  'Blood donor': 'ರಕ್ತದಾನಿ',
  'Blood requester': 'ರಕ್ತ ವಿನಂತಿದಾರ',
  'Blood bank': 'ರಕ್ತ ಬ್ಯಾಂಕ್',
  'Register as a blood donor': 'ರಕ್ತದಾನಿಯಾಗಿ ನೋಂದಾಯಿಸಿ',
  'Register as a blood requester': 'ರಕ್ತ ವಿನಂತಿದಾರರಾಗಿ ನೋಂದಾಯಿಸಿ',
  'Register a blood bank': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ನೋಂದಾಯಿಸಿ',
  'Create a donor profile with your blood group and location. You can update your availability from your dashboard.': 'ನಿಮ್ಮ ರಕ್ತದ ಗುಂಪು ಮತ್ತು ಸ್ಥಳದೊಂದಿಗೆ ದಾನಿ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ. ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಲಭ್ಯತೆಯನ್ನು ನವೀಕರಿಸಬಹುದು.',
  'Create an account to submit and track blood requests.': 'ರಕ್ತದ ವಿನಂತಿಗಳನ್ನು ಸಲ್ಲಿಸಲು ಮತ್ತು ಅನುಸರಿಸಲು ಖಾತೆ ರಚಿಸಿ.',
  'Create an account for your blood bank. An administrator must verify it before it appears in public search.': 'ನಿಮ್ಮ ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಾಗಿ ಖಾತೆ ರಚಿಸಿ. ಸಾರ್ವಜನಿಕ ಹುಡುಕಾಟದಲ್ಲಿ ಕಾಣುವ ಮೊದಲು ನಿರ್ವಾಹಕರು ಪರಿಶೀಲಿಸಬೇಕು.',
  'Choose a different account type': 'ಬೇರೆ ಖಾತೆ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ',
  'Full name': 'ಪೂರ್ಣ ಹೆಸರು',
  'Phone number': 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
  'Enter 10 digits.': '10 ಅಂಕೆಗಳನ್ನು ನಮೂದಿಸಿ.',
  'At least 8 characters, with uppercase and lowercase letters, a number, and a special character (for example, ! or #).': 'ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು; ದೊಡ್ಡ ಮತ್ತು ಸಣ್ಣ ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳು, ಒಂದು ಸಂಖ್ಯೆ ಮತ್ತು ವಿಶೇಷ ಚಿಹ್ನೆ (ಉದಾ: ! ಅಥವಾ #) ಇರಲಿ.',
  'Donor details': 'ದಾನಿಯ ವಿವರಗಳು',
  'Age': 'ವಯಸ್ಸು',
  'Select a blood group': 'ರಕ್ತದ ಗುಂಪು ಆಯ್ಕೆಮಾಡಿ',
  'City': 'ನಗರ',
  'Country': 'ದೇಶ',
  'State': 'ರಾಜ್ಯ',
  'District': 'ಜಿಲ್ಲೆ',
  'Area (optional)': 'ಪ್ರದೇಶ (ಐಚ್ಛಿಕ)',
  'PIN code': 'ಪಿನ್ ಕೋಡ್',
  'Requester details': 'ವಿನಂತಿದಾರರ ವಿವರಗಳು',
  'PIN code (optional)': 'ಪಿನ್ ಕೋಡ್ (ಐಚ್ಛಿಕ)',
  'Blood bank details': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ವಿವರಗಳು',
  'Blood bank name': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ಹೆಸರು',
  'License number (optional)': 'ಪರವಾನಗಿ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',
  'Public contact phone (optional)': 'ಸಾರ್ವಜನಿಕ ಸಂಪರ್ಕ ದೂರವಾಣಿ (ಐಚ್ಛಿಕ)',
  'Address (optional)': 'ವಿಳಾಸ (ಐಚ್ಛಿಕ)',
  'Opening hours (optional)': 'ತೆರೆಯುವ ಸಮಯ (ಐಚ್ಛಿಕ)',
  'Already registered?': 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?',
  'Search live listings': 'ನೇರ ಪಟ್ಟಿಗಳನ್ನು ಹುಡುಕಿ',
  'Find donors and blood banks': 'ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳನ್ನು ಹುಡುಕಿ',
  'Filter real listings from the backend by blood group and location. Availability and inventory are reported values; confirm directly before making plans.': 'ರಕ್ತದ ಗುಂಪು ಮತ್ತು ಸ್ಥಳದ ಮೂಲಕ ಬ್ಯಾಕೆಂಡ್‌ನ ನೈಜ ಪಟ್ಟಿಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ. ಲಭ್ಯತೆ ಮತ್ತು ಸ್ಟಾಕ್ ವರದಿಯಾದ ಮಾಹಿತಿ; ಯೋಜಿಸುವ ಮೊದಲು ನೇರವಾಗಿ ದೃಢೀಕರಿಸಿ.',
  'Search by need and location': 'ಅಗತ್ಯ ಮತ್ತು ಸ್ಥಳದ ಮೂಲಕ ಹುಡುಕಿ',
  'Any blood group': 'ಯಾವುದೇ ರಕ್ತದ ಗುಂಪು',
  'Area': 'ಪ್ರದೇಶ',
  'Include compatible donor blood groups': 'ಹೊಂದಾಣಿಕೆಯಾಗಬಹುದಾದ ದಾನಿಗಳ ರಕ್ತದ ಗುಂಪುಗಳನ್ನೂ ಸೇರಿಸಿ',
  'Search availability': 'ಲಭ್ಯತೆಯನ್ನು ಹುಡುಕಿ',
  'Clear filters': 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
  'Potential donors': 'ಸಂಭಾವ್ಯ ದಾನಿಗಳು',
  'Blood banks': 'ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳು',
  'Search results are not a guarantee of availability or medical compatibility. Confirm stock and eligibility with the blood bank or healthcare professional.': 'ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು ಲಭ್ಯತೆ ಅಥವಾ ವೈದ್ಯಕೀಯ ಹೊಂದಾಣಿಕೆಯ ಖಾತರಿಯಲ್ಲ. ಸ್ಟಾಕ್ ಮತ್ತು ಅರ್ಹತೆಯನ್ನು ರಕ್ತ ಬ್ಯಾಂಕ್ ಅಥವಾ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.',
  'Your updates': 'ನಿಮ್ಮ ನವೀಕರಣಗಳು',
  'Mark all as read': 'ಎಲ್ಲವನ್ನೂ ಓದಿದಂತೆ ಗುರುತಿಸಿ',
  'Donor workspace': 'ದಾನಿ ಕಾರ್ಯಸ್ಥಳ',
  'Keep your profile and availability up to date.': 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಲಭ್ಯತೆಯನ್ನು ನವೀಕೃತವಾಗಿಡಿ.',
  'Your availability': 'ನಿಮ್ಮ ಲಭ್ಯತೆ',
  'Current status:': 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ:',
  'Availability status': 'ಲಭ್ಯತೆಯ ಸ್ಥಿತಿ',
  'Available': 'ಲಭ್ಯವಿದೆ',
  'Contact me first': 'ಮೊದಲು ನನ್ನನ್ನು ಸಂಪರ್ಕಿಸಿ',
  'Unavailable': 'ಲಭ್ಯವಿಲ್ಲ',
  'Update availability': 'ಲಭ್ಯತೆಯನ್ನು ನವೀಕರಿಸಿ',
  'Confirm current status': 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯನ್ನು ದೃಢೀಕರಿಸಿ',
  'Donor profile': 'ದಾನಿ ಪ್ರೊಫೈಲ್',
  'Last donation date (optional)': 'ಕೊನೆಯ ದಾನದ ದಿನಾಂಕ (ಐಚ್ಛಿಕ)',
  'Save profile': 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
  'When you record a donation date, an in-app follow-up reminder appears after 90 days. This is informational only and does not determine whether it is safe for you to donate; ask a licensed blood bank or healthcare professional about your eligibility.': 'ನೀವು ದಾನದ ದಿನಾಂಕ ದಾಖಲಿಸಿದಾಗ, 90 ದಿನಗಳ ನಂತರ ಆಪ್‌ನಲ್ಲೇ ಜ್ಞಾಪನೆ ಕಾಣಿಸುತ್ತದೆ. ಇದು ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ; ದಾನ ಮಾಡುವುದು ಸುರಕ್ಷಿತವೇ ಎಂದು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ. ಅರ್ಹತೆಯ ಬಗ್ಗೆ ಪರವಾನಗಿ ಪಡೆದ ರಕ್ತ ಬ್ಯಾಂಕ್ ಅಥವಾ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಕೇಳಿ.',
  'Relevant blood requests': 'ಸಂಬಂಧಿತ ರಕ್ತ ವಿನಂತಿಗಳು',
  'Open requests matching your blood group, as returned by the backend.': 'ಬ್ಯಾಕೆಂಡ್ ತೋರಿಸುವ ನಿಮ್ಮ ರಕ್ತದ ಗುಂಪಿಗೆ ಹೊಂದುವ ಮುಕ್ತ ವಿನಂತಿಗಳು.',
  'Donation response history': 'ದಾನ ಪ್ರತಿಕ್ರಿಯೆ ಇತಿಹಾಸ',
  'Requester workspace': 'ವಿನಂತಿದಾರರ ಕಾರ್ಯಸ್ಥಳ',
  'Create a request and track updates from your dashboard.': 'ವಿನಂತಿ ರಚಿಸಿ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನವೀಕರಣಗಳನ್ನು ಅನುಸರಿಸಿ.',
  'Request blood': 'ರಕ್ತವನ್ನು ವಿನಂತಿಸಿ',
  'Blood requests are visible to eligible matching donors and blood banks in your city. Required fields follow the backend request contract.': 'ನಿಮ್ಮ ನಗರದ ಅರ್ಹ ಹೊಂದಾಣಿಕೆಯ ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳಿಗೆ ವಿನಂತಿಗಳು ಕಾಣಿಸುತ್ತವೆ. ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳು ಬ್ಯಾಕೆಂಡ್ ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುತ್ತವೆ.',
  'Patient name (optional)': 'ರೋಗಿಯ ಹೆಸರು (ಐಚ್ಛಿಕ)',
  'Units needed': 'ಅಗತ್ಯವಿರುವ ಘಟಕಗಳು',
  'Urgency': 'ತುರ್ತು ಮಟ್ಟ',
  'Required date': 'ಅಗತ್ಯವಿರುವ ದಿನಾಂಕ',
  'Hospital name (optional)': 'ಆಸ್ಪತ್ರೆಯ ಹೆಸರು (ಐಚ್ಛಿಕ)',
  'Contact phone (optional)': 'ಸಂಪರ್ಕ ದೂರವಾಣಿ (ಐಚ್ಛಿಕ)',
  'Additional notes (optional)': 'ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)',
  'Submit blood request': 'ರಕ್ತದ ವಿನಂತಿ ಸಲ್ಲಿಸಿ',
  'My requests': 'ನನ್ನ ವಿನಂತಿಗಳು',
  'Search donors and blood banks': 'ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳನ್ನು ಹುಡುಕಿ',
  '90-day donation follow-up': '90 ದಿನಗಳ ದಾನ ಅನುಸರಣೆ',
  'No matching donors found': 'ಹೊಂದಾಣಿಕೆಯ ದಾನಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
  'Only verified donors appear in search. If your donor account is missing, ask an administrator to verify it. Also check the blood group and location.': 'ಹುಡುಕಾಟದಲ್ಲಿ ಪರಿಶೀಲಿತ ದಾನಿಗಳು ಮಾತ್ರ ಕಾಣಿಸುತ್ತಾರೆ. ನಿಮ್ಮ ದಾನಿ ಖಾತೆ ಕಾಣದಿದ್ದರೆ, ಅದನ್ನು ಪರಿಶೀಲಿಸಲು ನಿರ್ವಾಹಕರನ್ನು ಕೇಳಿ. ರಕ್ತದ ಗುಂಪು ಮತ್ತು ಸ್ಥಳವನ್ನೂ ಪರಿಶೀಲಿಸಿ.',
  'Nearby verified donors': 'ಹತ್ತಿರದ ಪರಿಶೀಲಿತ ದಾನಿಗಳು',
  'All verified donors in this city are shown, with matching area and PIN code first. Contact details remain masked.': 'ಈ ನಗರದ ಪರಿಶೀಲಿತ ದಾನಿಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ; ಹೊಂದುವ ಪ್ರದೇಶ ಮತ್ತು ಪಿನ್ ಕೋಡ್‌ಗೆ ಮೊದಲ ಆದ್ಯತೆ. ಸಂಪರ್ಕ ವಿವರಗಳು ಮರೆಮಾಡಲ್ಪಡುತ್ತವೆ.',
  'Searching verified donors in this city…': 'ಈ ನಗರದ ಪರಿಶೀಲಿತ ದಾನಿಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ…',
  'No matching blood banks found': 'ಹೊಂದಾಣಿಕೆಯ ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
  'Try another location or blood group.': 'ಬೇರೆ ಸ್ಥಳ ಅಥವಾ ರಕ್ತದ ಗುಂಪು ಪ್ರಯತ್ನಿಸಿ.',
  'No matching requests right now': 'ಈಗ ಹೊಂದಾಣಿಕೆಯ ವಿನಂತಿಗಳಿಲ್ಲ',
  'No responses yet': 'ಇನ್ನೂ ಪ್ರತಿಕ್ರಿಯೆಗಳಿಲ್ಲ',
  'You are all caught up': 'ನೀವು ಎಲ್ಲ ನವೀಕರಣಗಳನ್ನು ಓದಿದ್ದೀರಿ',
  'New updates for your account will appear here.': 'ನಿಮ್ಮ ಖಾತೆಯ ಹೊಸ ನವೀಕರಣಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
  'Mark as read': 'ಓದಿದಂತೆ ಗುರುತಿಸಿ',
  'Read': 'ಓದಲಾಗಿದೆ',
  'Unread': 'ಓದಲಾಗಿಲ್ಲ',
  'Verification pending': 'ಪರಿಶೀಲನೆ ಬಾಕಿಯಿದೆ',
  'Verified donor': 'ಪರಿಶೀಲಿತ ದಾನಿ',
  'Verified blood bank': 'ಪರಿಶೀಲಿತ ರಕ್ತ ಬ್ಯಾಂಕ್',
  'Loading verification…': 'ಪರಿಶೀಲನೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
  'Log in': 'ಲಾಗಿನ್',
  'Notifications': 'ಅಧಿಸೂಚನೆಗಳು',
  'Create account': 'ಖಾತೆ ರಚಿಸಿ',
  'Blood group': 'ರಕ್ತದ ಗುಂಪು',
  'Donate Blood': 'ರಕ್ತದಾನ ಮಾಡಿ',
  'Request Blood': 'ರಕ್ತವನ್ನು ವಿನಂತಿಸಿ',
  'Register as a donor and manage your availability.': 'ದಾನಿಯಾಗಿ ನೋಂದಾಯಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಲಭ್ಯತೆಯನ್ನು ನಿರ್ವಹಿಸಿ.',
  'Create and track blood requests.': 'ರಕ್ತದ ವಿನಂತಿಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ಅನುಸರಿಸಿ.',
  'Register your bank to manage reported stock and requests.': 'ವರದಿಯಾದ ಸ್ಟಾಕ್ ಮತ್ತು ವಿನಂತಿಗಳನ್ನು ನಿರ್ವಹಿಸಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ನೋಂದಾಯಿಸಿ.',
  'Admin accounts are created by the backend administrator.': 'ನಿರ್ವಾಹಕ ಖಾತೆಗಳನ್ನು ಬ್ಯಾಕೆಂಡ್ ನಿರ್ವಾಹಕರು ರಚಿಸುತ್ತಾರೆ.',
  '← Choose a different account type': '← ಬೇರೆ ಖಾತೆ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ',
  'hello@dropofhope.org': 'hello@dropofhope.org',
  '+91 98765 43210': '+91 98765 43210',
  'Monday to Saturday, 9:00 AM to 6:00 PM': 'ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ, ಬೆಳಿಗ್ಗೆ 9ರಿಂದ ಸಂಜೆ 6ರವರೆಗೆ',
  'Welcome,': 'ಸ್ವಾಗತ,',
  'Loading…': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
  'patient': 'ರೋಗಿ',
  'blood_bank': 'ರಕ್ತ ಬ್ಯಾಂಕ್',
  'admin': 'ನಿರ್ವಾಹಕ',
  'Blood requests are visible to eligible matching donors and blood banks in your city. Required fields follow the backend request contract.': 'ನಿಮ್ಮ ನಗರದ ಅರ್ಹ ಹೊಂದಾಣಿಕೆಯ ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳಿಗೆ ವಿನಂತಿಗಳು ಕಾಣಿಸುತ್ತವೆ. ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳು ಬ್ಯಾಕೆಂಡ್ ವಿನಂತಿ ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುತ್ತವೆ.',
  'Requests are visible to eligible matching donors and blood banks in your city. Required fields follow the backend request contract.': 'ನಿಮ್ಮ ನಗರದ ಅರ್ಹ ಹೊಂದಾಣಿಕೆಯ ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳಿಗೆ ವಿನಂತಿಗಳು ಕಾಣಿಸುತ್ತವೆ. ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳು ಬ್ಯಾಕೆಂಡ್ ವಿನಂತಿ ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುತ್ತವೆ.',
  'Requests are visible to eligible matching donors and blood banks in your city. After submission, verified same-city donors are listed in the request details, with matching area and PIN code first; contact details stay masked.': 'ನಿಮ್ಮ ನಗರದ ಅರ್ಹ ಹೊಂದಾಣಿಕೆಯ ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳಿಗೆ ವಿನಂತಿಗಳು ಕಾಣಿಸುತ್ತವೆ. ಸಲ್ಲಿಸಿದ ನಂತರ, ಅದೇ ನಗರದ ಪರಿಶೀಲಿತ ದಾನಿಗಳನ್ನು ವಿನಂತಿ ವಿವರಗಳಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ; ಹೊಂದುವ ಪ್ರದೇಶ ಮತ್ತು ಪಿನ್ ಕೋಡ್‌ಗೆ ಮೊದಲ ಆದ್ಯತೆ, ಸಂಪರ್ಕ ವಿವರಗಳು ಮರೆಮಾಡಲ್ಪಡುತ್ತವೆ.',
  'Open requests matching your blood group and city. Requester name, notes and phone are shown only after you accept.': 'ನಿಮ್ಮ ರಕ್ತದ ಗುಂಪು ಮತ್ತು ನಗರಕ್ಕೆ ಹೊಂದುವ ಮುಕ್ತ ವಿನಂತಿಗಳು. ನೀವು ಸ್ವೀಕರಿಸಿದ ನಂತರ ಮಾತ್ರ ವಿನಂತಿದಾರರ ಹೆಸರು, ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ದೂರವಾಣಿ ತೋರಿಸಲಾಗುತ್ತದೆ.',
  'Create your account': 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ',
  'Find blood | Drop of Hope': 'ರಕ್ತ ಹುಡುಕಿ | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Log in | Drop of Hope': 'ಲಾಗಿನ್ | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Create an account | Drop of Hope': 'ಖಾತೆ ರಚಿಸಿ | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Notifications | Drop of Hope': 'ಅಧಿಸೂಚನೆಗಳು | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Donor dashboard | Drop of Hope': 'ದಾನಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Requester dashboard | Drop of Hope': 'ವಿನಂತಿದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Blood bank dashboard | Drop of Hope': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Admin dashboard | Drop of Hope': 'ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ | ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್',
  'Hours:': 'ಸಮಯ:',
  'Email:': 'ಇಮೇಲ್:',
  'Phone:': 'ದೂರವಾಣಿ:',
  'Blood requester / patient': 'ರಕ್ತ ವಿನಂತಿದಾರ / ರೋಗಿ',
  'It has been 90 days since the donation date recorded in your profile. This is a reminder to ask a licensed blood bank or healthcare professional whether you are eligible. It is not medical clearance; timing depends on donation type, local guidance, and your health.': 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ದಾಖಲಿಸಿದ ದಾನದ ದಿನಾಂಕದಿಂದ 90 ದಿನಗಳು ಕಳೆದಿವೆ. ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರವಾನಗಿ ಪಡೆದ ರಕ್ತ ಬ್ಯಾಂಕ್ ಅಥವಾ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಕೇಳಲು ಇದು ಜ್ಞಾಪನೆ. ಇದು ವೈದ್ಯಕೀಯ ಅನುಮತಿಯಲ್ಲ; ಅವಧಿ ದಾನದ ಪ್ರಕಾರ, ಸ್ಥಳೀಯ ಮಾರ್ಗಸೂಚಿ ಮತ್ತು ನಿಮ್ಮ ಆರೋಗ್ಯದ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ.',
  'Donor may be within the usual gap between donations. Final eligibility must be confirmed by the blood bank or doctor.': 'ದಾನಿಗಳ ದಾನಗಳ ನಡುವಿನ ಸಾಮಾನ್ಯ ಅವಧಿ ಇನ್ನೂ ಪೂರ್ಣವಾಗಿರದಿರಬಹುದು. ಅಂತಿಮ ಅರ್ಹತೆಯನ್ನು ರಕ್ತ ಬ್ಯಾಂಕ್ ಅಥವಾ ವೈದ್ಯರೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.',
  'Drop of Hope | Blood donation and emergency availability': 'ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್ | ರಕ್ತದಾನ ಮತ್ತು ತುರ್ತು ಲಭ್ಯತೆ',
  'Blood bank workspace': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ಕಾರ್ಯಸ್ಥಳ',
  'Update your profile and reported stock.': 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ವರದಿಯಾದ ಸ್ಟಾಕ್ ಅನ್ನು ನವೀಕರಿಸಿ.',
  'The backend does not currently support editing the registered address or license number.': 'ನೋಂದಾಯಿತ ವಿಳಾಸ ಅಥವಾ ಪರವಾನಗಿ ಸಂಖ್ಯೆಯನ್ನು ಸಂಪಾದಿಸಲು ಬ್ಯಾಕೆಂಡ್‌ನಲ್ಲಿ ಪ್ರಸ್ತುತ ಬೆಂಬಲವಿಲ್ಲ.',
  'Blood group inventory': 'ರಕ್ತದ ಗುಂಪಿನ ಸ್ಟಾಕ್',
  'Update units using the backend stock API. Reported stock should be confirmed regularly.': 'ಬ್ಯಾಕೆಂಡ್ ಸ್ಟಾಕ್ API ಮೂಲಕ ಘಟಕಗಳನ್ನು ನವೀಕರಿಸಿ. ವರದಿಯಾದ ಸ್ಟಾಕ್ ಅನ್ನು ನಿಯಮಿತವಾಗಿ ದೃಢೀಕರಿಸಿ.',
  'The backend provides a read-only blood-bank requests endpoint. It does not provide a blood-bank action to update request status.': 'ಬ್ಯಾಕೆಂಡ್ ರಕ್ತ ಬ್ಯಾಂಕ್ ವಿನಂತಿಗಳನ್ನು ಓದಲು ಮಾತ್ರ ಒದಗಿಸುತ್ತದೆ. ವಿನಂತಿಯ ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸುವ ಕ್ರಮವನ್ನು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗೆ ಒದಗಿಸುವುದಿಲ್ಲ.',
  'Administration': 'ಆಡಳಿತ',
  'Review system information and manage existing users, requests and reports.': 'ವ್ಯವಸ್ಥೆಯ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಬಳಕೆದಾರರು, ವಿನಂತಿಗಳು ಹಾಗೂ ವರದಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
  'Verification and account activation controls use the admin API.': 'ಪರಿಶೀಲನೆ ಮತ್ತು ಖಾತೆ ಸಕ್ರಿಯಗೊಳಿಸುವ ನಿಯಂತ್ರಣಗಳು ನಿರ್ವಾಹಕ API ಬಳಸುತ್ತವೆ.',
  'All': 'ಎಲ್ಲಾ',
  'Any': 'ಯಾವುದೇ',
  'Response received': 'ಪ್ರತಿಕ್ರಿಯೆ ಬಂದಿದೆ',
  'Dismissed': 'ವಜಾಗೊಳಿಸಲಾಗಿದೆ',
  'Blood requests are visible to eligible matching donors and blood banks in your city. Required fields follow the backend request contract.': 'ನಿಮ್ಮ ನಗರದ ಅರ್ಹ ಹೊಂದಾಣಿಕೆಯ ದಾನಿಗಳು ಮತ್ತು ರಕ್ತ ಬ್ಯಾಂಕ್‌ಗಳಿಗೆ ವಿನಂತಿಗಳು ಕಾಣಿಸುತ್ತವೆ. ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳು ಬ್ಯಾಕೆಂಡ್ ವಿನಂತಿ ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸುತ್ತವೆ.',
  'Normal': 'ಸಾಮಾನ್ಯ',
  'Urgent': 'ತುರ್ತು',
  'Critical': 'ಅತ್ಯಂತ ತುರ್ತು',
  'donor': 'ದಾನಿ',
  'requester': 'ವಿನಂತಿದಾರ',
  'No stock update recorded': 'ಸ್ಟಾಕ್ ನವೀಕರಣ ದಾಖಲಾಗಿಲ್ಲ',
  'Blood group inventory': 'ರಕ್ತದ ಗುಂಪಿನ ಸ್ಟಾಕ್',
  'Urgency': 'ತುರ್ತು ಮಟ್ಟ',
  'This request is closed.': 'ಈ ವಿನಂತಿ ಮುಚ್ಚಲಾಗಿದೆ.',
  'No responses yet': 'ಇನ್ನೂ ಪ್ರತಿಕ್ರಿಯೆಗಳಿಲ್ಲ',
  'All notifications marked as read.': 'ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳನ್ನು ಓದಿದಂತೆ ಗುರುತಿಸಲಾಗಿದೆ.',
  'Notification marked as read.': 'ಅಧಿಸೂಚನೆಯನ್ನು ಓದಿದಂತೆ ಗುರುತಿಸಲಾಗಿದೆ.',
  'Your response was recorded.': 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ದಾಖಲಿಸಲಾಗಿದೆ.',
  'Profile updated.': 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ.',
  'Donation date saved. An in-app reminder will appear after 90 days; this is not medical clearance. Confirm eligibility with a healthcare professional.': 'ದಾನದ ದಿನಾಂಕ ಉಳಿಸಲಾಗಿದೆ. 90 ದಿನಗಳ ನಂತರ ಆಪ್‌ನಲ್ಲಿ ಜ್ಞಾಪನೆ ಕಾಣಿಸುತ್ತದೆ; ಇದು ವೈದ್ಯಕೀಯ ಅನುಮತಿಯಲ್ಲ. ಅರ್ಹತೆಯನ್ನು ಆರೋಗ್ಯ ವೃತ್ತಿಪರರೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.',
  'Availability updated.': 'ಲಭ್ಯತೆ ನವೀಕರಿಸಲಾಗಿದೆ.',
  'Availability confirmed.': 'ಲಭ್ಯತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ.',
  'Search availability': 'ಲಭ್ಯತೆಯನ್ನು ಹುಡುಕಿ',
  'Some results could not be loaded:': 'ಕೆಲವು ಫಲಿತಾಂಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ:',
  'Totals are based on verified blood-bank inventory returned by the backend.': 'ಒಟ್ಟುಗಳು ಬ್ಯಾಕೆಂಡ್‌ನಿಂದ ಬಂದ ಪರಿಶೀಲಿತ ರಕ್ತ ಬ್ಯಾಂಕ್ ಸ್ಟಾಕ್ ಆಧಾರಿತವಾಗಿವೆ.',
  'Live availability could not be loaded.': 'ನೇರ ಲಭ್ಯತೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.',
  'Account created successfully.': 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ.',
  'Donor registered successfully.': 'ದಾನಿ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ.',
  'Patient registered successfully.': 'ರೋಗಿಯ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ.',
  'Blood bank registered successfully.': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ.',
  'An administrator must verify this account before it appears in public search.': 'ಸಾರ್ವಜನಿಕ ಹುಡುಕಾಟದಲ್ಲಿ ಕಾಣುವ ಮೊದಲು ನಿರ್ವಾಹಕರು ಈ ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಬೇಕು.',
  'You can now log in.': 'ಈಗ ನೀವು ಲಾಗಿನ್ ಮಾಡಬಹುದು.',
  'Unable to create the account. Check the form and try again.': 'ಖಾತೆ ರಚಿಸಲಾಗಲಿಲ್ಲ. ಫಾರ್ಮ್ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  'The request could not be completed.': 'ವಿನಂತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲಾಗಲಿಲ್ಲ.',
  'Cannot reach the server. Check that the backend is running.': 'ಸರ್ವರ್ ಸಂಪರ್ಕವಾಗುತ್ತಿಲ್ಲ. ಬ್ಯಾಕೆಂಡ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಪರಿಶೀಲಿಸಿ.',
  'The server could not complete this request.': 'ಸರ್ವರ್ ಈ ವಿನಂತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲಾಗಲಿಲ್ಲ.',
  'Accepted': 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
  'Declined': 'ನಿರಾಕರಿಸಲಾಗಿದೆ',
  'not recorded': 'ದಾಖಲಾಗಿಲ್ಲ',
  'Requests': 'ವಿನಂತಿಗಳು',
  'Target type': 'ಗುರಿ ಪ್ರಕಾರ',
  'Target ID': 'ಗುರಿ ಐಡಿ',
  'Reason': 'ಕಾರಣ',
  'Update': 'ನವೀಕರಿಸಿ',
  'Flagged': 'ಗುರುತಿಸಲಾಗಿದೆ',
  'Blood group': 'ರಕ್ತದ ಗುಂಪು',
  'Donor': 'ದಾನಿ',
  'Requester': 'ವಿನಂತಿದಾರ',
  'Profile updated. An administrator must verify this account before it appears in public search.': 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ. ಸಾರ್ವಜನಿಕ ಹುಡುಕಾಟದಲ್ಲಿ ಕಾಣುವ ಮೊದಲು ನಿರ್ವಾಹಕರು ಈ ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಬೇಕು.',
  'Blood bank profile updated.': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ.',
  'Inventory updated.': 'ಸ್ಟಾಕ್ ನವೀಕರಿಸಲಾಗಿದೆ.',
  'Stock confirmation recorded.': 'ಸ್ಟಾಕ್ ದೃಢೀಕರಣ ದಾಖಲಿಸಲಾಗಿದೆ.',
  'Could not load the blood-bank dashboard.': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.',
  'Could not load notifications.': 'ಅಧಿಸೂಚನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.',
  'Could not load the donor dashboard.': 'ದಾನಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.',
  'Could not load the requester dashboard.': 'ವಿನಂತಿದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.',
  'No open requests in your city': 'ನಿಮ್ಮ ನಗರದಲ್ಲಿ ಮುಕ್ತ ವಿನಂತಿಗಳಿಲ್ಲ',
  'New matching city requests will appear here when available.': 'ಹೊಸ ಹೊಂದಾಣಿಕೆಯ ನಗರ ವಿನಂತಿಗಳು ಲಭ್ಯವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
  'Requests are shown here when they match your blood group.': 'ನಿಮ್ಮ ರಕ್ತದ ಗುಂಪಿಗೆ ಹೊಂದಿದ ವಿನಂತಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
  'No responses yet': 'ಇನ್ನೂ ಪ್ರತಿಕ್ರಿಯೆಗಳಿಲ್ಲ',
  'You already responded:': 'ನೀವು ಈಗಾಗಲೇ ಪ್ರತಿಕ್ರಿಯಿಸಿದ್ದೀರಿ:',
  'This request is closed.': 'ಈ ವಿನಂತಿ ಮುಚ್ಚಲಾಗಿದೆ.',
  'Your response was recorded.': 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ದಾಖಲಿಸಲಾಗಿದೆ.',
  'Donation confirmed.': 'ದಾನ ದೃಢೀಕರಿಸಲಾಗಿದೆ.',
  'Results show reported availability; confirm directly.': 'ಫಲಿತಾಂಶಗಳು ವರದಿಯಾದ ಲಭ್ಯತೆಯನ್ನು ತೋರಿಸುತ್ತವೆ; ನೇರವಾಗಿ ದೃಢೀಕರಿಸಿ.',
  'Drop of Hope — A clear path from urgent need to a human connection.': 'ಡ್ರಾಪ್ ಆಫ್ ಹೋಪ್ — ತುರ್ತು ಅಗತ್ಯದಿಂದ ಮಾನವೀಯ ಸಂಪರ್ಕದವರೆಗೆ ಸ್ಪಷ್ಟ ದಾರಿ.',
  'Text size': 'ಅಕ್ಷರದ ಗಾತ್ರ',
  'Text size: Decrease': 'ಅಕ್ಷರದ ಗಾತ್ರ: ಕಡಿಮೆ ಮಾಡಿ',
  'Text size: Reset': 'ಅಕ್ಷರದ ಗಾತ್ರ: ಮರುಹೊಂದಿಸಿ',
  'Text size: Increase': 'ಅಕ್ಷರದ ಗಾತ್ರ: ಹೆಚ್ಚಿಸಿ',
  'Main navigation': 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್',
  'Log out': 'ಲಾಗ್ ಔಟ್',
  'Skip to content': 'ವಿಷಯಕ್ಕೆ ತೆರಳಿ',
  'Some results could not be loaded:': 'ಕೆಲವು ಫಲಿತಾಂಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ:',
  'No matching donors found': 'ಹೊಂದಾಣಿಕೆಯ ದಾನಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
  'Only verified donors appear in search. If your donor account is missing, ask an administrator to verify it. Also check the blood group and location.': 'ಹುಡುಕಾಟದಲ್ಲಿ ಪರಿಶೀಲಿತ ದಾನಿಗಳು ಮಾತ್ರ ಕಾಣಿಸುತ್ತಾರೆ. ನಿಮ್ಮ ದಾನಿ ಖಾತೆ ಕಾಣದಿದ್ದರೆ, ಅದನ್ನು ಪರಿಶೀಲಿಸಲು ನಿರ್ವಾಹಕರನ್ನು ಕೇಳಿ. ರಕ್ತದ ಗುಂಪು ಮತ್ತು ಸ್ಥಳವನ್ನೂ ಪರಿಶೀಲಿಸಿ.',
  'Sign in to view contact details when the backend permits.': 'ಬ್ಯಾಕೆಂಡ್ ಅನುಮತಿಸಿದಾಗ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ನೋಡಲು ಲಾಗಿನ್ ಮಾಡಿ.',
  'Verified': 'ಪರಿಶೀಲಿತ',
  'Unverified': 'ಪರಿಶೀಲಿಸದ',
  'Needs confirmation': 'ದೃಢೀಕರಣ ಅಗತ್ಯ',
  'Current': 'ಪ್ರಸ್ತುತ',
  'No open requests in your city': 'ನಿಮ್ಮ ನಗರದಲ್ಲಿ ಮುಕ್ತ ವಿನಂತಿಗಳಿಲ್ಲ',
  'New matching city requests will appear here when available.': 'ಹೊಸ ಹೊಂದಾಣಿಕೆಯ ನಗರ ವಿನಂತಿಗಳು ಲಭ್ಯವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
  'No requests yet': 'ಇನ್ನೂ ಯಾವುದೇ ವಿನಂತಿಗಳಿಲ್ಲ',
  'Your blood requests will appear here after you submit one.': 'ನೀವು ಸಲ್ಲಿಸಿದ ನಂತರ ನಿಮ್ಮ ರಕ್ತದ ವಿನಂತಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
  'No donor responses yet.': 'ದಾನಿಗಳ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಇನ್ನೂ ಬಂದಿಲ್ಲ.',
  'Close details': 'ವಿವರಗಳನ್ನು ಮುಚ್ಚಿ',
  'Donor responses': 'ದಾನಿಗಳ ಪ್ರತಿಕ್ರಿಯೆಗಳು',
  'Status history': 'ಸ್ಥಿತಿ ಇತಿಹಾಸ',
  'Confirm donation': 'ದಾನವನ್ನು ದೃಢೀಕರಿಸಿ',
  'View details and responses': 'ವಿವರಗಳು ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ನೋಡಿ',
  'Mark resolved': 'ಪರಿಹರಿಸಿದಂತೆ ಗುರುತಿಸಿ',
  'Cancel request': 'ವಿನಂತಿಯನ್ನು ರದ್ದುಮಾಡಿ',
  'Loading request details…': 'ವಿನಂತಿಯ ವಿವರಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ…',
  'Blood bank profile': 'ರಕ್ತ ಬ್ಯಾಂಕ್ ಪ್ರೊಫೈಲ್',
  'Bank name': 'ಬ್ಯಾಂಕ್ ಹೆಸರು',
  'Account phone': 'ಖಾತೆಯ ದೂರವಾಣಿ',
  'Contact phone': 'ಸಂಪರ್ಕ ದೂರವಾಣಿ',
  'Opening hours': 'ತೆರೆಯುವ ಸಮಯ',
  'Address (read-only)': 'ವಿಳಾಸ (ಓದಲು ಮಾತ್ರ)',
  'License number': 'ಪರವಾನಗಿ ಸಂಖ್ಯೆ',
  'Save inventory': 'ಸ್ಟಾಕ್ ಉಳಿಸಿ',
  'Confirm current stock': 'ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್ ದೃಢೀಕರಿಸಿ',
  'Incoming requests in your city': 'ನಿಮ್ಮ ನಗರದ ಒಳಬರುವ ವಿನಂತಿಗಳು',
  'Portal overview': 'ಪೋರ್ಟಲ್ ಅವಲೋಕನ',
  'Review system information and manage existing users, requests and reports.': 'ವ್ಯವಸ್ಥೆಯ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಬಳಕೆದಾರರು, ವಿನಂತಿಗಳು ಹಾಗೂ ವರದಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
  'Overview': 'ಅವಲೋಕನ',
  'Manage users': 'ಬಳಕೆದಾರರನ್ನು ನಿರ್ವಹಿಸಿ',
  'Monitor blood requests': 'ರಕ್ತದ ವಿನಂತಿಗಳನ್ನು ಗಮನಿಸಿ',
  'Review reports': 'ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
  'All roles': 'ಎಲ್ಲಾ ಪಾತ್ರಗಳು',
  'Name contains': 'ಹೆಸರಿನಲ್ಲಿ ಇರುವ ಪದ',
  'Verification': 'ಪರಿಶೀಲನೆ',
  'Pending': 'ಬಾಕಿಯಿದೆ',
  'Filter users': 'ಬಳಕೆದಾರರನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ',
  'All statuses': 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು',
  'Report status': 'ವರದಿಯ ಸ್ಥಿತಿ',
  'Actions': 'ಕ್ರಿಯೆಗಳು',
  'Email': 'ಇಮೇಲ್',
  'Role': 'ಪಾತ್ರ',
  'Account': 'ಖಾತೆ',
  'Active': 'ಸಕ್ರಿಯ',
  'Inactive': 'ನಿಷ್ಕ್ರಿಯ',
  'Verify': 'ಪರಿಶೀಲಿಸಿ',
  'Revoke verification': 'ಪರಿಶೀಲನೆಯನ್ನು ಹಿಂತೆಗೆದುಕೊಳ್ಳಿ',
  'Deactivate': 'ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ',
  'Reactivate': 'ಮತ್ತೆ ಸಕ್ರಿಯಗೊಳಿಸಿ',
  'Open': 'ತೆರೆದಿದೆ',
  'Resolved': 'ಪರಿಹರಿಸಲಾಗಿದೆ',
  'Cancelled': 'ರದ್ದಾಗಿದೆ',
  'Dismissed': 'ವಜಾಗೊಳಿಸಲಾಗಿದೆ',
  'Save': 'ಉಳಿಸಿ',
  'No users match these filters.': 'ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದುವ ಬಳಕೆದಾರರಿಲ್ಲ.',
  'No blood requests match this filter.': 'ಈ ಫಿಲ್ಟರ್‌ಗೆ ಹೊಂದುವ ರಕ್ತದ ವಿನಂತಿಗಳಿಲ್ಲ.',
  'No reports match this filter.': 'ಈ ಫಿಲ್ಟರ್‌ಗೆ ಹೊಂದುವ ವರದಿಗಳಿಲ್ಲ.',
  'Requests by status': 'ಸ್ಥಿತಿಯ ಪ್ರಕಾರ ವಿನಂತಿಗಳು',
  'Requests by blood group': 'ರಕ್ತದ ಗುಂಪಿನ ಪ್ರಕಾರ ವಿನಂತಿಗಳು',
  'Donors': 'ದಾನಿಗಳು',
  'Patients': 'ರೋಗಿಗಳು',
  'Open reports': 'ಮುಕ್ತ ವರದಿಗಳು',
  'Pending verification': 'ಪರಿಶೀಲನೆ ಬಾಕಿಯಿದೆ',
  'ID': 'ಐಡಿ',
  'Status': 'ಸ್ಥಿತಿ',
  'Actions': 'ಕ್ರಿಯೆಗಳು',
});

const originalText = new WeakMap();
const originalAttributes = new WeakMap();
const originalTitle = document.title;
let activeLanguage = LANGUAGES.includes(localStorage.getItem(STORAGE_KEYS.language))
  ? localStorage.getItem(STORAGE_KEYS.language)
  : 'en';

function localizeTextNode(node) {
  if (!originalText.has(node)) {
    originalText.set(node, node.nodeValue);
  }
  const source = originalText.get(node);
  const trimmed = source.trim();
  const translation = activeLanguage === 'kn' ? translateText(trimmed) : null;
  if (!translation) {
    node.nodeValue = source;
    return;
  }
  const leading = source.match(/^\s*/)[0];
  const trailing = source.match(/\s*$/)[0];
  node.nodeValue = `${leading}${translation}${trailing}`;
}

function translateText(source) {
  const exact = kannadaText[source];
  if (exact) {
    return exact;
  }
  const reminder = source.match(/^90-day donation follow-up \((\d{4}-\d{2}-\d{2})\)$/);
  if (reminder) {
    return `ದಾನದ 90 ದಿನಗಳ ಅನುಸರಣೆ (${reminder[1]})`;
  }
  const reportedUnits = source.match(/^(\d+) reported units$/);
  if (reportedUnits) {
    return `${reportedUnits[1]} ವರದಿಯಾದ ಘಟಕಗಳು`;
  }
  const contacts = source.match(/^Contact: (.+)$/);
  if (contacts) {
    return `ಸಂಪರ್ಕ: ${contacts[1]}`;
  }
  const requestSummary = source.match(/^([A-Z]{1,2}[+-]) request · (\d+) unit\(s\)$/);
  if (requestSummary) {
    return `${requestSummary[1]} ವಿನಂತಿ · ${requestSummary[2]} ಘಟಕಗಳು`;
  }
  const patientName = source.match(/^Patient name: (.+)$/);
  if (patientName) {
    return `ರೋಗಿಯ ಹೆಸರು: ${patientName[1]}`;
  }
  const requiredBy = source.match(/^Required by: (.+)$/);
  if (requiredBy) {
    return `ಅಗತ್ಯ ದಿನಾಂಕ: ${requiredBy[1]}`;
  }
  const notes = source.match(/^Notes: (.+)$/);
  if (notes) {
    return `ಟಿಪ್ಪಣಿಗಳು: ${notes[1]}`;
  }
  const searchResults = source.match(/^(\d+) donor listings and (\d+) blood-bank listings returned\. Confirm availability directly\.$/);
  if (searchResults) {
    return `${searchResults[1]} ದಾನಿ ಪಟ್ಟಿಗಳು ಮತ್ತು ${searchResults[2]} ರಕ್ತ ಬ್ಯಾಂಕ್ ಪಟ್ಟಿಗಳು ಲಭ್ಯ. ಲಭ್ಯತೆಯನ್ನು ನೇರವಾಗಿ ದೃಢೀಕರಿಸಿ.`;
  }
  const summary = source.match(/^(\d+) recorded donations? · Last donation: (.+)$/);
  if (summary) {
    return `${summary[1]} ದಾನಗಳು ದಾಖಲಾಗಿವೆ · ಕೊನೆಯ ದಾನ: ${translateText(summary[2]) || summary[2]}`;
  }
  const urgency = source.match(/^Urgency: (.+) · Status: (.+)$/);
  if (urgency) {
    return `ತುರ್ತು ಮಟ್ಟ: ${translateText(urgency[1]) || urgency[1]} · ಸ್ಥಿತಿ: ${translateText(urgency[2]) || urgency[2]}`;
  }
  const request = source.match(/^Request #(\d+): (Accepted|Declined)$/);
  if (request) {
    return `ವಿನಂತಿ #${request[1]}: ${translateText(request[2])}`;
  }
  const stock = source.match(/^Your reported stock: (.+) units$/);
  if (stock) {
    return `ನಿಮ್ಮ ವರದಿಯಾದ ಸ್ಟಾಕ್: ${stock[1]} ಘಟಕಗಳು`;
  }
  const prefixMessages = [
    ['Some results could not be loaded: ', 'ಕೆಲವು ಫಲಿತಾಂಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ: '],
    ['You already responded: ', 'ನೀವು ಈಗಾಗಲೇ ಪ್ರತಿಕ್ರಿಯಿಸಿದ್ದೀರಿ: '],
  ];
  for (const [prefix, translatedPrefix] of prefixMessages) {
    if (source.startsWith(prefix)) {
      const remainder = source.slice(prefix.length);
      return translatedPrefix + (translateText(remainder) || remainder);
    }
  }
  return null;
}

export function localizeDocument(root = document) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement?.closest('script, style, noscript') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  let node = walker.nextNode();
  while (node) {
    localizeTextNode(node);
    node = walker.nextNode();
  }

  const attributes = ['placeholder', 'title', 'aria-label'];
  for (const element of root.querySelectorAll?.('*') || []) {
    let originals = originalAttributes.get(element);
    if (!originals) {
      originals = new Map();
      originalAttributes.set(element, originals);
    }
    for (const attribute of attributes) {
      if (!element.hasAttribute(attribute)) {
        continue;
      }
      if (!originals.has(attribute)) {
        originals.set(attribute, element.getAttribute(attribute));
      }
      const source = originals.get(attribute);
      element.setAttribute(attribute, activeLanguage === 'kn' ? translateText(source) || source : source);
    }
  }
  root.querySelectorAll?.('[data-i18n]').forEach((element) => {
    const translation = t(element.dataset.i18n);
    if (element.textContent !== translation) {
      element.textContent = translation;
    }
  });
}

export function observeLocalizedContent() {
  const observer = new MutationObserver((records) => {
    if (activeLanguage !== 'kn') {
      return;
    }
    for (const record of records) {
      for (const added of record.addedNodes) {
        if (added.nodeType === Node.TEXT_NODE) {
          localizeTextNode(added);
        } else if (added.nodeType === Node.ELEMENT_NODE) {
          localizeDocument(added);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

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
  document.title = activeLanguage === 'kn' ? translateText(originalTitle) || originalTitle : originalTitle;
  localizeDocument();
  window.dispatchEvent(new CustomEvent('app:languagechange', { detail: language }));
}
