export const APP_NAME = 'Drop of Hope';
export const DEMO_MODE = false;
export const API_BASE =
  window.__API_BASE__ || `${location.protocol}//${location.hostname}:5000/api`;
export const APP_ROOT = new URL('../', import.meta.url);

export function appUrl(path) {
  return new URL(path, APP_ROOT).href;
}

export const STORAGE_KEYS = Object.freeze({
  language: 'drop-of-hope-language',
  textScale: 'drop-of-hope-text-scale',
  searchFilters: 'drop-of-hope-search-filters',
});
