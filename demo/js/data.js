/**
 * TransitOne - Demonstration Transit Engine & Data
 * 
 * Unified RTL & Indic Design System
 * 16 Bangalore Metro & Bus stops across corridors with search aliases.
 * 8 lines with timetable metrics, dynamic next 3 departures, and 1-transfer routing.
 */

import { getCurrentLanguage } from './i18n.js';
import { formatMinutes, formatTime, formatFare } from './intl-helpers.js';

export const PLACES = {
  majestic: {
    id: 'majestic',
    en: 'Majestic',
    hi: 'मजेस्टिक',
    kn: 'ಮೆಜೆಸ್ಟಿಕ್',
    ur: 'میجسٹک',
    hub: true,
    aliases: ['kbs', 'sbc', 'kempegowda', 'railway station', 'city bus stand', 'sangam']
  },
  whitefield: {
    id: 'whitefield',
    en: 'Whitefield',
    hi: 'व्हाइटफील्ड',
    kn: 'ವೈಟ್ಫೀಲ್ಡ್',
    ur: 'وائٹ فیلڈ',
    hub: false,
    aliases: ['kadugodi', 'itpl', 'ecc', 'hope farm', 'channasandra']
  },
  hebbal: {
    id: 'hebbal',
    en: 'Hebbal',
    hi: 'हेब्बल',
    kn: 'ಹೆಬ್ಬಾಳ',
    ur: 'ہیبل',
    hub: true,
    aliases: ['hebbal flyover', 'manyata', 'bellary road', 'outer ring road']
  },
  mgRoad: {
    id: 'mgRoad',
    en: 'M.G. Road',
    hi: 'एम.जी. रोड',
    kn: 'ಎಂ.ಜಿ. ರಸ್ತೆ',
    ur: 'ایم جی روڈ',
    hub: true,
    aliases: ['mg road', 'brigade road', 'trinity', 'mahatma gandhi road', 'church street']
  },
  krPuram: {
    id: 'krPuram',
    en: 'K.R. Puram',
    hi: 'केआर पुरम',
    kn: 'ಕೆ.ಆರ್. ಪುರಂ',
    ur: 'کے آر پورم',
    hub: true,
    aliases: ['tin factory', 'kr puram railway station', 'krishnarajapuram', 'hanging bridge']
  },
  silkboard: {
    id: 'silkboard',
    en: 'Silkboard',
    hi: 'सिल्कबोर्ड',
    kn: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್',
    ur: 'سلک بورڈ',
    hub: true,
    aliases: ['central silk board', 'csb', 'btm layout', 'hosur road', 'madiwala']
  },
  cubbonPark: {
    id: 'cubbonPark',
    en: 'Cubbon Park',
    hi: 'कब्बन पार्क',
    kn: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್',
    ur: 'کبن پارک',
    hub: false,
    aliases: ['high court', 'vidhana soudha', 'chinnaswamy', 'gpo', 'kanteerava']
  },
  indiranagar: {
    id: 'indiranagar',
    en: 'Indiranagar',
    hi: 'इंदिरानगर',
    kn: 'ಇಂದಿರಾನಗರ',
    ur: 'اندرا نگر',
    hub: false,
    aliases: ['100 ft road', 'cmh road', '12th main', 'hal 2nd stage', 'defence colony']
  },
  marathahalli: {
    id: 'marathahalli',
    en: 'Marathahalli',
    hi: 'मराठहल्ली',
    kn: 'ಮಾರತ್ಹಳ್ಳಿ',
    ur: 'مارتھہلی',
    hub: true,
    aliases: ['marathahalli bridge', 'multiplex', 'kalamandir', 'outer ring road', 'hal']
  },
  bellandur: {
    id: 'bellandur',
    en: 'Bellandur',
    hi: 'बेलंदूर',
    kn: 'ಬೆಳ್ಳಂದೂರು',
    ur: 'بیلاندر',
    hub: false,
    aliases: ['ecospace', 'ecoworld', 'intel', 'devarabeesanahalli', 'cessna']
  },
  electronicCity: {
    id: 'electronicCity',
    en: 'Electronic City',
    hi: 'इलेक्ट्रॉनिक सिटी',
    kn: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ',
    ur: 'الیکٹرانک سٹی',
    hub: false,
    aliases: ['ecity', 'phase 1', 'phase 2', 'infosys', 'wipro gate', 'elevated tollway']
  },
  yeshwantpur: {
    id: 'yeshwantpur',
    en: 'Yeshwantpur',
    hi: 'यशवंतपुर',
    kn: 'ಯಶವಂತಪುರ',
    ur: 'یشونت پور',
    hub: true,
    aliases: ['ypr', 'yesvantpur junction', 'apmc yard', 'goverdhan', 'peenya']
  },
  jayanagar: {
    id: 'jayanagar',
    en: 'Jayanagar',
    hi: 'जयनगर',
    kn: 'ಜಯನಗರ',
    ur: 'جیا نگر',
    hub: false,
    aliases: ['4th block', 'south end circle', 'ashoka pillar', 'shopping complex', 'yediyur']
  },
  banashankari: {
    id: 'banashankari',
    en: 'Banashankari',
    hi: 'बनशंकरी',
    kn: 'ಬನಶಂಕರಿ',
    ur: 'بنشکری',
    hub: false,
    aliases: ['bsk', 'ttmc', 'banashankari temple', 'kanakapura road', 'padmanabhanagar']
  },
  rajajinagar: {
    id: 'rajajinagar',
    en: 'Rajajinagar',
    hi: 'राजाजीनगर',
    kn: 'ರಾಜಾಜಿನಗರ',
    ur: 'راجاجی نگر',
    hub: false,
    aliases: ['navrang', 'orion mall', 'brigade gateway', '1st block', 'isckon']
  },
  airport: {
    id: 'airport',
    en: 'KIA Airport',
    hi: 'केआईए हवाई अड्डा',
    kn: 'ಕೆ.ಐ.ಎ ವಿಮಾನ ನಿಲ್ದಾಣ',
    ur: 'کے آئی اے ہوائی اڈا',
    hub: false,
    aliases: ['bial', 'blr', 'kempegowda airport', 'terminal 1', 'terminal 2', 'devenahalli']
  }
};

