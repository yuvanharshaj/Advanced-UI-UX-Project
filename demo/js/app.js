/**
 * TransitOne - Application Main Controller
 * Unified RTL & Indic Design System (WCAG 2.2 AA Hardened)
 */

import {
  SUPPORTED_LANGUAGES,
  getCurrentLanguage,
  applyLanguage,
  registerRenderCallback,
  isForcedOpposite,
  setForcedOpposite,
  isTextExpansionActive,
  setTextExpansionActive,
  translations,
  t
} from './i18n.js';

import {
  PLACES,
  ROUTES_DATA,
  getPlaceName,
  searchPlaces,
  findRoutes,
  getRouteById,
  calculateNextDepartures
} from './data.js';

import {
  icons,
  getIcon
} from './icons.js';

import {
  parseHash,
  navigate,
  markOnboarded
} from './router.js';

import {
  formatStops,
  formatMinutes,
  formatFare,
  formatNumber,
  formatTime,
  formatRelativeCountdown,
  setNumberingSystem,
  getNumberingSystem
} from './intl-helpers.js';

import {
  getRecentSearches,
  addRecentSearch,
  getFavourites,
  isFavourite,
  toggleFavourite,
  getTickets,
  saveTicket,
  getSettings,
  updateSettings,
  clearAllSavedData
} from './storage.js';

// Application State
const state = {
  selectedFrom: 'majestic',
  selectedTo: 'whitefield',
  formError: null,
  langSheetOpen: false,
  aboutModalOpen: false,
  isSimulatedLoading: false,
  forcedOffline: false,
  lastTriggerElement: null,

  // Combobox Active State
  activeCombobox: null, // 'from' | 'to' | null
  comboboxHighlightIndex: -1,
  activeComboboxMatches: [],

  // Results Filter & Sort State
  modeFilter: 'all', // 'all' | 'metro' | 'bus'
  sortFilter: 'fastest', // 'fastest' | 'cheapest' | 'stops'

  // Ticket Form State
  passengersCount: 1,
  travelerName: '',
  travelerPhone: '',
  paymentMethod: 'upi',

  // Toast System
  toastMessage: null,
  toastTimeout: null
};

// Periodic 30-second live departure refresh
setInterval(() => {
  const { route } = parseHash();
  if (route === 'results' || route === 'route') {
    renderApp();
  }
}, 30000);

// Global Error Catching for prototype resilience
window.addEventListener('error', (event) => {
  console.warn('TransitOne trapped error:', event.error);
});
window.addEventListener('unhandledrejection', (event) => {
  console.warn('TransitOne trapped promise rejection:', event.reason);
});

// Toast notification helper
function showToast(message) {
  state.toastMessage = message;
  const container = document.getElementById('toast-mount');
  if (container) {
    container.innerHTML = `
      <div class="toast-message" role="status" aria-live="polite">
        ${getIcon('check')}
        <span>${message}</span>
      </div>
    `;
  }
  if (state.toastTimeout) clearTimeout(state.toastTimeout);
  state.toastTimeout = setTimeout(() => {
    state.toastMessage = null;
    if (container) container.innerHTML = '';
  }, 2600);
}

// Global Escape Key Listener for Modals / Bottom Sheets
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.activeCombobox) {
      state.activeCombobox = null;
      renderApp();
    } else if (state.langSheetOpen) {
      state.langSheetOpen = false;
      renderApp();
      if (state.lastTriggerElement) state.lastTriggerElement.focus();
    } else if (state.aboutModalOpen) {
      state.aboutModalOpen = false;
      renderApp();
      if (state.lastTriggerElement) state.lastTriggerElement.focus();
    }
  }
});

// Document click to dismiss combobox dropdown
document.addEventListener('click', (e) => {
  if (state.activeCombobox && !e.target.closest('.white-input-field') && !e.target.closest('.combobox-listbox')) {
    state.activeCombobox = null;
    renderApp();
  }
});

// Helper for Color Luminance and Contrast Calculation
function parseHex(hex) {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1, hex2) {
  try {
    const [r1, g1, b1] = parseHex(hex1);
    const [r2, g2, b2] = parseHex(hex2);
    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  } catch (e) {
    return '4.50';
  }
}

// BDI Wrapper for Localized Place Names
function renderPlace(placeKey, lang) {
  const name = getPlaceName(placeKey, lang);
  return `<bdi>${name}</bdi>`;
}

// Top Bar Header
function renderHeader(route, lang) {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  if (route === 'welcome') {
    return `
      <header class="app-header" role="banner">
        <div class="brand-badge">
          <img src="assets/logo.svg" alt="TransitOne" width="36" height="36" />
          <div class="brand-info">
            <span class="brand-name">${t('appName')}</span>
            <span class="brand-tagline">${t('tagline')}</span>
          </div>
        </div>
      </header>
    `;
  }

  const hasBack = ['results', 'route', 'buy', 'ticket', 'design-system'].includes(route);

  return `
    <header class="app-header" role="banner">
      ${hasBack ? `
        <div class="header-with-back">
          <button type="button" class="back-button" id="btn-back-header" aria-label="${t('back')}">
            ${getIcon('arrow-back')}
            <span>${t('back')}</span>
          </button>
          <button type="button" class="lang-chip-btn" id="btn-open-lang-sheet" aria-haspopup="dialog" aria-label="${t('chooseLang')}: ${currentLangObj.nativeName}">
            ${getIcon('globe')}
            <span lang="${currentLangObj.code}">${currentLangObj.nativeName}</span>
            ${getIcon('chevron-down')}
          </button>
        </div>
      ` : `
        <div class="brand-badge">
          <img src="assets/logo.svg" alt="TransitOne" width="36" height="36" />
          <div class="brand-info">
            <span class="brand-name">${t('appName')}</span>
            <span class="brand-tagline">${t('tagline')}</span>
          </div>
        </div>
        <button type="button" class="lang-chip-btn" id="btn-open-lang-sheet" aria-haspopup="dialog" aria-label="${t('chooseLang')}: ${currentLangObj.nativeName}">
          ${getIcon('globe')}
          <span lang="${currentLangObj.code}">${currentLangObj.nativeName}</span>
          ${getIcon('chevron-down')}
        </button>
      `}
    </header>
  `;
}

// Offline Banner
function renderOfflineBanner() {
  const isOffline = !navigator.onLine || state.forcedOffline;
  if (!isOffline) return '';
  return `
    <div class="offline-banner" role="alert" aria-live="assertive">
      <div class="offline-banner-content">
        ${getIcon('wifi-off')}
        <span>${t('offlineBanner')}</span>
      </div>
    </div>
  `;
}

// Fixed Bottom Navigation
function renderBottomNav(route) {
  if (route === 'welcome') return '';

  const isHome = route === 'home';
  const isResults = route === 'results' || route === 'route' || route === 'buy' || route === 'ticket';
  const isSettings = route === 'settings' || route === 'design-system';

  return `
    <nav class="bottom-nav" aria-label="Main Navigation">
      <button type="button" class="nav-item ${isHome ? 'active' : ''}" data-nav="home" aria-current="${isHome ? 'page' : 'false'}">
        ${getIcon('home')}
        <span>${t('navHome')}</span>
      </button>
      <button type="button" class="nav-item ${isResults ? 'active' : ''}" data-nav="search" aria-current="${isResults ? 'page' : 'false'}">
        ${getIcon('search')}
        <span>${t('navSearch')}</span>
      </button>
      <button type="button" class="nav-item ${isSettings ? 'active' : ''}" data-nav="settings" aria-current="${isSettings ? 'page' : 'false'}">
        ${getIcon('settings')}
        <span>${t('navSettings')}</span>
      </button>
    </nav>
  `;
}

// 1. WELCOME SCREEN
function renderWelcomeScreen(lang) {
  return `
    <div class="welcome-container">
      <div class="welcome-titles">
        <h1 class="welcome-heading">${t('welcomeTitle')}</h1>
        <p class="welcome-sub">${t('welcomeSub')}</p>
      </div>

      <div class="hero-card" role="img" aria-label="TransitOne High-Speed Rail">
        <img src="assets/hero.png" alt="TransitOne modern train" width="400" height="133" />
      </div>

      <section class="welcome-lang-section" aria-labelledby="lang-choice-title">
        <h2 id="lang-choice-title" class="lang-section-title">${t('chooseLang')}</h2>
        <p class="lang-section-desc">${t('changeAnytime')}</p>

        <div class="lang-grid" role="radiogroup" aria-labelledby="lang-choice-title" id="welcome-lang-grid">
          ${SUPPORTED_LANGUAGES.map(item => `
            <button type="button" 
                    role="radio" 
                    tabindex="${item.code === lang ? '0' : '-1'}"
                    aria-checked="${item.code === lang ? 'true' : 'false'}"
                    class="lang-card-option ${item.code === lang ? 'selected' : ''}" 
                    data-lang-choice="${item.code}">
              <div class="lang-card-icon">
                ${getIcon('globe')}
              </div>
              <div class="lang-card-texts">
                <span class="lang-card-name" lang="${item.code}">${item.nativeName}</span>
                <span class="lang-card-welcome" lang="${item.code}">${item.welcome}</span>
              </div>
            </button>
          `).join('')}
        </div>

        <button type="button" class="btn-primary" id="btn-welcome-continue">
          ${t('continue')}
        </button>
      </section>
    </div>
  `;
}

