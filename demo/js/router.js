/**
 * TransitOne - Router
 * Hash routes:
 *   #/welcome
 *   #/home
 *   #/results?from=&to=&state=&mode=&sort=
 *   #/route/<id>
 *   #/buy?routeId=<id>
 *   #/ticket/<id>
 *   #/settings
 *   #/design-system
 */

import { getStoredLanguage } from './i18n.js';

export function parseHash() {
  let hash = window.location.hash || '';
  if (hash.startsWith('#/')) {
    hash = hash.slice(2);
  } else if (hash.startsWith('#')) {
    hash = hash.slice(1);
  }

  const [routePart, queryPart] = hash.split('?');
  const params = {};
  
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const [key, val] of searchParams.entries()) {
      params[key] = val;
    }
  }

  let route = routePart || '';
  if (route.startsWith('route/')) {
    const id = route.replace('route/', '');
    route = 'route';
    params.id = id;
  } else if (route.startsWith('ticket/')) {
    const id = route.replace('ticket/', '');
    route = 'ticket';
    params.id = id;
  }

  if (!route) {
    route = getDefaultRoute();
  }

  return {
    route,
    params
  };
}

export function getDefaultRoute() {
  const savedLang = getStoredLanguage();
  if (!savedLang) {
    return 'welcome';
  }
  return 'home';
}

export function navigate(route, params = {}) {
  let path = route;
  if (route === 'route' && params.id) {
    path = `route/${params.id}`;
    const restParams = { ...params };
    delete restParams.id;
    const qs = Object.keys(restParams).length ? '?' + new URLSearchParams(restParams).toString() : '';
    window.location.hash = `#/${path}${qs}`;
    return;
  }

  if (route === 'ticket' && params.id) {
    path = `ticket/${params.id}`;
    const restParams = { ...params };
    delete restParams.id;
    const qs = Object.keys(restParams).length ? '?' + new URLSearchParams(restParams).toString() : '';
    window.location.hash = `#/${path}${qs}`;
    return;
  }

  const queryString = Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : '';
  window.location.hash = `#/${path}${queryString}`;
}

export function markOnboarded() {
  try {
    localStorage.setItem('transitone_onboarded', 'true');
  } catch (e) {
    // LocalStorage unavailable
  }
}