export function getPlaceName(placeId, lang = 'en') {
  const place = PLACES[placeId];
  if (!place) return placeId;
  return place[lang] || place.en;
}

export function searchPlaces(query, lang = 'en') {
  if (!query || !query.trim()) return Object.values(PLACES);
  const q = query.trim().toLowerCase();
  return Object.values(PLACES).filter(place => {
    // Check in current & all supported languages
    const matchLang = ['en', 'hi', 'kn', 'ur'].some(l => (place[l] || '').toLowerCase().includes(q));
    // Check in aliases
    const matchAlias = (place.aliases || []).some(a => a.toLowerCase().includes(q));
    // Check place id
    const matchId = place.id.toLowerCase().includes(q);
    return matchLang || matchAlias || matchId;
  });
}

/**
 * 8 Transit Lines with Timetable and Fare Formulas
 */
export const TRANSIT_LINES = [
  {
    id: 'line-purple',
    name: { en: 'Purple Line (M1)', hi: 'पर्पल लाइन (M1)', kn: 'ಪರ್ಪಲ್ ಲೈನ್ (M1)', ur: 'پرپل لائن (M1)' },
    code: 'Metro M1',
    mode: 'metro',
    stops: ['majestic', 'cubbonPark', 'mgRoad', 'indiranagar', 'krPuram', 'whitefield'],
    legMinutes: [5, 4, 7, 8, 11],
    frequencyMin: 5,
    firstDeparture: '05:00',
    lastDeparture: '23:30',
    baseFare: 10,
    farePerStop: 5
  },
  {
    id: 'line-green',
    name: { en: 'Green Line (M2)', hi: 'ग्रीन लाइन (M2)', kn: 'ಗ್ರೀನ್ ಲೈನ್ (M2)', ur: 'گرین لائن (M2)' },
    code: 'Metro M2',
    mode: 'metro',
    stops: ['yeshwantpur', 'rajajinagar', 'majestic', 'jayanagar', 'banashankari'],
    legMinutes: [6, 6, 7, 6],
    frequencyMin: 6,
    firstDeparture: '05:00',
    lastDeparture: '23:30',
    baseFare: 10,
    farePerStop: 5
  },
  {
    id: 'line-bus-500d',
    name: { en: 'Ring Road 500-D', hi: 'रिंग रोड 500-D', kn: 'ರಿಂಗ್ ರೋಡ್ 500-D', ur: 'رنگ روڈ 500-D' },
    code: 'Bus 500-D',
    mode: 'bus',
    stops: ['hebbal', 'krPuram', 'marathahalli', 'bellandur', 'silkboard'],
    legMinutes: [18, 12, 10, 15],
    frequencyMin: 8,
    firstDeparture: '05:30',
    lastDeparture: '23:00',
    baseFare: 15,
    farePerStop: 4
  },
  {
    id: 'line-bus-335e',
    name: { en: 'City Express 335-E', hi: 'सिटी एक्सप्रेस 335-E', kn: 'ಸಿಟಿ ಎಕ್ಸ್ಪ್ರೆಸ್ 335-E', ur: 'سٹی ایکسپریس 335-E' },
    code: 'Bus 335-E',
    mode: 'bus',
    stops: ['majestic', 'cubbonPark', 'mgRoad', 'indiranagar', 'marathahalli', 'whitefield'],
    legMinutes: [8, 6, 8, 14, 12],
    frequencyMin: 10,
    firstDeparture: '06:00',
    lastDeparture: '22:30',
    baseFare: 15,
    farePerStop: 5
  },
  {
    id: 'line-bus-kia9',
    name: { en: 'Vayu Vajra KIA-9', hi: 'वायु वज्र KIA-9', kn: 'ವಾಯು ವಜ್ರ KIA-9', ur: 'وایو وجرا KIA-9' },
    code: 'Bus KIA-9',
    mode: 'bus',
    stops: ['majestic', 'hebbal', 'airport'],
    legMinutes: [25, 35],
    frequencyMin: 15,
    firstDeparture: '00:00',
    lastDeparture: '23:59',
    baseFare: 120,
    farePerStop: 80
  },
  {
    id: 'line-bus-v356',
    name: { en: 'Hosur Road V-356', hi: 'होसुर रोड V-356', kn: 'ಹೊಸೂರು ರಸ್ತೆ V-356', ur: 'ہور روڈ V-356' },
    code: 'Bus V-356',
    mode: 'bus',
    stops: ['majestic', 'jayanagar', 'silkboard', 'electronicCity'],
    legMinutes: [14, 16, 22],
    frequencyMin: 12,
    firstDeparture: '06:00',
    lastDeparture: '22:00',
    baseFare: 20,
    farePerStop: 5
  },
  {
    id: 'line-bus-e2',
    name: { en: 'IT Corridor Express E-2', hi: 'आईटी कॉरिडोर एक्सप्रेस E-2', kn: 'ಐಟಿ ಕಾರಿಡಾರ್ ಎಕ್ಸ್ಪ್ರೆಸ್ E-2', ur: 'آئی ٹی کوریڈور ایکسپریس E-2' },
    code: 'Express Bus E-2',
    mode: 'bus',
    stops: ['silkboard', 'bellandur', 'marathahalli', 'whitefield'],
    legMinutes: [12, 10, 18],
    frequencyMin: 15,
    firstDeparture: '06:30',
    lastDeparture: '21:30',
    baseFare: 20,
    farePerStop: 6
  },
  {
    id: 'line-bus-250',
    name: { en: 'North Route 250', hi: 'उत्तर मार्ग 250', kn: 'ಉತ್ತರ ಮಾರ್ಗ 250', ur: 'شمالی راستہ 250' },
    code: 'Bus 250',
    mode: 'bus',
    stops: ['majestic', 'rajajinagar', 'yeshwantpur'],
    legMinutes: [12, 8],
    frequencyMin: 10,
    firstDeparture: '06:00',
    lastDeparture: '22:30',
    baseFare: 10,
    farePerStop: 4
  }
];

