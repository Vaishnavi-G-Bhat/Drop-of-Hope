export const APP_NAME = 'Drop of Hope';
export const DEMO_MODE = false;
export const APP_ROOT = new URL('../', import.meta.url);

export const API_BASE = window.__API_BASE__ || `${location.origin}/api`;

export function appUrl(path) {
  return new URL(path, APP_ROOT).href;
}

export const STORAGE_KEYS = Object.freeze({
  language: 'drop-of-hope-language',
  textScale: 'drop-of-hope-text-scale',
  searchFilters: 'drop-of-hope-search-filters',
  authenticated: 'drop-of-hope-authenticated',
});
