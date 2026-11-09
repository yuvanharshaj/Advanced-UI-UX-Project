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
  findRoutes,
  getRouteById
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

// Application State
const state = {
  selectedFrom: 'majestic',
  selectedTo: 'whitefield',
  formError: null,
  langSheetOpen: false,
  aboutModalOpen: false,
  isSimulatedLoading: false,
  forcedOffline: false,
  lastTriggerElement: null
};

// Listen to native online/offline status
window.addEventListener('online', () => renderApp());
window.addEventListener('offline', () => renderApp());

// Global Escape Key Listener for Modals / Bottom Sheets (WCAG 2.2 focus return)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.langSheetOpen) {
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

// Format Station Name safely in <bdi>
function renderPlace(placeId, lang) {
  const name = getPlaceName(placeId, lang);
  return `<bdi>${name}</bdi>`;
}

// Render Header
function renderHeader(currentRoute, lang) {
  if (currentRoute === 'welcome') {
    return `
      <header class="app-header" role="banner">
        <div class="brand-badge">
          <img src="assets/logo.svg" alt="TransitOne" width="36" height="36" />
          <div class="brand-info">
            <span class="brand-name">TransitOne</span>
            <span class="brand-tagline">${t('tagline')}</span>
          </div>
        </div>
      </header>
    `;
  }

  if (currentRoute === 'results' || currentRoute === 'route' || currentRoute === 'settings' || currentRoute === 'design-system') {
    let titleText = t('availableRoutes');
    if (currentRoute === 'settings') titleText = t('navSettings');
    if (currentRoute === 'route') titleText = t('stopsTimeline');
    if (currentRoute === 'design-system') titleText = t('designSystem');

    return `
      <header class="app-header" role="banner">
        <div class="header-with-back">
          <button type="button" class="back-button" id="btn-back-header" aria-label="${t('back')}">
            ${getIcon('arrow-back')}
            <span>${titleText}</span>
          </button>
          ${renderLangChip(lang)}
        </div>
      </header>
    `;
  }

  // Home Screen Top Bar
  return `
    <header class="app-header" role="banner">
      <div class="brand-badge">
        <img src="assets/logo.svg" alt="TransitOne" width="36" height="36" />
        <div class="brand-info">
          <span class="brand-name">TransitOne</span>
          <span class="brand-tagline">${t('tagline')}</span>
        </div>
      </div>
      ${renderLangChip(lang)}
    </header>
  `;
}

// Pink-tinted Language Chip at inline-end
function renderLangChip(lang) {
  const curr = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  return `
    <button type="button" class="lang-chip-btn" id="btn-open-lang-sheet" aria-haspopup="dialog" aria-expanded="${state.langSheetOpen ? 'true' : 'false'}" aria-label="${t('language')}: ${curr.nativeName}">
      ${getIcon('globe')}
      <span lang="${curr.code}">${curr.nativeName}</span>
      ${getIcon('chevron-down')}
    </button>
  `;
}

// Offline Banner
function renderOfflineBanner() {
  const isOffline = !navigator.onLine || state.forcedOffline;
  if (!isOffline) return '';
  return `
    <div class="offline-banner" role="status" aria-live="assertive">
      ${getIcon('wifi-off')}
      <span>${t('offlineBanner')}</span>
    </div>
  `;
}