/**
 * Get current time in Asia/Kolkata or simulated daylight hours
 */
export function getKolkataTime() {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    let h = 9, m = 15, s = 0;
    for (const p of parts) {
      if (p.type === 'hour') h = parseInt(p.value, 10);
      if (p.type === 'minute') m = parseInt(p.value, 10);
      if (p.type === 'second') s = parseInt(p.value, 10);
    }
    return { h, m, s, totalMinutes: h * 60 + m };
  } catch (e) {
    const h = now.getHours();
    const m = now.getMinutes();
    return { h, m, s: now.getSeconds(), totalMinutes: h * 60 + m };
  }
}

/**
 * Calculate dynamic next 3 departures from current time and frequency
 */
export function calculateNextDepartures(frequencyMin, offsetMin = 3) {
  const kt = getKolkataTime();
  // Anchor to upcoming minutes
  let firstGap = frequencyMin - (kt.m % frequencyMin);
  if (firstGap < offsetMin) firstGap += frequencyMin;

  const dep1Min = kt.totalMinutes + firstGap;
  const dep2Min = dep1Min + frequencyMin;
  const dep3Min = dep2Min + frequencyMin;

  function toDate(totalM) {
    const d = new Date();
    const hrs = Math.floor(totalM / 60) % 24;
    const mins = totalM % 60;
    d.setHours(hrs, mins, 0, 0);
    return d;
  }

  return {
    nextMinutes: firstGap,
    times: [toDate(dep1Min), toDate(dep2Min), toDate(dep3Min)]
  };
}

/**
 * Build detailed stops timetable for a specific run
 */