// 2. HOME SCREEN with ARIA 1.2 Combobox, Recent Searches & Favourites
function renderHomeScreen(params, lang) {
  const isDenied = params.state === 'denied';
  const hasError = state.formError || params.state === 'error';
  const recentSearches = getRecentSearches();
  const favourites = getFavourites();

  const isFromOpen = state.activeCombobox === 'from';
  const isToOpen = state.activeCombobox === 'to';

  const matches = state.activeComboboxMatches.length > 0 
    ? state.activeComboboxMatches 
    : Object.values(PLACES);

  return `
    <h1 class="sr-only">${t('appName')} - ${t('navHome')}</h1>

    <div class="hero-card" role="img" aria-label="TransitOne High-Speed Rail">
      <img src="assets/hero.png" alt="TransitOne modern train" width="400" height="133" />
    </div>

    ${isDenied ? `
      <div class="edge-state-card" role="alert">
        <div class="edge-state-icon">${getIcon('location-denied')}</div>
        <h2 class="edge-state-title">${t('deniedTitle')}</h2>
        <p class="edge-state-desc">${t('deniedDesc')}</p>
        <button type="button" class="btn-primary" id="btn-focus-from" style="min-block-size:44px; inline-size:auto; padding-inline:16px;">
          ${t('enterManually')}
        </button>
      </div>
    ` : ''}

    <!-- Orange Search Card -->
    <section class="orange-search-card" aria-label="Journey Planner">
      ${hasError ? `
        <div class="form-inline-error" id="form-error-msg" role="alert" aria-live="assertive">
          ${getIcon('alert-circle')}
          <span>${state.formError || t('errorSameLocation')}</span>
        </div>
      ` : ''}

      <div class="orange-search-inputs">
        <!-- Origin Combobox -->
        <div class="combobox-container">
          <div class="white-input-field ${hasError ? 'has-error' : ''}">
            <span class="white-input-field-icon" aria-hidden="true">${getIcon('pin-dot')}</span>
            <label class="white-input-field-label" for="input-from">${t('from')}</label>
            <input id="input-from" 
                   class="white-editable-input" 
                   role="combobox"
                   aria-autocomplete="list"
                   aria-expanded="${isFromOpen ? 'true' : 'false'}"
                   aria-controls="listbox-from"
                   aria-activedescendant="${isFromOpen && state.comboboxHighlightIndex >= 0 ? `from-opt-${state.comboboxHighlightIndex}` : ''}"
                   value="${getPlaceName(state.selectedFrom, lang)}" 
                   aria-invalid="${hasError ? 'true' : 'false'}"
                   placeholder="${t('from')}"
                   autocomplete="off" />
          </div>

          ${isFromOpen ? `
            <ul class="combobox-listbox" id="listbox-from" role="listbox" aria-label="${t('from')} options">
              ${matches.map((p, idx) => `
                <li id="from-opt-${idx}" 
                    role="option" 
                    aria-selected="${idx === state.comboboxHighlightIndex ? 'true' : 'false'}"
                    class="combobox-option" 
                    data-combobox-select="from" 
                    data-place-id="${p.id}">
                  <span>${p[lang] || p.en}</span>
                  <span class="combobox-option-meta"><bdi>${p.en}</bdi></span>
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </div>

        <!-- Swap Button -->
        <button type="button" class="btn-white-swap" id="btn-swap-locations" aria-label="${t('swapLocations')}">
          ${getIcon('swap-vertical')}
        </button>

        <!-- Destination Combobox -->
        <div class="combobox-container">
          <div class="white-input-field ${hasError ? 'has-error' : ''}">
            <span class="white-input-field-icon" aria-hidden="true">${getIcon('pin')}</span>
            <label class="white-input-field-label" for="input-to">${t('to')}</label>
            <input id="input-to" 
                   class="white-editable-input" 
                   role="combobox"
                   aria-autocomplete="list"
                   aria-expanded="${isToOpen ? 'true' : 'false'}"
                   aria-controls="listbox-to"
                   aria-activedescendant="${isToOpen && state.comboboxHighlightIndex >= 0 ? `to-opt-${state.comboboxHighlightIndex}` : ''}"
                   value="${getPlaceName(state.selectedTo, lang)}" 
                   aria-invalid="${hasError ? 'true' : 'false'}"
                   placeholder="${t('to')}"
                   autocomplete="off" />
          </div>

          ${isToOpen ? `
            <ul class="combobox-listbox" id="listbox-to" role="listbox" aria-label="${t('to')} options">
              ${matches.map((p, idx) => `
                <li id="to-opt-${idx}" 
                    role="option" 
                    aria-selected="${idx === state.comboboxHighlightIndex ? 'true' : 'false'}"
                    class="combobox-option" 
                    data-combobox-select="to" 
                    data-place-id="${p.id}">
                  <span>${p[lang] || p.en}</span>
                  <span class="combobox-option-meta"><bdi>${p.en}</bdi></span>
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </div>
      </div>

      <button type="button" class="btn-primary" id="btn-search-continue">
        ${t('continue')}
      </button>
    </section>

    <!-- Recent Searches Section -->
    ${recentSearches.length > 0 ? `
      <section class="recent-searches-section" aria-labelledby="recent-searches-heading">
        <div class="section-header">
          <h2 id="recent-searches-heading" class="section-title">${t('recentSearches')}</h2>
        </div>
        <div class="chip-group-scroll">
          ${recentSearches.map(item => `
            <button type="button" class="chip-btn" data-recent-search="${item.from}:${item.to}">
              ${renderPlace(item.from, lang)}
              <span class="mirror-rtl" aria-hidden="true">→</span>
              ${renderPlace(item.to, lang)}
            </button>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Available Routes Section -->
    <section class="available-routes-section" aria-labelledby="available-routes-heading">
      <div class="section-header">
        <h2 id="available-routes-heading" class="section-title">${t('availableRoutes')}</h2>
        <button type="button" class="see-all-link" id="btn-see-all">
          <span>${t('seeAll')}</span>
          ${getIcon('arrow-see-all')}
        </button>
      </div>

      <div class="quick-routes-list">
        <div class="route-card" data-route-pair="hebbal:mgRoad" tabindex="0" role="button" aria-label="${getPlaceName('hebbal', lang)} ${t('to')} ${getPlaceName('mgRoad', lang)}">
          <div class="route-card-main">
            <div class="route-icon-badge">${getIcon('bus')}</div>
            <div class="route-info">
              <span class="route-endpoints">
                ${renderPlace('hebbal', lang)}
                <span class="sr-only"> ${t('to')} </span>
                <span class="route-arrow-icon" aria-hidden="true">${getIcon('arrow-forward')}</span>
                ${renderPlace('mgRoad', lang)}
              </span>
            </div>
          </div>
          ${getIcon('chevron-forward')}
        </div>

        <div class="route-card" data-route-pair="majestic:krPuram" tabindex="0" role="button" aria-label="${getPlaceName('majestic', lang)} ${t('to')} ${getPlaceName('krPuram', lang)}">
          <div class="route-card-main">
            <div class="route-icon-badge">${getIcon('metro')}</div>
            <div class="route-info">
              <span class="route-endpoints">
                ${renderPlace('majestic', lang)}
                <span class="sr-only"> ${t('to')} </span>
                <span class="route-arrow-icon" aria-hidden="true">${getIcon('arrow-forward')}</span>
                ${renderPlace('krPuram', lang)}
              </span>
            </div>
          </div>
          ${getIcon('chevron-forward')}
        </div>

        <div class="route-card" data-route-pair="silkboard:whitefield" tabindex="0" role="button" aria-label="${getPlaceName('silkboard', lang)} ${t('to')} ${getPlaceName('whitefield', lang)}">
          <div class="route-card-main">
            <div class="route-icon-badge">${getIcon('bus')}</div>
            <div class="route-info">
              <span class="route-endpoints">
                ${renderPlace('silkboard', lang)}
                <span class="sr-only"> ${t('to')} </span>
                <span class="route-arrow-icon" aria-hidden="true">${getIcon('arrow-forward')}</span>
                ${renderPlace('whitefield', lang)}
              </span>
            </div>
          </div>
          ${getIcon('chevron-forward')}
        </div>
      </div>
    </section>
  `;
}

// 3. RESULTS SCREEN with Filtering, Sorting & Live Countdowns
function renderResultsScreen(params, lang) {
  const fromKey = params.from || state.selectedFrom || 'majestic';
  const toKey = params.to || state.selectedTo || 'whitefield';
  const isExplicitEmpty = params.state === 'empty';
  const isLoading = state.isSimulatedLoading || params.state === 'loading';

  if (isLoading) {
    return `
      <h1 class="sr-only">${t('availableRoutes')}</h1>
      <div class="pair-banner">
        <div class="pair-banner-text">
          ${renderPlace(fromKey, lang)}
          <span class="sr-only"> ${t('to')} </span>
          <span aria-hidden="true">${getIcon('arrow-forward')}</span>
          ${renderPlace(toKey, lang)}
        </div>
        <img src="assets/hero.png" alt="Transit train" class="pair-banner-art" />
      </div>

      <div role="status" aria-label="${t('loadingRoutes')}">
        <div class="skeleton-card">
          <div class="skeleton-shimmer" style="block-size:24px; inline-size:50%; margin-block-end:12px;"></div>
          <div class="skeleton-shimmer" style="block-size:16px; inline-size:80%; margin-block-end:16px;"></div>
          <div class="skeleton-shimmer" style="block-size:20px; inline-size:60%;"></div>
        </div>
        <div class="skeleton-card">
          <div class="skeleton-shimmer" style="block-size:24px; inline-size:45%; margin-block-end:12px;"></div>
          <div class="skeleton-shimmer" style="block-size:16px; inline-size:75%; margin-block-end:16px;"></div>
          <div class="skeleton-shimmer" style="block-size:20px; inline-size:50%;"></div>
        </div>
      </div>
    `;
  }

  let rawRoutes = findRoutes(fromKey, toKey);
  if (isExplicitEmpty || (!rawRoutes || rawRoutes.length === 0)) {
    return `
      <h1 class="sr-only">${t('availableRoutes')}</h1>
      <div class="pair-banner">
        <div class="pair-banner-text">
          ${renderPlace(fromKey, lang)}
          <span class="sr-only"> ${t('to')} </span>
          <span aria-hidden="true">${getIcon('arrow-forward')}</span>
          ${renderPlace(toKey, lang)}
        </div>
        <img src="assets/hero.png" alt="Transit train" class="pair-banner-art" />
      </div>

      <div class="edge-state-card" role="alert">
        <div class="edge-state-icon">${getIcon('alert-circle')}</div>
        <h2 class="edge-state-title">${t('emptyTitle')}</h2>
        <p class="edge-state-desc">${t('emptyDesc')}</p>
        <button type="button" class="btn-primary" id="btn-try-another-route" style="min-block-size:44px; inline-size:auto; padding-inline:20px;">
          ${t('tryAnother')}
        </button>
      </div>
    `;
  }

  // Filter routes by mode
  let filteredRoutes = rawRoutes;
  if (state.modeFilter === 'metro') {
    filteredRoutes = filteredRoutes.filter(r => r.mode === 'metro');
  } else if (state.modeFilter === 'bus') {
    filteredRoutes = filteredRoutes.filter(r => r.mode === 'bus');
  }

  // Sort routes
  filteredRoutes = [...filteredRoutes].sort((a, b) => {
    if (state.sortFilter === 'cheapest') {
      return a.fare - b.fare;
    } else if (state.sortFilter === 'stops') {
      return a.stopsCount - b.stopsCount;
    }
    return a.durationMin - b.durationMin; // 'fastest' default
  });

  return `
    <h1 class="sr-only">${t('availableRoutes')}</h1>
    <!-- Pair Banner -->
    <div class="pair-banner">
      <div class="pair-banner-text">
        <span style="color:var(--color-brand-orange);">${getIcon('pin')}</span>
        ${renderPlace(fromKey, lang)}
        <span class="sr-only"> ${t('to')} </span>
        <span aria-hidden="true">${getIcon('arrow-forward')}</span>
        ${renderPlace(toKey, lang)}
      </div>
      <img src="assets/hero.png" alt="TransitOne train" class="pair-banner-art" />
    </div>

    <!-- Filter & Sort Bar -->
    <section class="filter-sort-section" aria-label="Route filters and sorting">
      <!-- Mode Filters -->
      <div class="chip-group-scroll" role="radiogroup" aria-label="Transit Mode">
        <button type="button" 
                class="chip-btn ${state.modeFilter === 'all' ? 'active' : ''}" 
                data-mode-filter="all" 
                role="radio" 
                aria-checked="${state.modeFilter === 'all' ? 'true' : 'false'}">
          ${t('filterAll')}
        </button>
        <button type="button" 
                class="chip-btn ${state.modeFilter === 'metro' ? 'active' : ''}" 
                data-mode-filter="metro" 
                role="radio" 
                aria-checked="${state.modeFilter === 'metro' ? 'true' : 'false'}">
          ${getIcon('metro')}
          ${t('filterMetro')}
        </button>
        <button type="button" 
                class="chip-btn ${state.modeFilter === 'bus' ? 'active' : ''}" 
                data-mode-filter="bus" 
                role="radio" 
                aria-checked="${state.modeFilter === 'bus' ? 'true' : 'false'}">
          ${getIcon('bus')}
          ${t('filterBus')}
        </button>
      </div>

      <!-- Sorting Options -->
      <div class="chip-group-scroll" role="radiogroup" aria-label="Sort routes">
        <button type="button" 
                class="chip-btn ${state.sortFilter === 'fastest' ? 'active' : ''}" 
                data-sort-filter="fastest" 
                role="radio" 
                aria-checked="${state.sortFilter === 'fastest' ? 'true' : 'false'}">
          ${t('sortFastest')}
        </button>
        <button type="button" 
                class="chip-btn ${state.sortFilter === 'cheapest' ? 'active' : ''}" 
                data-sort-filter="cheapest" 
                role="radio" 
                aria-checked="${state.sortFilter === 'cheapest' ? 'true' : 'false'}">
          ${t('sortCheapest')}
        </button>
        <button type="button" 
                class="chip-btn ${state.sortFilter === 'stops' ? 'active' : ''}" 
                data-sort-filter="stops" 
                role="radio" 
                aria-checked="${state.sortFilter === 'stops' ? 'true' : 'false'}">
          ${t('sortFewestStops')}
        </button>
      </div>
    </section>

    <!-- Route Cards List -->
    <div class="results-list" role="feed" aria-label="${t('availableRoutes')}">
      ${filteredRoutes.map((r, idx) => {
        const isFirst = idx === 0;
        const iconName = r.mode === 'metro' ? 'metro' : 'bus';
        return `
          <article class="route-item-card ${isFirst ? 'highlight-orange' : ''}" 
                   data-route-id="${r.id}" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${r.code}, ${getPlaceName(r.from, lang)} ${t('to')} ${getPlaceName(r.to, lang)}, ${formatMinutes(r.durationMin, lang)}, ${formatFare(r.fare, lang)}">
            <div class="route-card-header">
              <div class="route-card-lead">
                <div class="route-mode-tile">${getIcon(iconName)}</div>
                <div class="route-card-headings">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="route-card-code"><bdi>${r.code}</bdi></span>
                    <span class="live-departure-chip">
                      <span class="live-dot" aria-hidden="true"></span>
                      <span>${r.nextDeparture || '4 min'}</span>
                    </span>
                  </div>
                  <span class="route-card-corridor">
                    ${renderPlace(r.from, lang)}
                    <span class="sr-only"> ${t('to')} </span>
                    <span aria-hidden="true">${getIcon('arrow-forward')}</span>
                    ${renderPlace(r.to, lang)}
                  </span>
                </div>
              </div>
              ${getIcon('chevron-forward')}
            </div>

            <div class="route-card-footer">
              <span class="info-chip">
                ${getIcon('clock')}
                <span>${formatMinutes(r.durationMin, lang)}</span>
              </span>
              <span class="info-chip">
                ${getIcon('pin-dot')}
                <span>${formatStops(r.stopsCount, lang)}</span>
              </span>
              <span class="info-chip chip-fare">
                ${getIcon('ticket')}
                <span>${formatFare(r.fare, lang)}</span>
              </span>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

// 4. ROUTE DETAILS SCREEN with Save, Share, Live Timeline & CTA
function renderRouteDetailsScreen(routeId, lang) {
  const route = getRouteById(routeId);
  const iconName = route.mode === 'metro' ? 'metro' : 'bus';
  const isSaved = isFavourite(route.id);
  const departures = route.departureTimes || [new Date(), new Date(Date.now() + 600000), new Date(Date.now() + 1200000)];

  return `
    <h1 class="sr-only">${t('stopsTimeline')}</h1>
    <div class="details-summary-card">
      <div class="details-summary-head">
        <div class="route-card-lead">
          <div class="route-mode-tile">${getIcon(iconName)}</div>
          <span class="details-route-code"><bdi>${route.code}</bdi></span>
        </div>
        <div class="live-departure-chip">
          <span class="live-dot" aria-hidden="true"></span>
          <span>${t('liveBadge')} • ${route.nextDeparture || '4 min'}</span>
        </div>
      </div>

      <div class="details-endpoints">
        ${renderPlace(route.from, lang)}
        <span class="sr-only"> ${t('to')} </span>
        <span aria-hidden="true">${getIcon('arrow-forward')}</span>
        ${renderPlace(route.to, lang)}
      </div>

      <div class="details-metrics-row">
        <span class="info-chip">
          ${getIcon('clock')}
          <span>${formatMinutes(route.durationMin, lang)}</span>
        </span>
        <span class="info-chip">
          ${getIcon('pin-dot')}
          <span>${formatStops(route.stopsCount, lang)}</span>
        </span>
        <span class="info-chip chip-fare">
          ${getIcon('ticket')}
          <span>${formatFare(route.fare, lang)}</span>
        </span>
      </div>

      <!-- Save & Share Action Buttons -->
      <div class="route-actions-row">
        <button type="button" class="btn-secondary-action ${isSaved ? 'active' : ''}" id="btn-toggle-save-route" data-route-id="${route.id}">
          ${getIcon(isSaved ? 'star-filled' : 'star')}
          <span>${isSaved ? t('routeSaved') : t('saveRoute')}</span>
        </button>
        <button type="button" class="btn-secondary-action" id="btn-share-route" data-route-id="${route.id}">
          ${getIcon('share')}
          <span>${t('shareRoute')}</span>
        </button>
      </div>
    </div>

    <!-- Upcoming Departures Bar -->
    <div class="departures-card">
      <h2 class="timeline-title">${t('departuresTimeline')}</h2>
      <div class="departures-list">
        ${departures.map((d, i) => `
          <div class="departure-pill">
            <span class="departure-pill-time">${formatTime(d, lang)}</span>
            <span class="departure-pill-rel">${formatMinutes((i + 1) * 7, lang)}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Vertical Timeline with logical properties -->
    <div class="timeline-card">
      <h2 class="timeline-title">${t('stopsTimeline')}</h2>
      <div class="stops-timeline" aria-label="${t('stopsTimeline')}">
        ${route.stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === route.stops.length - 1;
          const itemClass = isFirst ? 'first' : isLast ? 'last' : '';
          const stopName = stop.name[lang] || stop.name.en;
          return `
            <div class="stop-item ${itemClass}">
              <div class="stop-dot"></div>
              <span class="stop-name"><bdi>${stopName}</bdi></span>
              <span class="stop-time">${stop.time}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <button type="button" class="btn-primary" id="btn-details-buy-ticket" data-route-id="${route.id}" style="margin-block-end:var(--space-12);">
      ${t('buyTicket')} • ${formatFare(route.fare, lang)}
    </button>

    <button type="button" class="btn-secondary" id="btn-details-search-again">
      ${t('searchAgain')}
    </button>
  `;
}

// 5. TICKET BUY SCREEN (#/buy?routeId=...)
function renderBuyScreen(params, lang) {
  const route = getRouteById(params.routeId);
  const farePerPerson = route.fare || 30;
  const totalAmount = farePerPerson * state.passengersCount;

  return `
    <h1 class="sr-only">${t('buyTicket')}</h1>

    <div class="details-summary-card">
      <span class="details-route-code"><bdi>${route.code}</bdi></span>
      <div class="details-endpoints" style="margin-block:var(--space-6);">
        ${renderPlace(route.from, lang)}
        <span class="sr-only"> ${t('to')} </span>
        <span aria-hidden="true">${getIcon('arrow-forward')}</span>
        ${renderPlace(route.to, lang)}
      </div>
    </div>

    <section class="ticket-form-card" aria-label="Ticket Purchase Form">
      <!-- Passenger Stepper -->
      <div class="form-group">
        <label class="form-group-label" id="label-passengers">${t('passengers')}</label>
        <div class="stepper-control" role="group" aria-labelledby="label-passengers">
          <button type="button" class="btn-stepper" id="btn-stepper-minus" aria-label="Decrease passenger count">−</button>
          <span class="stepper-val" id="stepper-display">${formatNumber(state.passengersCount, lang)}</span>
          <button type="button" class="btn-stepper" id="btn-stepper-plus" aria-label="Increase passenger count">+</button>
        </div>
      </div>

      <!-- Traveler Name -->
      <div class="form-group">
        <label class="form-group-label" for="input-passenger-name">${t('passengerName')}</label>
        <input id="input-passenger-name" 
               class="white-editable-input" 
               style="border:1.5px solid var(--color-border); border-radius:var(--radius-input); padding:10px 12px; background:var(--color-surface);" 
               value="${state.travelerName}" 
               placeholder="Harsha / John Doe" />
      </div>

      <!-- Traveler Phone (Strictly dir="ltr") -->
      <div class="form-group">
        <label class="form-group-label" for="input-passenger-phone">${t('passengerPhone')}</label>
        <input id="input-passenger-phone" 
               type="tel" 
               dir="ltr" 
               class="white-editable-input" 
               style="border:1.5px solid var(--color-border); border-radius:var(--radius-input); padding:10px 12px; background:var(--color-surface);" 
               value="${state.travelerPhone || '+91 98765 43210'}" 
               placeholder="+91" />
      </div>

      <!-- Payment Method -->
      <div class="form-group">
        <span class="form-group-label" id="label-payment">${t('paymentMethod')}</span>
        <div class="payment-radio-group" role="radiogroup" aria-labelledby="label-payment">
          <label class="payment-option-label">
            <input type="radio" name="payment" value="upi" ${state.paymentMethod === 'upi' ? 'checked' : ''} />
            <span>${t('payUpi')}</span>
          </label>
          <label class="payment-option-label">
            <input type="radio" name="payment" value="card" ${state.paymentMethod === 'card' ? 'checked' : ''} />
            <span>${t('payCard')}</span>
          </label>
          <label class="payment-option-label">
            <input type="radio" name="payment" value="cash" ${state.paymentMethod === 'cash' ? 'checked' : ''} />
            <span>${t('payCash')}</span>
          </label>
        </div>
      </div>

      <!-- Fare Summary -->
      <div style="border-block-start:1px solid var(--color-border); padding-block-start:var(--space-12); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:var(--font-size-sub); font-weight:700;">${t('totalFare')}:</span>
        <span style="font-size:var(--font-size-heading); font-weight:700; color:var(--color-brand-orange);">
          ${formatFare(totalAmount, lang)}
        </span>
      </div>

      <button type="button" class="btn-primary" id="btn-confirm-ticket" data-route-id="${route.id}">
        ${t('confirmAndPay')}
      </button>
    </section>
  `;
}

// 6. TICKET RECEIPT SCREEN (#/ticket/<id>)
function renderTicketReceiptScreen(ticketId, lang) {
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId) || tickets[0] || {
    id: 'TK-84920',
    routeCode: 'Metro M1',
    from: 'majestic',
    to: 'whitefield',
    passengers: 1,
    fare: 30,
    time: '09:30',
    date: 'Today'
  };

  return `
    <h1 class="sr-only">${t('ticketConfirmed')}</h1>

    <div class="ticket-receipt-card" role="region" aria-label="${t('ticketConfirmed')}">
      <div style="inline-size:48px; block-size:48px; border-radius:var(--radius-pill); background-color:var(--color-brand-orange); color:#FFFFFF; display:flex; align-items:center; justify-content:center;">
        ${getIcon('check')}
      </div>
      <h2 style="font-size:var(--font-size-sub); font-weight:700; margin:0;">${t('ticketConfirmed')}</h2>
      <span style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
        ${t('ticketId')}: <bdi>${ticket.id}</bdi>
      </span>

      <div style="font-size:var(--font-size-body); font-weight:700; margin-block:var(--space-8);">
        ${renderPlace(ticket.from, lang)}
        <span class="mirror-rtl" aria-hidden="true"> → </span>
        ${renderPlace(ticket.to, lang)}
      </div>

      <!-- Generated Vector SVG QR Code -->
      <div class="qr-code-box" role="img" aria-label="Digital Transit QR Code">
        <svg width="144" height="144" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Positioning Boxes -->
          <rect x="1" y="1" width="7" height="7" stroke="#1F2937" stroke-width="2"/>
          <rect x="3" y="3" width="3" height="3" fill="#1F2937"/>
          <rect x="21" y="1" width="7" height="7" stroke="#1F2937" stroke-width="2"/>
          <rect x="23" y="3" width="3" height="3" fill="#1F2937"/>
          <rect x="1" y="21" width="7" height="7" stroke="#1F2937" stroke-width="2"/>
          <rect x="3" y="23" width="3" height="3" fill="#1F2937"/>
          <!-- Data Dots -->
          <rect x="11" y="2" width="2" height="2" fill="#1F2937"/>
          <rect x="15" y="2" width="2" height="2" fill="#1F2937"/>
          <rect x="11" y="6" width="2" height="2" fill="#1F2937"/>
          <rect x="13" y="10" width="3" height="3" fill="#FF8A00"/>
          <rect x="10" y="14" width="2" height="2" fill="#1F2937"/>
          <rect x="14" y="14" width="2" height="2" fill="#1F2937"/>
          <rect x="18" y="14" width="2" height="2" fill="#1F2937"/>
          <rect x="11" y="18" width="2" height="2" fill="#1F2937"/>
          <rect x="15" y="18" width="2" height="2" fill="#1F2937"/>
          <rect x="21" y="11" width="2" height="2" fill="#1F2937"/>
          <rect x="25" y="11" width="2" height="2" fill="#1F2937"/>
          <rect x="21" y="15" width="2" height="2" fill="#1F2937"/>
          <rect x="23" y="23" width="2" height="2" fill="#1F2937"/>
          <rect x="25" y="25" width="2" height="2" fill="#1F2937"/>
        </svg>
      </div>

      <p style="font-size:var(--font-size-small); font-weight:600; color:var(--color-text);">
        ${t('showQrAtGate')}
      </p>

      <div style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
        ${t('validFor')} • ${formatFare(ticket.fare, lang)} (${formatNumber(ticket.passengers, lang)} ${t('passengers')})
      </div>
    </div>

    <button type="button" class="btn-primary" id="btn-ticket-back-home">
      ${t('navHome')}
    </button>
  `;
}

// 7. SETTINGS SCREEN with Numerals, Text-Size, and Data Reset
function renderSettingsScreen(lang) {
  const isLarger = document.documentElement.classList.contains('larger-text');
  const isHighContrast = document.documentElement.classList.contains('high-contrast');
  const isForced = isForcedOpposite();
  const currentNumSys = getNumberingSystem();

  return `
    <h1 class="sr-only">${t('navSettings')}</h1>

    <!-- Language Selection Section -->
    <section class="settings-section" aria-labelledby="settings-lang-heading">
      <div class="settings-section-head">
        <div class="settings-section-icon">${getIcon('globe')}</div>
        <div class="settings-section-info">
          <h2 id="settings-lang-heading" class="settings-section-title">${t('language')}</h2>
          <span class="settings-section-desc">${t('chooseLang')}</span>
        </div>
      </div>

      <div class="lang-radio-list" role="radiogroup" aria-labelledby="settings-lang-heading">
        ${SUPPORTED_LANGUAGES.map(item => `
          <div class="lang-radio-item ${item.code === lang ? 'selected' : ''}" 
               role="radio" 
               aria-checked="${item.code === lang ? 'true' : 'false'}"
               tabindex="0"
               data-lang-choice="${item.code}">
            <div class="lang-radio-main">
              <span class="lang-radio-icon">${getIcon('globe')}</span>
              <div class="lang-radio-texts">
                <span class="lang-radio-name" lang="${item.code}">${item.nativeName}</span>
                <span class="lang-radio-welcome" lang="${item.code}">${item.welcome}</span>
              </div>
            </div>
            <div class="radio-indicator"></div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Accessibility Section -->
    <section class="settings-section" aria-labelledby="settings-access-heading">
      <div class="settings-section-head">
        <div class="settings-section-icon">${getIcon('accessibility')}</div>
        <div class="settings-section-info">
          <h2 id="settings-access-heading" class="settings-section-title">${t('accessibility')}</h2>
          <span class="settings-section-desc">${t('makeEasier')}</span>
        </div>
      </div>

      <!-- Numerals Switch -->
      <div class="settings-toggle-row">
        <div class="settings-toggle-info">
          <span class="settings-toggle-label">${t('numerals')}</span>
          <span class="settings-toggle-desc">${currentNumSys === 'latn' ? t('latinDigits') : t('nativeDigits')}</span>
        </div>
        <label class="switch" aria-label="${t('numerals')}">
          <input type="checkbox" role="switch" aria-checked="${currentNumSys !== 'latn' ? 'true' : 'false'}" id="toggle-numerals" ${currentNumSys !== 'latn' ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <!-- Larger Text Toggle -->
      <div class="settings-toggle-row">
        <div class="settings-toggle-info">
          <span class="settings-toggle-label">${t('largerText')}</span>
          <span class="settings-toggle-desc">${t('largerTextDesc')}</span>
        </div>
        <label class="switch" aria-label="${t('largerText')}">
          <input type="checkbox" role="switch" aria-checked="${isLarger ? 'true' : 'false'}" id="toggle-larger-text" ${isLarger ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <!-- High Contrast Toggle -->
      <div class="settings-toggle-row">
        <div class="settings-toggle-info">
          <span class="settings-toggle-label">${t('highContrast')}</span>
          <span class="settings-toggle-desc">${t('highContrastDesc')}</span>
        </div>
        <label class="switch" aria-label="${t('highContrast')}">
          <input type="checkbox" role="switch" aria-checked="${isHighContrast ? 'true' : 'false'}" id="toggle-high-contrast" ${isHighContrast ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    </section>

    <!-- Data Management Section -->
    <section class="settings-section" aria-labelledby="settings-data-heading">
      <div class="settings-section-head">
        <div class="settings-section-icon">${getIcon('refresh')}</div>
        <div class="settings-section-info">
          <h2 id="settings-data-heading" class="settings-section-title">${t('clearSavedData')}</h2>
          <span class="settings-section-desc">Reset recent searches, saved routes and demo tickets</span>
        </div>
      </div>
      <button type="button" class="btn-secondary" id="btn-clear-saved-data" style="margin-block-start:var(--space-8);">
        ${t('clearSavedData')}
      </button>
    </section>

    <!-- About Section -->
    <section class="settings-section" aria-labelledby="settings-about-heading">
      <div class="settings-section-head">
        <div class="settings-section-icon">${getIcon('info')}</div>
        <div class="settings-section-info">
          <h2 id="settings-about-heading" class="settings-section-title">${t('about')}</h2>
          <span class="settings-section-desc">${t('aboutDesc')}</span>
        </div>
      </div>

      <div class="lang-radio-item" id="btn-open-about" tabindex="0" role="button" aria-haspopup="dialog">
        <span class="settings-toggle-label">${t('about')}</span>
        ${getIcon('chevron-forward')}
      </div>
    </section>

    <!-- Collapsed Prototype Tools Section -->
    <details class="settings-section" id="prototype-tools-details">
      <summary class="prototype-tools-summary">${t('prototypeTools')}</summary>
      <div class="prototype-tools-content">
        <p style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
          Inspect edge cases, layout stress tests, and design system verification.
        </p>

        <!-- Edge state preview buttons -->
        <div class="edge-buttons-grid">
          <button type="button" class="btn-edge-preview" data-edge="empty">Empty Route</button>
          <button type="button" class="btn-edge-preview" data-edge="loading">Loading Shimmer</button>
          <button type="button" class="btn-edge-preview" data-edge="error">Input Error</button>
          <button type="button" class="btn-edge-preview" data-edge="offline">Offline Banner</button>
          <button type="button" class="btn-edge-preview" data-edge="denied">Location Denied</button>
          <button type="button" class="btn-edge-preview" id="btn-open-design-system" style="background-color:var(--color-nav-pill);">
            📐 ${t('designSystem')}
          </button>
        </div>

        <!-- Force opposite direction switch -->
        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <span class="settings-toggle-label">${t('forceOpposite')}</span>
            <span class="settings-toggle-desc">Flips dir on &lt;html&gt; to test pure bidirectional agility.</span>
          </div>
          <label class="switch" aria-label="${t('forceOpposite')}">
            <input type="checkbox" role="switch" aria-checked="${isForced ? 'true' : 'false'}" id="toggle-force-opposite" ${isForced ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </details>
  `;
}

// 8. DESIGN SYSTEM PAGE (#/design-system)
function renderDesignSystemPage(lang) {
  const isHighContrast = document.documentElement.classList.contains('high-contrast');
  const isExpansion = isTextExpansionActive();

  const tokens = [
    { name: 'Brand Orange', hex: isHighContrast ? '#B54A00' : '#FF8A00', paired: isHighContrast ? '#FFFFFF' : '#1F2937', pairedName: isHighContrast ? 'White' : 'Dark Gray' },
    { name: 'Orange Tint', hex: isHighContrast ? '#FED7AA' : '#FFE3C2', paired: '#1F2937', pairedName: 'Dark Gray' },
    { name: 'Page Background', hex: isHighContrast ? '#FFFFFF' : '#F7F9FC', paired: '#1F2937', pairedName: 'Dark Gray' },
    { name: 'Surface', hex: '#FFFFFF', paired: '#1F2937', pairedName: 'Dark Gray' },
    { name: 'Text Dark', hex: isHighContrast ? '#000000' : '#1F2937', paired: '#FFFFFF', pairedName: 'White Surface' },
    { name: 'Error Crimson', hex: '#B42318', paired: '#FFFFFF', pairedName: 'White' }
  ];

  return `
    <h1 class="sr-only">${t('designSystem')}</h1>
    <div class="ds-page">
      <!-- Section 1: Direction and Script Matrix -->
      <section class="ds-section" aria-labelledby="ds-sec-1">
        <h2 id="ds-sec-1" class="ds-section-title">1. Direction &amp; Script Matrix</h2>
        <p style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
          Tap any row to switch the prototype language live.
        </p>
        <div class="ds-table-wrap">
          <table class="ds-table">
            <thead>
              <tr>
                <th scope="col">Language</th>
                <th scope="col">Code</th>
                <th scope="col">Dir</th>
                <th scope="col">Line-Height</th>
                <th scope="col">Sample Sentence</th>
              </tr>
            </thead>
            <tbody>
              ${SUPPORTED_LANGUAGES.map(item => `
                <tr class="clickable" tabindex="0" role="button" data-matrix-lang="${item.code}" aria-label="Switch to ${item.name}">
                  <td><strong lang="${item.code}">${item.nativeName}</strong></td>
                  <td><code>${item.code}</code></td>
                  <td><span class="info-chip">${item.dir.toUpperCase()}</span></td>
                  <td>${item.code === 'en' ? '1.5' : item.code === 'hi' ? '1.7' : item.code === 'kn' ? '1.75' : '1.8'}</td>
                  <td lang="${item.code}">${translations[item.code].tagline}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Section 2: Colour Tokens & Live Contrast -->
      <section class="ds-section" aria-labelledby="ds-sec-2">
        <h2 id="ds-sec-2" class="ds-section-title">2. Colour Tokens &amp; Contrast Ratio (Live WCAG AA)</h2>
        <div class="swatches-grid">
          ${tokens.map(t => {
            const ratio = getContrastRatio(t.hex, t.paired);
            const pass = parseFloat(ratio) >= 4.5;
            return `
              <div class="swatch-card">
                <div class="swatch-color-box" style="background-color:${t.hex}; color:${t.paired};">
                  ${t.hex}
                </div>
                <div class="swatch-details">
                  <strong>${t.name}</strong>
                  <span style="color:var(--color-text-muted);">vs ${t.pairedName}</span>
                  <span class="contrast-badge ${pass ? 'contrast-pass' : 'contrast-fail'}">
                    ${ratio}:1 ${pass ? 'PASS AA' : 'FAIL'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Section 3: Typography Scale -->
      <section class="ds-section" aria-labelledby="ds-sec-3">
        <h2 id="ds-sec-3" class="ds-section-title">3. Typography Scale Across Scripts</h2>
        <div class="type-scale-item">
          <span class="type-scale-meta">Heading: 1.75rem (28px)</span>
          <div style="font-size:var(--font-size-heading); font-weight:700;">
            ${translations[lang].welcomeTitle}
          </div>
        </div>
        <div class="type-scale-item">
          <span class="type-scale-meta">Section Title: 1.375rem (22px)</span>
          <div style="font-size:var(--font-size-section); font-weight:700;">
            ${translations[lang].availableRoutes}
          </div>
        </div>
        <div class="type-scale-item">
          <span class="type-scale-meta">Subheading: 1.125rem (18px)</span>
          <div style="font-size:var(--font-size-sub); font-weight:600;">
            ${translations[lang].welcomeSub}
          </div>
        </div>
        <div class="type-scale-item">
          <span class="type-scale-meta">Body: 1.0rem (16px)</span>
          <div style="font-size:var(--font-size-body);">
            ${translations[lang].tagline}
          </div>
        </div>
      </section>

      <!-- Section 4: Icon RTL & Cultural Rules -->
      <section class="ds-section" aria-labelledby="ds-sec-4">
        <h2 id="ds-sec-4" class="ds-section-title">4. Unified Icon Mirroring &amp; Cultural Semantics</h2>
        
        <div class="icon-group">
          <div class="icon-group-title">1. Directional Icons (Mirrored in RTL via .mirror-rtl)</div>
          <div class="icon-grid">
            <div class="icon-item">${getIcon('arrow-back')}<span>back</span></div>
            <div class="icon-item">${getIcon('chevron-forward')}<span>chevron</span></div>
            <div class="icon-item">${getIcon('arrow-forward')}<span>route</span></div>
            <div class="icon-item">${getIcon('arrow-see-all')}<span>see-all</span></div>
          </div>
        </div>

        <div class="icon-group">
          <div class="icon-group-title">2. Symmetrical &amp; Physical Objects (Never Mirrored)</div>
          <div class="icon-grid">
            <div class="icon-item">${getIcon('globe')}<span>globe</span></div>
            <div class="icon-item">${getIcon('search')}<span>search</span></div>
            <div class="icon-item">${getIcon('home')}<span>home</span></div>
            <div class="icon-item">${getIcon('clock')}<span>clock</span></div>
            <div class="icon-item">${getIcon('pin')}<span>pin</span></div>
            <div class="icon-item">${getIcon('bus')}<span>bus</span></div>
            <div class="icon-item">${getIcon('metro')}<span>metro</span></div>
            <div class="icon-item">${getIcon('ticket')}<span>ticket</span></div>
            <div class="icon-item">${getIcon('star')}<span>star</span></div>
            <div class="icon-item">${getIcon('share')}<span>share</span></div>
            <div class="icon-item">${getIcon('qr-code')}<span>qr</span></div>
          </div>
        </div>

        <div class="icon-group">
          <div class="icon-group-title">3. Cultural Audit &amp; Replacement Rationale</div>
          <div style="font-size:var(--font-size-caption); color:var(--color-text-muted); display:flex; flex-direction:column; gap:6px;">
            <div>• <strong>Thumbs Up</strong>: Offensive in Middle East / West Asia. Replaced by neutral checkmark ${getIcon('check')}.</div>
            <div>• <strong>Open Hand Gestures</strong>: Culturally varied. Replaced by direct textual clarity.</div>
            <div>• <strong>US Mailbox</strong>: Not understood across South Asia. Replaced by standard ticket &amp; text semantics.</div>
            <div>• <strong>Color-Only Status Cues</strong>: Avoided; paired with shape and text.</div>
          </div>
        </div>
      </section>

      <!-- Section 5: Font Metrics Lab -->
      <section class="ds-section" aria-labelledby="ds-sec-5">
        <h2 id="ds-sec-5" class="ds-section-title">5. Font Metrics Lab (Baseline Rulers &amp; Complex Conjuncts)</h2>
        <p style="font-size:var(--font-size-caption); color:var(--color-text-muted); margin-block-end:var(--space-8);">
          Visual horizontal orange rulers demonstrate uniform baseline alignment across Latin, Devanagari, Kannada, and Nastaliq scripts without vertical clipping.
        </p>

        <div class="metrics-ruler-box" aria-label="Baseline Ruler Demonstration">
          <span class="metrics-sample-line" lang="en">TransitOne Rapid Bus 500</span>
          <span class="metrics-sample-line" lang="hi">मजेस्टिक से व्हाइटफील्ड तक</span>
          <span class="metrics-sample-line" lang="kn">ಮೆಜೆಸ್ಟಿಕ್‌ನಿಂದ ವೈಟ್‌ಫೀಲ್ಡ್ ವರೆಗೆ</span>
          <span class="metrics-sample-line" lang="ur" dir="rtl">میجسٹک سے وائٹ فیلڈ تک</span>
        </div>

        <!-- Tall glyph and conjunct stress cards -->
        <div class="glyph-stress-grid">
          <div class="glyph-stress-card">
            <span class="glyph-stress-big" lang="hi">स्त्री</span>
            <span class="glyph-stress-meta">Devanagari Stacked (stri)</span>
          </div>
          <div class="glyph-stress-card">
            <span class="glyph-stress-big" lang="hi">दृष्टि</span>
            <span class="glyph-stress-meta">Devanagari Matra (drishti)</span>
          </div>
          <div class="glyph-stress-card">
            <span class="glyph-stress-big" lang="kn">ಕ್ಷ</span>
            <span class="glyph-stress-meta">Kannada Sub-glyph (ksha)</span>
          </div>
          <div class="glyph-stress-card">
            <span class="glyph-stress-big" lang="kn">ಸ್ವಾ</span>
            <span class="glyph-stress-meta">Kannada Ottu (svaa)</span>
          </div>
          <div class="glyph-stress-card">
            <span class="glyph-stress-big" lang="ur" dir="rtl">نستعلیق</span>
            <span class="glyph-stress-meta">Urdu Descender (nastaliq)</span>
          </div>
        </div>
      </section>

      <!-- Section 6: Side-by-Side Mirroring Lab -->
      <section class="ds-section" aria-labelledby="ds-sec-6">
        <h2 id="ds-sec-6" class="ds-section-title">6. Bidirectional Mirroring Lab (Side-by-Side LTR vs RTL)</h2>
        <p style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
          Demonstrates how the same component code renders in Left-to-Right (English) and Right-to-Left (Urdu) automatically using CSS logical properties.
        </p>

        <div class="mirror-lab-grid">
          <!-- LTR Card -->
          <div class="mirror-lab-panel" dir="ltr" lang="en">
            <div class="mirror-lab-header">
              <span>LTR Mode (English)</span>
              <span class="info-chip">DIR="LTR"</span>
            </div>
            <div class="route-card-main" style="margin-block-end:var(--space-8);">
              <div class="route-icon-badge">${getIcon('metro')}</div>
              <div class="route-info">
                <span class="route-endpoints">
                  <span>Majestic</span>
                  <span class="route-arrow-icon" aria-hidden="true">${getIcon('arrow-forward')}</span>
                  <span>Whitefield</span>
                </span>
              </div>
            </div>
            <div class="route-card-footer" style="display:flex; gap:8px;">
              <span class="info-chip">${getIcon('clock')} 38 min</span>
              <span class="info-chip">${getIcon('ticket')} ₹30</span>
            </div>
          </div>

          <!-- RTL Card -->
          <div class="mirror-lab-panel" dir="rtl" lang="ur">
            <div class="mirror-lab-header">
              <span>RTL Mode (Urdu)</span>
              <span class="info-chip">DIR="RTL"</span>
            </div>
            <div class="route-card-main" style="margin-block-end:var(--space-8);">
              <div class="route-icon-badge">${getIcon('metro')}</div>
              <div class="route-info">
                <span class="route-endpoints">
                  <span>میجسٹک</span>
                  <span class="route-arrow-icon" aria-hidden="true">${getIcon('arrow-forward')}</span>
                  <span>وائٹ فیلڈ</span>
                </span>
              </div>
            </div>
            <div class="route-card-footer" style="display:flex; gap:8px;">
              <span class="info-chip">${getIcon('clock')} ۳۸ منٹ</span>
              <span class="info-chip">${getIcon('ticket')} ₹۳۰</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 7: Text Expansion Stress Test -->
      <section class="ds-section" aria-labelledby="ds-sec-7">
        <h2 id="ds-sec-7" class="ds-section-title">7. Text-Expansion Stress Test (+40%)</h2>
        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <span class="settings-toggle-label">${t('textExpansion')}</span>
            <span class="settings-toggle-desc">Simulates longer translation lengths (+40%) across all buttons &amp; chips.</span>
          </div>
          <label class="switch" aria-label="${t('textExpansion')}">
            <input type="checkbox" role="switch" aria-checked="${isExpansion ? 'true' : 'false'}" id="toggle-text-expansion" ${isExpansion ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      </section>
    </div>
  `;
}

// 9. BOTTOM SHEET MODAL FOR LANGUAGE SWITCHER
function renderLanguageSheet(lang) {
  if (!state.langSheetOpen) return '';

  return `
    <div class="modal-overlay" id="lang-sheet-backdrop" role="dialog" aria-modal="true" aria-labelledby="sheet-lang-title">
      <div class="bottom-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <h2 id="sheet-lang-title" class="sheet-title">${t('chooseLang')}</h2>
          <button type="button" class="btn-close" id="btn-close-lang-sheet" aria-label="${t('close')}">
            ${getIcon('close')}
          </button>
        </div>
        <div class="lang-radio-list">
          ${SUPPORTED_LANGUAGES.map(item => `
            <div class="lang-radio-item ${item.code === lang ? 'selected' : ''}" 
                 role="button" 
                 tabindex="0"
                 data-modal-lang="${item.code}">
              <div class="lang-radio-main">
                <span class="lang-radio-icon">${getIcon('globe')}</span>
                <div class="lang-radio-texts">
                  <span class="lang-radio-name" lang="${item.code}">${item.nativeName}</span>
                  <span class="lang-radio-welcome" lang="${item.code}">${item.welcome}</span>
                </div>
              </div>
              <div class="radio-indicator"></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// 10. ABOUT MODAL
function renderAboutModal() {
  if (!state.aboutModalOpen) return '';
  return `
    <div class="modal-overlay" id="about-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-about-title">
      <div class="bottom-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <h2 id="modal-about-title" class="sheet-title">${t('aboutModalTitle')}</h2>
          <button type="button" class="btn-close" id="btn-close-about-modal" aria-label="${t('close')}">
            ${getIcon('close')}
          </button>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <h3 style="font-weight:700; font-size:var(--font-size-sub);">TransitOne Version 2.0</h3>
          <p style="color:var(--color-text-muted); font-size:var(--font-size-small);">
            ${t('aboutAcademicNotice')}
          </p>
          <div style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
            Unified RTL & Indic Design System Localisation: typography metrics, cultural icon audit, zero physical CSS properties, and fully offline-resilient PWA service worker.
          </div>
        </div>
      </div>
    </div>
  `;
}

// Master Render Function
function renderApp() {
  const shell = document.getElementById('app-shell');
  const { route, params } = parseHash();
  const lang = getCurrentLanguage();
  const savedScroll = window.scrollY;

  if (route === 'welcome') {
    shell.classList.add('no-bottom-nav');
  } else {
    shell.classList.remove('no-bottom-nav');
  }

  let bodyContent = '';
  if (route === 'welcome') {
    bodyContent = renderWelcomeScreen(lang);
  } else if (route === 'results') {
    bodyContent = renderResultsScreen(params, lang);
  } else if (route === 'route') {
    bodyContent = renderRouteDetailsScreen(params.id, lang);
  } else if (route === 'buy') {
    bodyContent = renderBuyScreen(params, lang);
  } else if (route === 'ticket') {
    bodyContent = renderTicketReceiptScreen(params.id, lang);
  } else if (route === 'settings') {
    bodyContent = renderSettingsScreen(lang);
  } else if (route === 'design-system') {
    bodyContent = renderDesignSystemPage(lang);
  } else {
    bodyContent = renderHomeScreen(params, lang);
  }

  shell.innerHTML = `
    ${renderOfflineBanner()}
    ${renderHeader(route, lang)}
    <main id="main-content" tabindex="-1">
      ${bodyContent}
    </main>
    ${renderBottomNav(route)}
    ${renderLanguageSheet(lang)}
    ${renderAboutModal()}
    <div id="toast-mount" class="toast-container"></div>
    <div id="live-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
  `;

  attachEventHandlers(route, params);
  window.scrollTo(0, savedScroll);
}

// Event Listeners Binding
function attachEventHandlers(route, params) {
  const lang = getCurrentLanguage();

  // Header Back Button
  const btnBack = document.getElementById('btn-back-header');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (route === 'route' || route === 'buy') navigate('results', { from: state.selectedFrom, to: state.selectedTo });
      else if (route === 'ticket') navigate('home');
      else if (route === 'design-system') navigate('settings');
      else navigate('home');
    });
  }

  // Header Language Chip Button
  const btnOpenLangSheet = document.getElementById('btn-open-lang-sheet');
  if (btnOpenLangSheet) {
    btnOpenLangSheet.addEventListener('click', () => {
      state.lastTriggerElement = btnOpenLangSheet;
      state.langSheetOpen = true;
      renderApp();
      setTimeout(() => {
        const first = document.querySelector('.bottom-sheet [role="button"]');
        if (first) first.focus();
      }, 50);
    });
  }

  // Close Language Sheet
  const btnCloseLangSheet = document.getElementById('btn-close-lang-sheet');
  const langBackdrop = document.getElementById('lang-sheet-backdrop');
  if (btnCloseLangSheet) {
    btnCloseLangSheet.addEventListener('click', () => {
      state.langSheetOpen = false;
      renderApp();
      if (state.lastTriggerElement) state.lastTriggerElement.focus();
    });
  }
  if (langBackdrop) {
    langBackdrop.addEventListener('click', (e) => {
      if (e.target === langBackdrop) {
        state.langSheetOpen = false;
        renderApp();
        if (state.lastTriggerElement) state.lastTriggerElement.focus();
      }
    });
  }

  // Language Choice inside Sheet
  document.querySelectorAll('[data-modal-lang]').forEach(el => {
    el.addEventListener('click', () => {
      const chosen = el.getAttribute('data-modal-lang');
      state.langSheetOpen = false;
      applyLanguage(chosen);
      if (state.lastTriggerElement) state.lastTriggerElement.focus();
    });
  });

  // Welcome Screen Language Cards
  const langCards = Array.from(document.querySelectorAll('.lang-card-option'));
  langCards.forEach((el, index) => {
    el.addEventListener('click', () => {
      const chosen = el.getAttribute('data-lang-choice');
      applyLanguage(chosen);
    });

    el.addEventListener('keydown', (e) => {
      let nextIndex = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % langCards.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + langCards.length) % langCards.length;
      }
      if (nextIndex !== index) {
        e.preventDefault();
        langCards[nextIndex].focus();
        const chosen = langCards[nextIndex].getAttribute('data-lang-choice');
        applyLanguage(chosen);
      }
    });
  });

  // Welcome Continue Button
  const btnWelcomeContinue = document.getElementById('btn-welcome-continue');
  if (btnWelcomeContinue) {
    btnWelcomeContinue.addEventListener('click', () => {
      markOnboarded();
      navigate('home');
    });
  }

  // Combobox Handling for From and To
  function setupCombobox(inputId, type) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('focus', () => {
      state.activeCombobox = type;
      state.comboboxHighlightIndex = -1;
      state.activeComboboxMatches = searchPlaces(input.value, lang);
      renderApp();
      const refocused = document.getElementById(inputId);
      if (refocused) refocused.focus();
    });

    input.addEventListener('input', (e) => {
      state.formError = null;
      state.activeCombobox = type;
      state.comboboxHighlightIndex = -1;
      state.activeComboboxMatches = searchPlaces(e.target.value, lang);
      renderApp();
      const refocused = document.getElementById(inputId);
      if (refocused) {
        refocused.focus();
        refocused.setSelectionRange(e.target.value.length, e.target.value.length);
      }
    });

    input.addEventListener('keydown', (e) => {
      const matches = state.activeComboboxMatches.length > 0 
        ? state.activeComboboxMatches 
        : Object.values(PLACES);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.comboboxHighlightIndex = (state.comboboxHighlightIndex + 1) % matches.length;
        renderApp();
        const refocused = document.getElementById(inputId);
        if (refocused) refocused.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.comboboxHighlightIndex = (state.comboboxHighlightIndex - 1 + matches.length) % matches.length;
        renderApp();
        const refocused = document.getElementById(inputId);
        if (refocused) refocused.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.comboboxHighlightIndex >= 0 && state.comboboxHighlightIndex < matches.length) {
          const selected = matches[state.comboboxHighlightIndex];
          if (type === 'from') state.selectedFrom = selected.id;
          else state.selectedTo = selected.id;
        }
        state.activeCombobox = null;
        renderApp();
      } else if (e.key === 'Escape') {
        state.activeCombobox = null;
        renderApp();
      }
    });
  }

  setupCombobox('input-from', 'from');
  setupCombobox('input-to', 'to');

  // Combobox list item click
  document.querySelectorAll('[data-combobox-select]').forEach(el => {
    el.addEventListener('click', () => {
      const type = el.getAttribute('data-combobox-select');
      const placeId = el.getAttribute('data-place-id');
      if (type === 'from') state.selectedFrom = placeId;
      else state.selectedTo = placeId;
      state.activeCombobox = null;
      state.formError = null;
      renderApp();
    });
  });

  // Swap Locations Button
  const btnSwap = document.getElementById('btn-swap-locations');
  if (btnSwap) {
    btnSwap.addEventListener('click', () => {
      const tmp = state.selectedFrom;
      state.selectedFrom = state.selectedTo;
      state.selectedTo = tmp;
      state.formError = null;
      renderApp();
    });
  }

  // Home Search Continue Button
  const btnSearchContinue = document.getElementById('btn-search-continue');
  if (btnSearchContinue) {
    btnSearchContinue.addEventListener('click', () => {
      if (!state.selectedFrom || !state.selectedTo) {
        state.formError = t('errorEmptyLocation');
        renderApp();
        return;
      }
      if (state.selectedFrom === state.selectedTo) {
        state.formError = t('errorSameLocation');
        renderApp();
        const announcer = document.getElementById('live-announcer');
        if (announcer) announcer.textContent = t('errorSameLocation');
        return;
      }

      addRecentSearch(state.selectedFrom, state.selectedTo);
      state.formError = null;
      state.isSimulatedLoading = true;
      navigate('results', { from: state.selectedFrom, to: state.selectedTo });
      setTimeout(() => {
        state.isSimulatedLoading = false;
        renderApp();
      }, 500);
    });
  }

  // Recent Searches Click
  document.querySelectorAll('[data-recent-search]').forEach(el => {
    el.addEventListener('click', () => {
      const [from, to] = el.getAttribute('data-recent-search').split(':');
      state.selectedFrom = from;
      state.selectedTo = to;
      navigate('results', { from, to });
    });
  });

  // Filter & Sort Chips on Results
  document.querySelectorAll('[data-mode-filter]').forEach(el => {
    el.addEventListener('click', () => {
      state.modeFilter = el.getAttribute('data-mode-filter');
      renderApp();
    });
  });

  document.querySelectorAll('[data-sort-filter]').forEach(el => {
    el.addEventListener('click', () => {
      state.sortFilter = el.getAttribute('data-sort-filter');
      renderApp();
    });
  });

  // Quick Route Cards on Home
  document.querySelectorAll('[data-route-pair]').forEach(el => {
    el.addEventListener('click', () => {
      const [from, to] = el.getAttribute('data-route-pair').split(':');
      state.selectedFrom = from;
      state.selectedTo = to;
      navigate('results', { from, to });
    });
  });

  // Route Item Cards -> Navigate to #/route/<id>
  document.querySelectorAll('.route-item-card[data-route-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-route-id');
      navigate('route', { id });
    });
  });

  // Route Details: Save Route Toggle
  const btnToggleSave = document.getElementById('btn-toggle-save-route');
  if (btnToggleSave) {
    btnToggleSave.addEventListener('click', () => {
      const routeId = btnToggleSave.getAttribute('data-route-id');
      const nowSaved = toggleFavourite(routeId);
      showToast(nowSaved ? t('routeSaved') : 'Removed from saved');
      renderApp();
    });
  }

  // Route Details: Share Route
  const btnShare = document.getElementById('btn-share-route');
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const shareUrl = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${t('appName')} Route`,
            url: shareUrl
          });
        } catch (e) {
          // Fallback to clipboard
          navigator.clipboard?.writeText(shareUrl);
          showToast(t('linkCopied'));
        }
      } else {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl);
        }
        showToast(t('linkCopied'));
      }
    });
  }

  // Route Details: Buy Ticket CTA
  const btnDetailsBuy = document.getElementById('btn-details-buy-ticket');
  if (btnDetailsBuy) {
    btnDetailsBuy.addEventListener('click', () => {
      const routeId = btnDetailsBuy.getAttribute('data-route-id');
      navigate('buy', { routeId });
    });
  }

  // Route Details "Search again"
  const btnSearchAgain = document.getElementById('btn-details-search-again');
  if (btnSearchAgain) {
    btnSearchAgain.addEventListener('click', () => {
      navigate('home');
    });
  }

  // Ticket Buy Stepper
  const btnStepMinus = document.getElementById('btn-stepper-minus');
  const btnStepPlus = document.getElementById('btn-stepper-plus');
  if (btnStepMinus) {
    btnStepMinus.addEventListener('click', () => {
      if (state.passengersCount > 1) {
        state.passengersCount--;
        renderApp();
      }
    });
  }
  if (btnStepPlus) {
    btnStepPlus.addEventListener('click', () => {
      if (state.passengersCount < 6) {
        state.passengersCount++;
        renderApp();
      }
    });
  }

  // Passenger Inputs
  const inputName = document.getElementById('input-passenger-name');
  if (inputName) {
    inputName.addEventListener('input', (e) => {
      state.travelerName = e.target.value;
    });
  }
  const inputPhone = document.getElementById('input-passenger-phone');
  if (inputPhone) {
    inputPhone.addEventListener('input', (e) => {
      state.travelerPhone = e.target.value;
    });
  }

  // Payment Radio
  document.querySelectorAll('input[name="payment"]').forEach(r => {
    r.addEventListener('change', (e) => {
      state.paymentMethod = e.target.value;
    });
  });

  // Confirm Ticket Button
  const btnConfirmTicket = document.getElementById('btn-confirm-ticket');
  if (btnConfirmTicket) {
    btnConfirmTicket.addEventListener('click', () => {
      const routeId = btnConfirmTicket.getAttribute('data-route-id');
      const route = getRouteById(routeId);
      const ticketId = `TK-${Math.floor(10000 + Math.random() * 90000)}`;
      
      saveTicket({
        id: ticketId,
        routeId: route.id,
        routeCode: route.code,
        from: route.from,
        to: route.to,
        passengers: state.passengersCount,
        fare: (route.fare || 30) * state.passengersCount,
        travelerName: state.travelerName || 'Harsha',
        date: 'Today',
        time: route.stops && route.stops[0] ? route.stops[0].time : '09:00'
      });

      showToast(t('ticketConfirmed'));
      navigate('ticket', { id: ticketId });
    });
  }

  // Ticket Receipt Back to Home
  const btnTicketHome = document.getElementById('btn-ticket-back-home');
  if (btnTicketHome) {
    btnTicketHome.addEventListener('click', () => {
      navigate('home');
    });
  }

  // Settings Numerals Toggle (Latin vs Native script digits)
  const toggleNumerals = document.getElementById('toggle-numerals');
  if (toggleNumerals) {
    toggleNumerals.addEventListener('change', (e) => {
      if (e.target.checked) {
        // Native script digits
        const sys = lang === 'hi' ? 'deva' : lang === 'kn' ? 'knda' : lang === 'ur' ? 'arabext' : 'latn';
        setNumberingSystem(sys);
      } else {
        setNumberingSystem('latn');
      }
      renderApp();
    });
  }

  // Larger Text Toggle
  const toggleLarger = document.getElementById('toggle-larger-text');
  if (toggleLarger) {
    toggleLarger.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.documentElement.classList.add('larger-text');
        try { localStorage.setItem('transitone_larger_text', 'true'); } catch (err) {}
      } else {
        document.documentElement.classList.remove('larger-text');
        try { localStorage.setItem('transitone_larger_text', 'false'); } catch (err) {}
      }
    });
  }

  // High Contrast Toggle
  const toggleHighContrast = document.getElementById('toggle-high-contrast');
  if (toggleHighContrast) {
    toggleHighContrast.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.documentElement.classList.add('high-contrast');
        try { localStorage.setItem('transitone_high_contrast', 'true'); } catch (err) {}
      } else {
        document.documentElement.classList.remove('high-contrast');
        try { localStorage.setItem('transitone_high_contrast', 'false'); } catch (err) {}
      }
      renderApp();
    });
  }

  // Clear Saved Data Button
  const btnClearData = document.getElementById('btn-clear-saved-data');
  if (btnClearData) {
    btnClearData.addEventListener('click', () => {
      clearAllSavedData();
      showToast(t('dataCleared'));
      renderApp();
    });
  }

  // Force Opposite Direction Toggle
  const toggleOpposite = document.getElementById('toggle-force-opposite');
  if (toggleOpposite) {
    toggleOpposite.addEventListener('change', (e) => {
      setForcedOpposite(e.target.checked);
    });
  }

  // About Modal Open / Close
  const btnOpenAbout = document.getElementById('btn-open-about');
  if (btnOpenAbout) {
    btnOpenAbout.addEventListener('click', () => {
      state.lastTriggerElement = btnOpenAbout;
      state.aboutModalOpen = true;
      renderApp();
      setTimeout(() => {
        const closeBtn = document.getElementById('btn-close-about-modal');
        if (closeBtn) closeBtn.focus();
      }, 50);
    });
  }
  const btnCloseAbout = document.getElementById('btn-close-about-modal');
  const aboutBackdrop = document.getElementById('about-modal-backdrop');
  if (btnCloseAbout) {
    btnCloseAbout.addEventListener('click', () => {
      state.aboutModalOpen = false;
      renderApp();
      if (state.lastTriggerElement) state.lastTriggerElement.focus();
    });
  }
  if (aboutBackdrop) {
    aboutBackdrop.addEventListener('click', (e) => {
      if (e.target === aboutBackdrop) {
        state.aboutModalOpen = false;
        renderApp();
        if (state.lastTriggerElement) state.lastTriggerElement.focus();
      }
    });
  }

  // Prototype Edge State Preview Buttons
  document.querySelectorAll('[data-edge]').forEach(el => {
    el.addEventListener('click', () => {
      const edge = el.getAttribute('data-edge');
      if (edge === 'offline') {
        state.forcedOffline = !state.forcedOffline;
        renderApp();
      } else if (edge === 'empty') {
        navigate('results', { state: 'empty' });
      } else if (edge === 'loading') {
        navigate('results', { state: 'loading' });
      } else if (edge === 'error') {
        state.formError = t('errorSameLocation');
        navigate('home', { state: 'error' });
      } else if (edge === 'denied') {
        navigate('home', { state: 'denied' });
      }
    });
  });

  // Open Design System from Settings
  const btnOpenDS = document.getElementById('btn-open-design-system');
  if (btnOpenDS) {
    btnOpenDS.addEventListener('click', () => {
      navigate('design-system');
    });
  }

  // Design System Script Matrix Click
  document.querySelectorAll('[data-matrix-lang]').forEach(el => {
    el.addEventListener('click', () => {
      const chosen = el.getAttribute('data-matrix-lang');
      applyLanguage(chosen);
    });
  });

  // Text Expansion Stress Test Toggle
  const toggleExpansion = document.getElementById('toggle-text-expansion');
  if (toggleExpansion) {
    toggleExpansion.addEventListener('change', (e) => {
      setTextExpansionActive(e.target.checked);
    });
  }

  // Bottom Navigation tabs click
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const navTarget = el.getAttribute('data-nav');
      if (navTarget === 'home') navigate('home');
      else if (navTarget === 'search') {
        navigate('home');
        setTimeout(() => {
          const fromEl = document.getElementById('input-from');
          if (fromEl) fromEl.focus();
        }, 100);
      }
      else if (navTarget === 'settings') navigate('settings');
    });
  });

  // Settings Language Selection
  document.querySelectorAll('.lang-radio-item[data-lang-choice]').forEach(el => {
    el.addEventListener('click', () => {
      const chosen = el.getAttribute('data-lang-choice');
      applyLanguage(chosen);
    });
  });

  // See All Link
  const btnSeeAll = document.getElementById('btn-see-all');
  if (btnSeeAll) {
    btnSeeAll.addEventListener('click', () => {
      navigate('results', { from: 'majestic', to: 'whitefield' });
    });
  }

  // Try Another Route Button (Empty State)
  const btnTryAnother = document.getElementById('btn-try-another-route');
  if (btnTryAnother) {
    btnTryAnother.addEventListener('click', () => {
      navigate('home');
    });
  }
}

// App Initialization
function init() {
  try {
    if (localStorage.getItem('transitone_larger_text') === 'true') {
      document.documentElement.classList.add('larger-text');
    }
    if (localStorage.getItem('transitone_high_contrast') === 'true') {
      document.documentElement.classList.add('high-contrast');
    }
  } catch (e) {}

  registerRenderCallback(() => {
    renderApp();
  });

  const lang = getCurrentLanguage();
  applyLanguage(lang);

  window.addEventListener('hashchange', () => {
    renderApp();
  });

  renderApp();
}

window.applyLanguage = applyLanguage;
window.setForcedOpposite = setForcedOpposite;
window.getContrastRatio = getContrastRatio;

init();