// Bottom Navigation
function renderBottomNav(currentRoute) {
  if (currentRoute === 'welcome') return '';

  const isHome = currentRoute === 'home';
  const isSearch = currentRoute === 'results' || currentRoute === 'route';
  const isSettings = currentRoute === 'settings' || currentRoute === 'design-system';

  return `
    <nav class="bottom-nav" aria-label="Main Navigation">
      <button type="button" class="nav-tab ${isHome ? 'active' : ''}" data-nav="home" aria-current="${isHome ? 'page' : 'false'}">
        ${getIcon('home')}
        <span>${t('navHome')}</span>
      </button>
      <button type="button" class="nav-tab ${isSearch ? 'active' : ''}" data-nav="search" aria-current="${isSearch ? 'page' : 'false'}">
        ${getIcon('search')}
        <span>${t('navSearch')}</span>
      </button>
      <button type="button" class="nav-tab ${isSettings ? 'active' : ''}" data-nav="settings" aria-current="${isSettings ? 'page' : 'false'}">
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

// 2. HOME SCREEN
function renderHomeScreen(params, lang) {
  const placeKeys = Object.keys(PLACES);
  const isDenied = params.state === 'denied';
  const hasError = state.formError || params.state === 'error';

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
        <div class="white-input-field ${hasError ? 'has-error' : ''}">
          <span class="white-input-field-icon" aria-hidden="true">${getIcon('pin-dot')}</span>
          <label class="white-input-field-label" for="input-from">${t('from')}</label>
          <input list="places-list" id="input-from" class="white-editable-input" 
                 value="${getPlaceName(state.selectedFrom, lang)}" 
                 aria-invalid="${hasError ? 'true' : 'false'}"
                 placeholder="${t('from')}" />
        </div>

        <button type="button" class="btn-white-swap" id="btn-swap-locations" aria-label="${t('swapLocations')}">
          ${getIcon('swap-vertical')}
        </button>

        <div class="white-input-field ${hasError ? 'has-error' : ''}">
          <span class="white-input-field-icon" aria-hidden="true">${getIcon('pin')}</span>
          <label class="white-input-field-label" for="input-to">${t('to')}</label>
          <input list="places-list" id="input-to" class="white-editable-input" 
                 value="${getPlaceName(state.selectedTo, lang)}" 
                 aria-invalid="${hasError ? 'true' : 'false'}"
                 placeholder="${t('to')}" />
        </div>

        <datalist id="places-list">
          ${placeKeys.map(k => `<option value="${getPlaceName(k, lang)}" data-key="${k}"></option>`).join('')}
        </datalist>
      </div>

      <button type="button" class="btn-primary" id="btn-search-continue">
        ${t('continue')}
      </button>
    </section>

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

// 3. RESULTS SCREEN
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

  let routes = findRoutes(fromKey, toKey);
  if (isExplicitEmpty || (!routes || routes.length === 0)) {
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

    <!-- Route Cards List -->
    <div class="results-list" role="feed" aria-label="${t('availableRoutes')}">
      ${routes.map((r, idx) => {
        const isFirst = idx === 0;
        const iconName = r.mode === 'metro' ? 'metro' : 'bus';
        return `
          <article class="route-item-card ${isFirst ? 'highlight-orange' : ''}" 
                   data-route-id="${r.id}" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${r.code}, ${getPlaceName(r.from, lang)} ${t('to')} ${getPlaceName(r.to, lang)}, ${r.durationMin} ${t('min')}, ₹${r.fare}">
            <div class="route-card-header">
              <div class="route-card-lead">
                <div class="route-mode-tile">${getIcon(iconName)}</div>
                <div class="route-card-headings">
                  <span class="route-card-code"><bdi>${r.code}</bdi></span>
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
                <span>${r.durationMin} ${t('min')}</span>
              </span>
              <span class="info-chip">
                ${getIcon('pin-dot')}
                <span>${r.stopsCount} ${t('stops')}</span>
              </span>
              <span class="info-chip chip-fare">
                ${getIcon('ticket')}
                <span>₹${r.fare}</span>
              </span>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

// 4. ROUTE DETAILS SCREEN (#/route/<id>)
function renderRouteDetailsScreen(routeId, lang) {
  const route = getRouteById(routeId);
  const iconName = route.mode === 'metro' ? 'metro' : 'bus';

  return `
    <h1 class="sr-only">${t('stopsTimeline')}</h1>
    <div class="details-summary-card">
      <div class="details-summary-head">
        <div class="route-card-lead">
          <div class="route-mode-tile">${getIcon(iconName)}</div>
          <span class="details-route-code"><bdi>${route.code}</bdi></span>
        </div>
        <div class="departure-chip">
          <span>${t('nextDeparture')}:</span>
          <strong>${route.nextDeparture}</strong>
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
          <span>${route.durationMin} ${t('min')}</span>
        </span>
        <span class="info-chip">
          ${getIcon('pin-dot')}
          <span>${route.stopsCount} ${t('stops')}</span>
        </span>
        <span class="info-chip chip-fare">
          ${getIcon('ticket')}
          <span>₹${route.fare}</span>
        </span>
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

    <button type="button" class="btn-secondary" id="btn-details-search-again">
      ${t('searchAgain')}
    </button>
  `;
}

// 5. SETTINGS SCREEN
function renderSettingsScreen(lang) {
  const isLarger = document.documentElement.classList.contains('larger-text');
  const isHighContrast = document.documentElement.classList.contains('high-contrast');
  const isForced = isForcedOpposite();

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

// 6. DESIGN SYSTEM PAGE (#/design-system)
function renderDesignSystemPage(lang) {
  const isHighContrast = document.documentElement.classList.contains('high-contrast');
  const isExpansion = isTextExpansionActive();

  // Dynamic Live Color Tokens & Contrast Calculation
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
        <div class="type-scale-item">
          <span class="type-scale-meta">Small: 0.875rem (14px)</span>
          <div style="font-size:var(--font-size-small); color:var(--color-text-muted);">
            ${translations[lang].changeAnytime}
          </div>
        </div>
        <div class="type-scale-item">
          <span class="type-scale-meta">Caption: 0.75rem (12px)</span>
          <div style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
            ${translations[lang].aboutDesc}
          </div>
        </div>
      </section>

      <!-- Section 4: Spacing & Layout Rules -->
      <section class="ds-section" aria-labelledby="ds-sec-4">
        <h2 id="ds-sec-4" class="ds-section-title">4. Spacing Scale &amp; Radii Rules</h2>
        ${[4, 8, 12, 16, 24, 32].map(s => `
          <div class="spacing-scale-row">
            <span class="spacing-label">${s}px</span>
            <div class="spacing-bar" style="inline-size:${s * 4}px;"></div>
          </div>
        `).join('')}

        <div style="margin-block-start:var(--space-12); font-size:var(--font-size-small);">
          <strong>Architectural Rules:</strong>
          <ul style="padding-inline-start:20px; margin-block-start:6px; display:flex; flex-direction:column; gap:4px;">
            <li>CSS Logical Properties ONLY (margin-inline-start, padding-inline, text-align:start).</li>
            <li>Zero physical left/right properties across stylesheet.</li>
            <li>No fixed heights on text containers (prevents Indic conjunct clipping).</li>
            <li>Strict 44x44px minimum touch targets on all interactive controls.</li>
          </ul>
        </div>
      </section>

      <!-- Section 5: Icon RTL & Cultural Rules -->
      <section class="ds-section" aria-labelledby="ds-sec-5">
        <h2 id="ds-sec-5" class="ds-section-title">5. Icon RTL &amp; Cultural Rules</h2>
        
        <div class="icon-group">
          <div class="icon-group-title">1. Mirrored in RTL (Directional Navigation)</div>
          <p style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
            Flipped because reading direction and chronological progression reverses.
          </p>
          <div class="icon-grid">
            <div class="icon-item">${getIcon('arrow-back')}<span>back</span></div>
            <div class="icon-item">${getIcon('chevron-forward')}<span>chevron</span></div>
            <div class="icon-item">${getIcon('arrow-forward')}<span>route</span></div>
            <div class="icon-item">${getIcon('arrow-see-all')}<span>see-all</span></div>
          </div>
        </div>

        <div class="icon-group">
          <div class="icon-group-title">2. Never Mirrored (Symmetrical &amp; Physical Realities)</div>
          <p style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
            Clockwise time, search lens orientation, and physical vehicles do not mirror.
          </p>
          <div class="icon-grid">
            <div class="icon-item">${getIcon('globe')}<span>globe</span></div>
            <div class="icon-item">${getIcon('search')}<span>search</span></div>
            <div class="icon-item">${getIcon('home')}<span>home</span></div>
            <div class="icon-item">${getIcon('settings')}<span>settings</span></div>
            <div class="icon-item">${getIcon('clock')}<span>clock</span></div>
            <div class="icon-item">${getIcon('pin')}<span>pin</span></div>
            <div class="icon-item">${getIcon('swap-vertical')}<span>swap</span></div>
            <div class="icon-item">${getIcon('bus')}<span>bus</span></div>
          </div>
        </div>

        <div class="icon-group">
          <div class="icon-group-title">3. Culturally Sensitive (Replaced with Neutral Symbols)</div>
          <div style="font-size:var(--font-size-caption); color:var(--color-text-muted); display:flex; flex-direction:column; gap:6px;">
            <div>• <strong>Thumbs-up gesture</strong>: Offensive in Middle East / West Asia. Use checkmark ${getIcon('check')}.</div>
            <div>• <strong>Open palm / Hand gestures</strong>: Sign of insult or halt across Mediterranean/Arab cultures. Use clear text.</div>
            <div>• <strong>US Curbside Mailbox</strong>: Not understood outside North America. Use envelope or text.</div>
            <div>• <strong>Color-only status</strong>: Red/green colorblindness and cultural variances. Always pair with icons.</div>
          </div>
        </div>
      </section>

      <!-- Section 6: Components & States Matrix -->
      <section class="ds-section" aria-labelledby="ds-sec-6">
        <h2 id="ds-sec-6" class="ds-section-title">6. Components &amp; State Matrix</h2>
        
        <div class="component-state-row">
          <span class="state-label">Primary Button (Default, Hover, Active, Disabled)</span>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button type="button" class="btn-primary">${t('continue')}</button>
            <button type="button" class="btn-primary is-hover">${t('continue')} (Hover state)</button>
            <button type="button" class="btn-primary is-active">${t('continue')} (Active state)</button>
            <button type="button" class="btn-primary is-disabled" disabled>${t('continue')} (Disabled)</button>
          </div>
        </div>

        <div class="component-state-row">
          <span class="state-label">White Search Input (Default, Focus, Error)</span>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div class="white-input-field">
              <span class="white-input-field-icon">${getIcon('pin-dot')}</span>
              <span class="white-input-field-label">${t('from')}</span>
              <input class="white-editable-input" value="Majestic" readonly aria-label="${t('from')} preview" />
            </div>
            <div class="white-input-field is-focus">
              <span class="white-input-field-icon">${getIcon('pin-dot')}</span>
              <span class="white-input-field-label">${t('from')}</span>
              <input class="white-editable-input" value="Majestic (Focused)" readonly aria-label="${t('from')} focused preview" />
            </div>
            <div class="white-input-field is-error">
              <span class="white-input-field-icon" style="color:var(--color-error);">${getIcon('alert-circle')}</span>
              <span class="white-input-field-label">${t('from')}</span>
              <input class="white-editable-input" value="Invalid input" readonly aria-label="${t('from')} error preview" />
            </div>
          </div>
        </div>
      </section>

      <!-- Section 7: Bidirectional Text Examples -->
      <section class="ds-section" aria-labelledby="ds-sec-7">
        <h2 id="ds-sec-7" class="ds-section-title">7. Bidirectional Text Isolation (&lt;bdi&gt;)</h2>
        <p style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
          Without isolation, LTR route codes inside RTL Urdu flip punctuation and order improperly.
        </p>

        <div class="bidi-sample-card">
          <span class="bidi-title">1. Route code inside Urdu sentence:</span>
          <div class="bidi-broken" dir="rtl">خراب: بس Bus 500 روانہ ہو چکی ہے!</div>
          <div class="bidi-fixed" dir="rtl">درست: بس <bdi>Bus 500</bdi> روانہ ہو چکی ہے!</div>
        </div>

        <div class="bidi-sample-card">
          <span class="bidi-title">2. Phone Number Isolation:</span>
          <div class="bidi-broken" dir="rtl">خراب: +91 80 2235 2200 ہیلپ لائن</div>
          <div class="bidi-fixed" dir="rtl">درست: <bdi>+91 80 2235 2200</bdi> ہیلپ لائن</div>
        </div>

        <div class="bidi-sample-card">
          <span class="bidi-title">3. Rupee Fare Isolation:</span>
          <div class="bidi-broken" dir="rtl">خراب: کل کرایہ ₹30 ہے</div>
          <div class="bidi-fixed" dir="rtl">درست: کل کرایہ <bdi>₹30</bdi> ہے</div>
        </div>

        <div class="bidi-sample-card">
          <span class="bidi-title">4. Mixed Hindi-English corridor:</span>
          <div>मजेस्टिक से <bdi>Metro M1</bdi> द्वारा व्हाइटफील्ड</div>
        </div>
      </section>

      <!-- Section 8: Text Expansion Stress Test -->
      <section class="ds-section" aria-labelledby="ds-sec-8">
        <h2 id="ds-sec-8" class="ds-section-title">8. Text-Expansion Stress Test (+40%)</h2>
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

// 7. BOTTOM SHEET MODAL FOR LANGUAGE SWITCHER
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

// 8. ABOUT MODAL
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
          <h3 style="font-weight:700; font-size:var(--font-size-sub);">TransitOne Version 1.0</h3>
          <p style="color:var(--color-text-muted); font-size:var(--font-size-small);">
            ${t('aboutAcademicNotice')}
          </p>
          <div style="font-size:var(--font-size-caption); color:var(--color-text-muted);">
            WCAG AA dark-text contrast, 44px touch targets, logical CSS properties only, and seamless RTL/Indic script integration.
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
    <div id="live-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
  `;

  attachEventHandlers(route, params);
  window.scrollTo(0, savedScroll);
}

// Event Listeners Binding
function attachEventHandlers(route, params) {
  // Back button in header
  const btnBack = document.getElementById('btn-back-header');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (route === 'route') navigate('results', { from: state.selectedFrom, to: state.selectedTo });
      else if (route === 'design-system') navigate('settings');
      else navigate('home');
    });
  }

  // Language Chip Button
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

  // Welcome Screen Language Cards with Keyboard Navigation
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

  // Home Screen Inputs
  const inputFrom = document.getElementById('input-from');
  const inputTo = document.getElementById('input-to');
  if (inputFrom) {
    inputFrom.addEventListener('input', (e) => {
      state.formError = null;
      const val = e.target.value.trim().toLowerCase();
      for (const [k, obj] of Object.entries(PLACES)) {
        if (Object.values(obj).some(v => typeof v === 'string' && v.toLowerCase() === val)) {
          state.selectedFrom = k;
          break;
        }
      }
    });
  }
  if (inputTo) {
    inputTo.addEventListener('input', (e) => {
      state.formError = null;
      const val = e.target.value.trim().toLowerCase();
      for (const [k, obj] of Object.entries(PLACES)) {
        if (Object.values(obj).some(v => typeof v === 'string' && v.toLowerCase() === val)) {
          state.selectedTo = k;
          break;
        }
      }
    });
  }

  // Swap Button
  const btnSwap = document.getElementById('btn-swap-locations');
  if (btnSwap) {
    btnSwap.addEventListener('click', () => {
      const tmp = state.selectedFrom;
      state.selectedFrom = state.selectedTo;
      state.selectedTo = tmp;
      if (inputFrom && inputTo) {
        const lang = getCurrentLanguage();
        inputFrom.value = getPlaceName(state.selectedFrom, lang);
        inputTo.value = getPlaceName(state.selectedTo, lang);
      }
    });
  }

  // Home Search Continue Button (Validates From !== To, shows ~600ms skeleton)
  const btnSearchContinue = document.getElementById('btn-search-continue');
  if (btnSearchContinue) {
    btnSearchContinue.addEventListener('click', () => {
      if (state.selectedFrom === state.selectedTo) {
        state.formError = t('errorSameLocation');
        renderApp();
        const announcer = document.getElementById('live-announcer');
        if (announcer) announcer.textContent = t('errorSameLocation');
        if (inputFrom) inputFrom.focus();
        return;
      }

      state.formError = null;
      state.isSimulatedLoading = true;
      navigate('results', { from: state.selectedFrom, to: state.selectedTo });
      setTimeout(() => {
        state.isSimulatedLoading = false;
        renderApp();
      }, 600);
    });
  }

  // Location Denied "Enter location manually" button
  const btnFocusFrom = document.getElementById('btn-focus-from');
  if (btnFocusFrom && inputFrom) {
    btnFocusFrom.addEventListener('click', () => {
      inputFrom.focus();
    });
  }

  // See All Link
  const btnSeeAll = document.getElementById('btn-see-all');
  if (btnSeeAll) {
    btnSeeAll.addEventListener('click', () => {
      navigate('results', { from: 'majestic', to: 'whitefield' });
    });
  }

  // Quick Route Cards
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

  // Try Another Route Button (Empty State)
  const btnTryAnother = document.getElementById('btn-try-another-route');
  if (btnTryAnother) {
    btnTryAnother.addEventListener('click', () => {
      navigate('home');
    });
  }

  // Route Details "Search again" button
  const btnSearchAgain = document.getElementById('btn-details-search-again');
  if (btnSearchAgain) {
    btnSearchAgain.addEventListener('click', () => {
      navigate('home');
    });
  }

  // Settings Language Selection
  document.querySelectorAll('.lang-radio-item[data-lang-choice]').forEach(el => {
    el.addEventListener('click', () => {
      const chosen = el.getAttribute('data-lang-choice');
      applyLanguage(chosen);
    });
  });

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

  // Design System Script Matrix Click -> Switches Language
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