function buildTimetable(stopIds, legMins, baseTime) {
  let curTime = new Date(baseTime);
  const result = [];

  for (let i = 0; i < stopIds.length; i++) {
    const id = stopIds[i];
    const place = PLACES[id] || { en: id, hi: id, kn: id, ur: id };
    const hh = String(curTime.getHours()).padStart(2, '0');
    const mm = String(curTime.getMinutes()).padStart(2, '0');

    result.push({
      stopId: id,
      name: {
        en: place.en,
        hi: place.hi,
        kn: place.kn,
        ur: place.ur
      },
      time: `${hh}:${mm}`,
      timeObj: new Date(curTime)
    });

    if (i < legMins.length) {
      curTime = new Date(curTime.getTime() + legMins[i] * 60000);
    }
  }
  return result;
}

/**
 * Find routes supporting direct bidirectional and 1-change routes
 */
export function findRoutes(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return [];

  const directResults = [];

  // Check direct routes across all 8 lines
  for (const line of TRANSIT_LINES) {
    const fromIdx = line.stops.indexOf(fromId);
    const toIdx = line.stops.indexOf(toId);

    if (fromIdx !== -1 && toIdx !== -1) {
      const isForward = fromIdx < toIdx;
      const subStops = isForward 
        ? line.stops.slice(fromIdx, toIdx + 1)
        : line.stops.slice(toIdx, fromIdx + 1).reverse();
      
      const subLegs = isForward
        ? line.legMinutes.slice(fromIdx, toIdx)
        : line.legMinutes.slice(toIdx, fromIdx).reverse();

      const durationMin = subLegs.reduce((a, b) => a + b, 0);
      const stopsCount = subStops.length;
      const fare = line.baseFare + (stopsCount - 1) * line.farePerStop;
      const depInfo = calculateNextDepartures(line.frequencyMin, (fromIdx + 2) % 5 + 2);

      const routeId = `${line.id}-${fromId}-${toId}`;
      const timetable = buildTimetable(subStops, subLegs, depInfo.times[0]);

      directResults.push({
        id: routeId,
        from: fromId,
        to: toId,
        mode: line.mode,
        code: line.code,
        lineId: line.id,
        durationMin,
        stopsCount,
        fare,
        nextDeparture: `${depInfo.nextMinutes} min`,
        nextDepartureMinutes: depInfo.nextMinutes,
        departureTimes: depInfo.times,
        stops: timetable,
        transfers: 0,
        direct: true
      });
    }
  }

  // If we have direct routes, also sort them
  if (directResults.length > 0) {
    return directResults;
  }

  // Find 1-change routes through hubs
  const hubIds = Object.keys(PLACES).filter(id => PLACES[id].hub && id !== fromId && id !== toId);
  const transferResults = [];

  for (const hubId of hubIds) {
    const leg1Routes = findRoutesDirect(fromId, hubId);
    const leg2Routes = findRoutesDirect(hubId, toId);

    if (leg1Routes.length > 0 && leg2Routes.length > 0) {
      const leg1 = leg1Routes[0];
      const leg2 = leg2Routes[0];

      const transferBufferMin = 6;
      const durationMin = leg1.durationMin + transferBufferMin + leg2.durationMin;
      const stopsCount = leg1.stopsCount + leg2.stopsCount - 1;
      const fare = leg1.fare + leg2.fare;
      const depInfo = calculateNextDepartures(8, 4);

      // Merge timetable with transfer gap
      const leg1Stops = buildTimetable(leg1.subStops, leg1.subLegs, depInfo.times[0]);
      const leg2StartTime = new Date(leg1Stops[leg1Stops.length - 1].timeObj.getTime() + transferBufferMin * 60000);
      const leg2Stops = buildTimetable(leg2.subStops, leg2.subLegs, leg2StartTime);

      // Avoid duplicating the transfer hub
      const mergedStops = [...leg1Stops, ...leg2Stops.slice(1)];
      const routeId = `transfer-${fromId}-${hubId}-${toId}`;

      transferResults.push({
        id: routeId,
        from: fromId,
        to: toId,
        mode: leg1.mode === leg2.mode ? leg1.mode : 'metro',
        code: `${leg1.code} → ${leg2.code}`,
        durationMin,
        stopsCount,
        fare,
        nextDeparture: `${depInfo.nextMinutes} min`,
        nextDepartureMinutes: depInfo.nextMinutes,
        departureTimes: depInfo.times,
        stops: mergedStops,
        transfers: 1,
        transferStation: hubId,
        direct: false
      });
    }
  }

  return transferResults;
}

