/**
 * TransitOne - Storage Layer with In-Memory Fallback
 * Unified RTL and Indic Design System
 */

const memoryStore = {};

function isLocalStorageAvailable() {
  try {
    const testKey = '__transit_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const hasStorage = isLocalStorageAvailable();

export function getItem(key, defaultValue = null) {
  try {
    if (hasStorage) {
      const val = window.localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : defaultValue;
    }
  } catch (e) {
    // Parsing error or quota error
  }
  return memoryStore[key] !== undefined ? memoryStore[key] : defaultValue;
}

export function setItem(key, val) {
  try {
    if (hasStorage) {
      window.localStorage.setItem(key, JSON.stringify(val));
    }
  } catch (e) {
    // Quota exceeded or restricted
  }
  memoryStore[key] = val;
}

export function removeItem(key) {
  try {
    if (hasStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    // Ignore
  }
  delete memoryStore[key];
}

// Domain-specific helpers
const RECENT_KEY = 'transitone_recent_searches';
const FAVOURITES_KEY = 'transitone_favourites';
const TICKETS_KEY = 'transitone_tickets';
const SETTINGS_KEY = 'transitone_settings';

export function getRecentSearches() {
  return getItem(RECENT_KEY, [
    { from: 'majestic', to: 'whitefield' },
    { from: 'hebbal', to: 'mgRoad' },
    { from: 'silkboard', to: 'whitefield' }
  ]);
}

export function addRecentSearch(from, to) {
  if (!from || !to || from === to) return;
  let list = getRecentSearches().filter(item => !(item.from === from && item.to === to));
  list.unshift({ from, to, timestamp: Date.now() });
  if (list.length > 5) list = list.slice(0, 5);
  setItem(RECENT_KEY, list);
}

export function getFavourites() {
  return getItem(FAVOURITES_KEY, ['maj-wf-m1']);
}

export function isFavourite(routeId) {
  const favs = getFavourites();
  return favs.includes(routeId);
}

export function toggleFavourite(routeId) {
  let favs = getFavourites();
  if (favs.includes(routeId)) {
    favs = favs.filter(id => id !== routeId);
  } else {
    favs.push(routeId);
  }
  setItem(FAVOURITES_KEY, favs);
  return favs.includes(routeId);
}

export function getTickets() {
  return getItem(TICKETS_KEY, []);
}

export function saveTicket(ticket) {
  const list = getTickets();
  list.unshift(ticket);
  setItem(TICKETS_KEY, list);
  return ticket;
}

export function getSettings() {
  return getItem(SETTINGS_KEY, {
    numberingSystem: 'latn',
    textSize: '100%',
    reduceMotionOverride: false
  });
}

export function updateSettings(partial) {
  const cur = getSettings();
  const next = { ...cur, ...partial };
  setItem(SETTINGS_KEY, next);
  return next;
}

export function clearAllSavedData() {
  removeItem(RECENT_KEY);
  removeItem(FAVOURITES_KEY);
  removeItem(TICKETS_KEY);
  removeItem(SETTINGS_KEY);
  for (const k in memoryStore) {
    delete memoryStore[k];
  }
}

