export const APP_NAME = 'Drop of Hope';
export const DEMO_MODE = false;
export const APP_ROOT = new URL('../', import.meta.url);

const DEFAULT_LOCAL_API = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? `${location.protocol}//${location.hostname}:5000/api`
  : `${location.origin}/api`;

export const API_BASE =
  window.__API_BASE__ || DEFAULT_LOCAL_API;

export function appUrl(path) {
  return new URL(path, APP_ROOT).href;
}

export const STORAGE_KEYS = Object.freeze({
  language: 'drop-of-hope-language',
  textScale: 'drop-of-hope-text-scale',
  searchFilters: 'drop-of-hope-search-filters',
  authenticated: 'drop-of-hope-authenticated',
});
