/**
 * TransitOne - Intl Helpers
 * Localized Plurals, Numbers, Dates and Relative Times
 */

import { getCurrentLanguage } from './i18n.js';

// Numbering System override (e.g. 'latn', 'deva', 'knda', 'arabext')
let activeNumberingSystem = 'latn';

export function setNumberingSystem(sys) {
  activeNumberingSystem = sys || 'latn';
}

export function getNumberingSystem() {
  return activeNumberingSystem;
}

// Plural rules dictionary
const PLURAL_WORDS = {
  en: {
    stops: { one: 'stop', other: 'stops' },
    min: { one: 'min', other: 'min' }
  },
  hi: {
    stops: { one: 'स्टॉप', other: 'स्टॉप' },
    min: { one: 'मिनट', other: 'मिनट' }
  },
  kn: {
    stops: { one: 'ನಿಲ್ದಾಣ', other: 'ನಿಲ್ದಾಣಗಳು' },
    min: { one: 'ನಿಮಿಷ', other: 'ನಿಮಿಷಗಳು' }
  },
  ur: {
    stops: { one: 'اسٹاپ', other: 'اسٹاپس' },
    min: { one: 'منٹ', other: 'منٹ' }
  }
};

/**
 * Format stop count with localized plural rules
 */
export function formatStops(count, lang = getCurrentLanguage()) {
  const pr = new Intl.PluralRules(lang);
  const rule = pr.select(count);
  const words = PLURAL_WORDS[lang] ? PLURAL_WORDS[lang].stops : PLURAL_WORDS.en.stops;
  const word = words[rule] || words.other;
  return `${formatNumber(count, lang)} ${word}`;
}

/**
 * Format duration minutes with localized plural rules
 */
export function formatMinutes(minutes, lang = getCurrentLanguage()) {
  const pr = new Intl.PluralRules(lang);
  const rule = pr.select(minutes);
  const words = PLURAL_WORDS[lang] ? PLURAL_WORDS[lang].min : PLURAL_WORDS.en.min;
  const word = words[rule] || words.other;
  return `${formatNumber(minutes, lang)} ${word}`;
}

/**
 * Format currency in INR with active numbering system
 */
export function formatFare(amount, lang = getCurrentLanguage()) {
  try {
    const localeWithSys = `${lang}-u-nu-${activeNumberingSystem}`;
    const formatter = new Intl.NumberFormat(localeWithSys, {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  } catch (e) {
    return `₹${formatNumber(amount, lang)}`;
  }
}

/**
 * Format localized number
 */
export function formatNumber(val, lang = getCurrentLanguage()) {
  try {
    const localeWithSys = `${lang}-u-nu-${activeNumberingSystem}`;
    return new Intl.NumberFormat(localeWithSys).format(val);
  } catch (e) {
    return String(val);
  }
}

/**
 * Format localized departure time
 */
export function formatTime(dateObj, lang = getCurrentLanguage()) {
  try {
    const localeWithSys = `${lang}-u-nu-${activeNumberingSystem}`;
    return new Intl.DateTimeFormat(localeWithSys, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(dateObj);
  } catch (e) {
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
}

/**
 * Format next departure relative countdown ("in 6 min")
 */
export function formatRelativeCountdown(minutes, lang = getCurrentLanguage()) {
  try {
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'always', style: 'short' });
    return rtf.format(minutes, 'minute');
  } catch (e) {
    return `in ${minutes} min`;
  }
}
