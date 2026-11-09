/**
 * TransitOne - Unified SVG Icon Registry & Sprite Helpers
 * Single source of truth for 24px grid iconography and RTL mirroring behavior.
 */

export const ICON_REGISTRY = [
  // Directional Icons (Mirrored in RTL)
  { id: 'arrow-back', mirror: true, category: 'navigation', desc: 'Back navigation arrow', culturalNote: 'Mirrored in RTL to follow reverse chronological reading direction.' },
  { id: 'chevron-forward', mirror: true, category: 'navigation', desc: 'Forward drill-down chevron', culturalNote: 'Mirrored in RTL to indicate drill-down progression.' },
  { id: 'arrow-forward', mirror: true, category: 'navigation', desc: 'Corridor origin-to-destination arrow', culturalNote: 'Mirrored in RTL to match right-to-left reading flow.' },
  { id: 'arrow-see-all', mirror: true, category: 'navigation', desc: 'See all links expansion arrow', culturalNote: 'Mirrored in RTL to point towards list expansion.' },

  // Symmetrical and Non-Directional Icons (Never Mirrored)
  { id: 'globe', mirror: false, category: 'ui', desc: 'Spherical world globe', culturalNote: 'Symmetrical global geography; never flipped.' },
  { id: 'search', mirror: false, category: 'ui', desc: 'Search magnifying glass', culturalNote: 'Universal right-handed lens orientation; convention remains consistent worldwide.' },
  { id: 'home', mirror: false, category: 'navigation', desc: 'Home roof structure', culturalNote: 'Symmetrical architectural icon.' },
  { id: 'settings', mirror: false, category: 'ui', desc: 'Settings mechanical gear', culturalNote: 'Symmetrical mechanical cogwheel.' },
  { id: 'clock', mirror: false, category: 'transit', desc: 'Clock face with hour/minute hands', culturalNote: 'Physical analog clocks run clockwise in all world locales.' },
  { id: 'pin', mirror: false, category: 'map', desc: 'Map location teardrop pin', culturalNote: 'Symmetrical vertical teardrop pointing to coordinates.' },
  { id: 'pin-dot', mirror: false, category: 'map', desc: 'Origin map point dot', culturalNote: 'Symmetrical circular dot.' },
  { id: 'swap-vertical', mirror: false, category: 'ui', desc: 'Vertical swap up/down arrows', culturalNote: 'Vertical exchange unaffected by horizontal script direction.' },
  { id: 'accessibility', mirror: false, category: 'a11y', desc: 'Universal accessibility person', culturalNote: 'Symmetrical human figure for accessibility.' },
  { id: 'info', mirror: false, category: 'ui', desc: 'Information circle badge', culturalNote: 'Universal information glyph.' },
  { id: 'bus', mirror: false, category: 'transit', desc: 'City public transit bus', culturalNote: 'Front-facing symmetrical transit vehicle.' },
  { id: 'metro', mirror: false, category: 'transit', desc: 'Rapid transit metro railcar', culturalNote: 'Front-facing symmetrical rail vehicle.' },
  { id: 'ticket', mirror: false, category: 'transit', desc: 'Boarding pass with perforation', culturalNote: 'Physical transit ticket token.' },
  { id: 'chevron-down', mirror: false, category: 'ui', desc: 'Dropdown chevron', culturalNote: 'Vertical dropdown indicator.' },
  { id: 'close', mirror: false, category: 'ui', desc: 'Dismiss / close cross', culturalNote: 'Symmetrical dismiss cross.' },
  { id: 'check', mirror: false, category: 'feedback', desc: 'Affirmative checkmark', culturalNote: 'Neutral confirmation; avoids offensive hand gestures.' },
  { id: 'alert-circle', mirror: false, category: 'feedback', desc: 'Alert / warning indicator', culturalNote: 'Clear non-color-only warning badge.' },
  { id: 'wifi-off', mirror: false, category: 'system', desc: 'Offline / disconnected indicator', culturalNote: 'Symmetrical antenna broadcast with slash.' },
  { id: 'location-denied', mirror: false, category: 'system', desc: 'Location permission denied badge', culturalNote: 'Target crosshair with slash.' },
  { id: 'refresh', mirror: false, category: 'ui', desc: 'Refresh / reload indicator', culturalNote: 'Standard cyclical arrow.' },
  { id: 'star', mirror: false, category: 'saved', desc: 'Save favourite route outline', culturalNote: 'Symmetrical 5-point star.' },
  { id: 'star-filled', mirror: false, category: 'saved', desc: 'Saved favourite route filled', culturalNote: 'Symmetrical 5-point star filled.' },
  { id: 'share', mirror: false, category: 'ui', desc: 'Share route link nodes', culturalNote: 'Standard platform share icon.' },
  { id: 'qr-code', mirror: false, category: 'ticket', desc: 'Digital transit gate QR code', culturalNote: '2D matrix barcode format.' }
];

export const icons = {
  // Mirrored in RTL
  'arrow-back': `<svg class="mirror-rtl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`,
  'chevron-forward': `<svg class="mirror-rtl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>`,
  'arrow-forward': `<svg class="mirror-rtl" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>`,
  'arrow-see-all': `<svg class="mirror-rtl" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>`,
  
  // Symmetrical and Physical Objects (Never Mirrored)
  'globe': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  'search': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
  'home': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  'settings': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="3" r="1"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  'clock': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  'pin': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  'pin-dot': `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="6"/></svg>`,
  'swap-vertical': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`,
  'accessibility': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="2.5"/><path d="M12 7v7"/><path d="M5 10l7-2 7 2"/><path d="M8 21l4-7 4 7"/></svg>`,
  'info': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  'bus': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="16" rx="3"/><circle cx="7" cy="15" r="1.5"/><circle cx="17" cy="15" r="1.5"/><path d="M3 9h18"/><path d="M5 19v2"/><path d="M19 19v2"/></svg>`,
  'metro': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="15" rx="3"/><circle cx="8" cy="14" r="1.5"/><circle cx="16" cy="14" r="1.5"/><path d="M4 9h16"/><line x1="8" y1="18" x2="6" y2="21"/><line x1="16" y1="18" x2="18" y2="21"/></svg>`,
  'ticket': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a3 3 0 0 1 0-6V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><line x1="13" y1="3" x2="13" y2="21" stroke-dasharray="2 2"/></svg>`,
  'chevron-down': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`,
  'close': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  'check': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
  'alert-circle': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  'wifi-off': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  'location-denied': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="1" y1="1" x2="23" y2="23"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>`,
  'refresh': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  'star': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  'star-filled': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  'share': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  'qr-code': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="7" y="7" width="1" height="1" fill="currentColor"/><rect x="18" y="7" width="1" height="1" fill="currentColor"/><rect x="7" y="18" width="1" height="1" fill="currentColor"/><rect x="17" y="17" width="2" height="2" fill="currentColor"/></svg>`
};

export function getIcon(name, extraClass = '') {
  const meta = ICON_REGISTRY.find(i => i.id === name);
  const isMirror = meta ? meta.mirror : false;
  const mirrorClass = isMirror ? 'mirror-rtl' : '';
  const classes = [extraClass, mirrorClass].filter(Boolean).join(' ');

  const svg = icons[name] || '';
  if (classes && svg) {
    if (svg.includes('class="mirror-rtl"')) {
      return svg.replace('class="mirror-rtl"', `class="${classes}"`);
    }
    return svg.replace('<svg ', `<svg class="${classes}" `);
  }
  return svg;
}