function findRoutesDirect(fromId, toId) {
  const list = [];
  for (const line of TRANSIT_LINES) {
    const fromIdx = line.stops.indexOf(fromId);
    const toIdx = line.stops.indexOf(toId);
    if (fromIdx !== -1 && toIdx !== -1) {
      const isForward = fromIdx < toIdx;
      const subStops = isForward 
        ? line.stops.slice(fromIdx, toIdx + 1)
        : line.stops.slice(toIdx, fromIdx + 1).reverse();
      const subLegs = isForward
        ? line.legMinutes.slice(fromIdx, toIdx)
        : line.legMinutes.slice(toIdx, fromIdx).reverse();
      const durationMin = subLegs.reduce((a, b) => a + b, 0);
      list.push({ line, subStops, subLegs, durationMin, stopsCount: subStops.length, fare: line.baseFare + subStops.length * line.farePerStop, mode: line.mode, code: line.code });
    }
  }
  return list;
}

// Fallback & backward compatible route dataset
export const ROUTES_DATA = [
  // Majestic -> Whitefield
  {
    id: 'maj-wf-m1',
    from: 'majestic',
    to: 'whitefield',
    mode: 'metro',
    code: 'Metro M1',
    durationMin: 38,
    stopsCount: 6,
    fare: 30,
    nextDeparture: '4 min',
    nextDepartureMinutes: 4,
    stops: [
      { name: { en: 'Majestic', hi: 'मजेस्टिक', kn: 'ಮೆಜೆಸ್ಟಿಕ್', ur: 'میجسٹک' }, time: '09:00' },
      { name: { en: 'Cubbon Park', hi: 'कब्बन पार्क', kn: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್', ur: 'کبن پارک' }, time: '09:08' },
      { name: { en: 'M.G. Road', hi: 'एम.जी. रोड', kn: 'ಎಂ.ಜಿ. ರಸ್ತೆ', ur: 'ایم جی روڈ' }, time: '09:14' },
      { name: { en: 'Indiranagar', hi: 'इंदिरानगर', kn: 'ಇಂದಿರಾನಗರ', ur: 'اندرا نگر' }, time: '09:21' },
      { name: { en: 'K.R. Puram', hi: 'केआर पुरम', kn: 'ಕೆ.ಆರ್. ಪುರಂ', ur: 'کے آر پورم' }, time: '09:29' },
      { name: { en: 'Whitefield', hi: 'व्हाइटफील्ड', kn: 'ವೈಟ್ಫೀಲ್ಡ್', ur: 'وائٹ فیلڈ' }, time: '09:38' }
    ]
  },
  {
    id: 'maj-wf-bus500',
    from: 'majestic',
    to: 'whitefield',
    mode: 'bus',
    code: 'Bus 500',
    durationMin: 52,
    stopsCount: 12,
    fare: 30,
    nextDeparture: '12 min',
    nextDepartureMinutes: 12,
    stops: [
      { name: { en: 'Majestic', hi: 'मजेस्टिक', kn: 'ಮೆಜೆಸ್ಟಿಕ್', ur: 'میجسٹک' }, time: '09:05' },
      { name: { en: 'Corporation', hi: 'कॉर्पोरेशन', kn: 'ಕಾರ್ಪೊರೇಷನ್', ur: 'کارپوریشن' }, time: '09:12' },
      { name: { en: 'Richmond Circle', hi: 'रिचमंड सर्कल', kn: 'ರಿಚ್ಮಂಡ್ ಸರ್ಕಲ್', ur: 'رچمنڈ سرکل' }, time: '09:18' },
      { name: { en: 'Mayo Hall', hi: 'मेयो हॉल', kn: 'ಮೇಯೋ ಹಾಲ್', ur: 'میو ہال' }, time: '09:24' },
      { name: { en: 'Domlur', hi: 'डोमलूर', kn: 'ದೊಮ್ಲೂರು', ur: 'ڈوملور' }, time: '09:31' },
      { name: { en: 'HAL', hi: 'एचएएल', kn: 'ಎಚ್.ಎ.ಎಲ್', ur: 'ایچ اے ایل' }, time: '09:37' },
      { name: { en: 'Marathahalli Bridge', hi: 'मराठहल्ली ब्रिज', kn: 'ಮಾರತ್ಹಳ್ಳಿ ಬ್ರಿಡ್ಜ್', ur: 'مارتھہلی پل' }, time: '09:44' },
      { name: { en: 'Kundalahalli', hi: 'कुंदनहल्ली', kn: 'ಕುಂದಲಹಳ್ಳಿ', ur: 'کندنہلی' }, time: '09:48' },
      { name: { en: 'ITPL', hi: 'आईटीपीएल', kn: 'ಐಟಿಪಿಎಲ್', ur: 'آئی ٹی پی ایل' }, time: '09:53' },
      { name: { en: 'Whitefield', hi: 'व्हाइटफील्ड', kn: 'ವೈಟ್ಫೀಲ್ಡ್', ur: 'وائٹ فیلڈ' }, time: '09:57' }
    ]
  },
  {
    id: 'maj-wf-e1',
    from: 'majestic',
    to: 'whitefield',
    mode: 'bus',
    code: 'Express Bus E1',
    durationMin: 46,
    stopsCount: 8,
    fare: 40,
    nextDeparture: '18 min',
    nextDepartureMinutes: 18,
    stops: [
      { name: { en: 'Majestic', hi: 'मजेस्टिक', kn: 'ಮೆಜೆಸ್ಟಿಕ್', ur: 'میجسٹک' }, time: '09:15' },
      { name: { en: 'Corporation', hi: 'कॉर्पोरेशन', kn: 'ಕಾರ್ಪೊರೇಷನ್', ur: 'کارپوریشن' }, time: '09:22' },
      { name: { en: 'Trinity Circle', hi: 'ट्रिनिटी सर्कल', kn: 'ಟ್ರಿನಿಟಿ ಸರ್ಕಲ್', ur: 'ٹرنٹی سرکل' }, time: '09:30' },
      { name: { en: 'Domlur Flyover', hi: 'डोमलूर फ्लाईओवर', kn: 'ದೊಮ್ಲೂರು ಫ್ಲೈಓವರ್', ur: 'ڈوملور فلائی اوور' }, time: '09:36' },
      { name: { en: 'Marathahalli', hi: 'मराठहल्ली', kn: 'ಮಾರತ್ಹಳ್ಳಿ', ur: 'مارتھہلی' }, time: '09:45' },
      { name: { en: 'Kundalahalli Gate', hi: 'कुंदनहल्ली गेट', kn: 'ಕುಂದಲಹಳ್ಳಿ ಗೇಟ್', ur: 'کندنہلی گیٹ' }, time: '09:51' },
      { name: { en: 'ITPL Main Gate', hi: 'आईटीपीएल गेट', kn: 'ಐಟಿಪಿಎಲ್ ಗೇಟ್', ur: 'آئی ٹی پی ایل گیٹ' }, time: '09:56' },
      { name: { en: 'Whitefield', hi: 'व्हाइटफील्ड', kn: 'ವೈಟ್ಫೀಲ್ಡ್', ur: 'وائٹ فیلڈ' }, time: '10:01' }
    ]
  },
  // Hebbal -> M.G. Road
  {
    id: 'heb-mg-500a',
    from: 'hebbal',
    to: 'mgRoad',
    mode: 'bus',
    code: 'Bus 500A',
    durationMin: 35,
    stopsCount: 9,
    fare: 25,
    nextDeparture: '7 min',
    nextDepartureMinutes: 7,
    stops: [
      { name: { en: 'Hebbal', hi: 'हेब्बल', kn: 'ಹೆಬ್ಬಾಳ', ur: 'ہیبل' }, time: '08:30' },
      { name: { en: 'Ganganagar', hi: 'गंगानगर', kn: 'ಗಂಗಾನಗರ', ur: 'گنگا نگر' }, time: '08:36' },
      { name: { en: 'Mekhri Circle', hi: 'मेखरी सर्कल', kn: 'ಮೇಖ್ರಿ ಸರ್ಕಲ್', ur: 'میکھری سرکل' }, time: '08:42' },
      { name: { en: 'Vasanth Nagar', hi: 'वसंत नगर', kn: 'ವಸಂತ ನಗರ', ur: 'وسنت نگر' }, time: '08:48' },
      { name: { en: 'Cantonment', hi: 'छावनी', kn: 'ದಂಡು ಪ್ರದೇಶ', ur: 'چھاؤنی' }, time: '08:54' },
      { name: { en: 'Shivajinagar', hi: 'शिवाजीनगर', kn: 'ಶಿವಾಜಿನಗರ', ur: 'شیواجی نگر' }, time: '08:59' },
      { name: { en: 'M.G. Road', hi: 'एम.जी. रोड', kn: 'ಎಂ.ಜಿ. ರಸ್ತೆ', ur: 'ایم جی روڈ' }, time: '09:05' }
    ]
  },
  {
    id: 'heb-mg-m2',
    from: 'hebbal',
    to: 'mgRoad',
    mode: 'metro',
    code: 'Metro M2',
    durationMin: 28,
    stopsCount: 5,
    fare: 30,
    nextDeparture: '3 min',
    nextDepartureMinutes: 3,
    stops: [
      { name: { en: 'Hebbal', hi: 'हेब्बल', kn: 'ಹೆಬ್ಬಾಳ', ur: 'ہیبل' }, time: '08:35' },
      { name: { en: 'Veterinary College', hi: 'पशु चिकित्सा कॉलेज', kn: 'ಪಶುವೈದ್ಯಕೀಯ ಕಾಲೇಜು', ur: 'ویٹرنری کالج' }, time: '08:41' },
      { name: { en: 'Palace Guttahalli', hi: 'पैलेस गुट्टाहल्ली', kn: 'ಅರಮನೆ ಗುಟ್ಟಹಳ್ಳಿ', ur: 'پیلس گٹہلی' }, time: '08:48' },
      { name: { en: 'Cubbon Park', hi: 'कब्बन पार्क', kn: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್', ur: 'کبن پارک' }, time: '08:56' },
      { name: { en: 'M.G. Road', hi: 'एम.जी. रोड', kn: 'ಎಂ.ಜಿ. ರಸ್ತೆ', ur: 'ایم جی روڈ' }, time: '09:03' }
    ]
  },
  // Majestic -> K.R. Puram
  {
    id: 'maj-kr-335e',
    from: 'majestic',
    to: 'krPuram',
    mode: 'bus',
    code: 'Bus 335E',
    durationMin: 44,
    stopsCount: 10,
    fare: 35,
    nextDeparture: '9 min',
    nextDepartureMinutes: 9,
    stops: [
      { name: { en: 'Majestic', hi: 'मजेस्टिक', kn: 'ಮೆಜೆಸ್ಟಿಕ್', ur: 'میجسٹک' }, time: '10:00' },
      { name: { en: 'Corporation', hi: 'कॉर्पोरेशन', kn: 'ಕಾರ್ಪೊರೇಷನ್', ur: 'کارپوریشن' }, time: '10:07' },
      { name: { en: 'Mayo Hall', hi: 'मेयो हॉल', kn: 'ಮೇಯೋ ಹಾಲ್', ur: 'میو ہال' }, time: '10:14' },
      { name: { en: 'Ulsoor', hi: 'उलसूर', kn: 'ಹಲಸೂರು', ur: 'السور' }, time: '10:20' },
      { name: { en: 'Indiranagar 100ft Rd', hi: 'इंदिरानगर 100 फीट', kn: 'ಇಂದಿರಾನಗರ 100 ಅಡಿ ರಸ್ತೆ', ur: 'اندرا نگر 100 فٹ' }, time: '10:27' },
      { name: { en: 'Benniganahalli', hi: 'बेन्निगनहल्ली', kn: 'ಬೆನ್ನಿಗಾನಹಳ್ಳಿ', ur: 'بینی گنہلی' }, time: '10:35' },
      { name: { en: 'K.R. Puram', hi: 'केआर पुरम', kn: 'ಕೆ.ಆರ್. ಪುರಂ', ur: 'کے آر پورم' }, time: '10:44' }
    ]
  },
  {
    id: 'maj-kr-m1',
    from: 'majestic',
    to: 'krPuram',
    mode: 'metro',
    code: 'Metro M1',
    durationMin: 33,
    stopsCount: 6,
    fare: 30,
    nextDeparture: '6 min',
    nextDepartureMinutes: 6,
    stops: [
      { name: { en: 'Majestic', hi: 'मजेस्टिक', kn: 'ಮೆಜೆಸ್ಟಿಕ್', ur: 'میجسٹک' }, time: '10:10' },
      { name: { en: 'Sir M Visvesvaraya', hi: 'सर एम विश्वेश्वरैया', kn: 'ಸರ್ ಎಂ ವಿಶ್ವೇಶ್ವರಯ್ಯ', ur: 'سر ایم وشویشوریا' }, time: '10:15' },
      { name: { en: 'Vidhana Soudha', hi: 'विधान सौध', kn: 'ವಿಧಾನ ಸೌಧ', ur: 'ودھان سودھا' }, time: '10:19' },
      { name: { en: 'Cubbon Park', hi: 'कब्बन पार्क', kn: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್', ur: 'کبن پارک' }, time: '10:23' },
      { name: { en: 'Swami Vivekananda Rd', hi: 'स्वामी विवेकानंद रोड', kn: 'ಸ್ವಾಮಿ ವಿವೇಕಾನಂದ ರಸ್ತೆ', ur: 'سوامی وویکانند روڈ' }, time: '10:32' },
      { name: { en: 'K.R. Puram', hi: 'केआर पुरम', kn: 'ಕೆ.ಆರ್. ಪುರಂ', ur: 'کے آر پورم' }, time: '10:43' }
    ]
  },
  // Silkboard -> Whitefield
  {
    id: 'silk-wf-e2',
    from: 'silkboard',
    to: 'whitefield',
    mode: 'bus',
    code: 'Express Bus E2',
    durationMin: 58,
    stopsCount: 7,
    fare: 45,
    nextDeparture: '14 min',
    nextDepartureMinutes: 14,
    stops: [
      { name: { en: 'Silkboard', hi: 'सिल्कबोर्ड', kn: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್', ur: 'سلک بورڈ' }, time: '07:30' },
      { name: { en: 'HSR Layout', hi: 'एचएसआर लेआउट', kn: 'ಎಚ್.ಎಸ್.ಆರ್ ಲೇಔಟ್', ur: 'ایچ ایس آر لے آؤٹ' }, time: '07:37' },
      { name: { en: 'Bellandur', hi: 'बेलंदूर', kn: 'ಬೆಳ್ಳಂದೂರು', ur: 'بیلاندر' }, time: '07:47' },
      { name: { en: 'Devarabisanahalli', hi: 'देवराबीसनहल्ली', kn: 'ದೇವರಬಿಸನಹಳ್ಳಿ', ur: 'دیورا بیسی نہلی' }, time: '07:56' },
      { name: { en: 'Marathahalli', hi: 'मराठहल्ली', kn: 'ಮಾರತ್ಹಳ್ಳಿ', ur: 'ಮಾರ್ಥಹಳ್ಳಿ' }, time: '08:08' },
      { name: { en: 'Kundalahalli', hi: 'कुंदनहल्ली', kn: 'ಕುಂದಲಹಳ್ಳಿ', ur: 'کندنہلی' }, time: '08:18' },
      { name: { en: 'Whitefield', hi: 'व्हाइटफील्ड', kn: 'ವೈಟ್ಫೀಲ್ಡ್', ur: 'وائٹ فیلڈ' }, time: '08:28' }
    ]
  },
  {
    id: 'silk-wf-500k',
    from: 'silkboard',
    to: 'whitefield',
    mode: 'bus',
    code: 'Bus 500K',
    durationMin: 72,
    stopsCount: 15,
    fare: 30,
    nextDeparture: '20 min',
    nextDepartureMinutes: 20,
    stops: [
      { name: { en: 'Silkboard', hi: 'सिल्कबोर्ड', kn: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್', ur: 'سلک بورڈ' }, time: '07:45' },
      { name: { en: 'Agara', hi: 'अगरा', kn: 'ಅಗರ', ur: 'اگرا' }, time: '07:53' },
      { name: { en: 'Iblur Junction', hi: 'इब्लूर जंक्शन', kn: 'ಇಬ್ಲೂರು ಜಂಕ್ಷನ್', ur: 'ابلور جنکشن' }, time: '08:01' },
      { name: { en: 'Bellandur EcoSpace', hi: 'इकोस्पेस', kn: 'ಇಕೋಸ್ಪೇಸ್', ur: 'ایکو اسپیس' }, time: '08:12' },
      { name: { en: 'Kadubeesanahalli', hi: 'काडुबीसनहल्ली', kn: 'ಕಾಡುಬಿಸನಹಳ್ಳಿ', ur: 'کاڈو بیسن ہلی' }, time: '08:22' },
      { name: { en: 'Marathahalli Bridge', hi: 'मराठहल्ली ब्रिज', kn: 'ಮಾರತ್ಹಳ್ಳಿ ಬ್ರಿಡ್ಜ್', ur: 'مارتھہلی پل' }, time: '08:35' },
      { name: { en: 'Whitefield', hi: 'व्हाइटफील्ड', kn: 'ವೈಟ್ಫೀಲ್ಡ್', ur: 'وائٹ فیلڈ' }, time: '08:57' }
    ]
  }
];

export function getRouteById(id) {
  // First check static demonstration data
  const staticMatch = ROUTES_DATA.find(r => r.id === id);
  if (staticMatch) return staticMatch;

  // Next check if generated route id
  if (id && id.startsWith('line-')) {
    const parts = id.split('-');
    // format: line-id-from-to
    const lineId = `${parts[0]}-${parts[1]}`;
    const fromId = parts[2];
    const toId = parts[3];
    const generated = findRoutes(fromId, toId);
    const found = generated.find(r => r.id === id);
    if (found) return found;
  }

  if (id && id.startsWith('transfer-')) {
    const parts = id.split('-');
    const fromId = parts[1];
    const toId = parts[3];
    const generated = findRoutes(fromId, toId);
    const found = generated.find(r => r.id === id);
    if (found) return found;
  }

  // Fallback to first available route
  return ROUTES_DATA[0];
}
