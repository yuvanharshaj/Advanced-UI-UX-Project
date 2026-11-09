/**
 * TransitOne - Demonstration Data
 * 
 * Note: Demonstration data for prototype routes across Bangalore transit corridors.
 * All route codes stay in Latin script and must be wrapped in <bdi>.
 * Station names are localised per supported language.
 */

export const PLACES = {
  majestic: {
    id: 'majestic',
    en: 'Majestic',
    hi: 'मजेस्टिक',
    kn: 'ಮೆಜೆಸ್ಟಿಕ್',
    ur: 'میجسٹک'
  },
  whitefield: {
    id: 'whitefield',
    en: 'Whitefield',
    hi: 'व्हाइटफील्ड',
    kn: 'ವೈಟ್ಫೀಲ್ಡ್',
    ur: 'وائٹ فیلڈ'
  },
  hebbal: {
    id: 'hebbal',
    en: 'Hebbal',
    hi: 'हेब्बल',
    kn: 'ಹೆಬ್ಬಾಳ',
    ur: 'ہیبل'
  },
  mgRoad: {
    id: 'mgRoad',
    en: 'M.G. Road',
    hi: 'एम.जी. रोड',
    kn: 'ಎಂ.ಜಿ. ರಸ್ತೆ',
    ur: 'ایم جی روڈ'
  },
  krPuram: {
    id: 'krPuram',
    en: 'K.R. Puram',
    hi: 'केआर पुरम',
    kn: 'ಕೆ.ಆರ್. ಪುರಂ',
    ur: 'کے آر پورم'
  },
  silkboard: {
    id: 'silkboard',
    en: 'Silkboard',
    hi: 'सिल्कबोर्ड',
    kn: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್',
    ur: 'سلک بورڈ'
  }
};

export function getPlaceName(placeId, lang = 'en') {
  const place = PLACES[placeId];
  if (!place) return placeId;
  return place[lang] || place.en;
}

/**
 * Route Corridors & Schedules (Demonstration Data)
 * Ordered stops list has 6+ stops with realistic timetable minutes.
 */
export const ROUTES_DATA = [
  // Majestic -> Whitefield Corridor
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

  // Hebbal -> M.G. Road Corridor
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
    stops: [
      { name: { en: 'Hebbal', hi: 'हेब्बल', kn: 'ಹೆಬ್ಬಾಳ', ur: 'ہیبل' }, time: '08:30' },
      { name: { en: 'Ganganagar', hi: 'गंगानगर', kn: 'ಗಂಗಾನಗರ', ur: 'گنگا نگر' }, time: '08:36' },
      { name: { en: 'Mekhri Circle', hi: 'मेखरी सर्कल', kn: 'ಮೇಖ್ರಿ ಸರ್ಕಲ್', ur: 'ಮೇಖ್ರಿ ಸರ್ಕಲ್' }, time: '08:42' },
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
    stops: [
      { name: { en: 'Hebbal', hi: 'हेब्बल', kn: 'ಹೆಬ್ಬಾಳ', ur: 'ہیبل' }, time: '08:35' },
      { name: { en: 'Veterinary College', hi: 'पशु चिकित्सा कॉलेज', kn: 'ಪಶುವೈದ್ಯಕೀಯ ಕಾಲೇಜು', ur: 'ویٹرنری کالج' }, time: '08:41' },
      { name: { en: 'Palace Guttahalli', hi: 'पैलेस गुट्टाहल्ली', kn: 'ಅರಮನೆ ಗುಟ್ಟಹಳ್ಳಿ', ur: 'پیلس گٹہلی' }, time: '08:48' },
      { name: { en: 'Cubbon Park', hi: 'कब्बन पार्क', kn: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್', ur: 'کبن پارک' }, time: '08:56' },
      { name: { en: 'M.G. Road', hi: 'एम.जी. रोड', kn: 'ಎಂ.ಜಿ. ರಸ್ತೆ', ur: 'ایم جی روڈ' }, time: '09:03' }
    ]
  },

  // Majestic -> K.R. Puram Corridor
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
    stops: [
      { name: { en: 'Majestic', hi: 'मजेस्टिक', kn: 'ಮೆಜೆಸ್ಟಿಕ್', ur: 'میجسٹک' }, time: '10:10' },
      { name: { en: 'Sir M Visvesvaraya', hi: 'सर एम विश्वेश्वरैया', kn: 'ಸರ್ ಎಂ ವಿಶ್ವೇಶ್ವರಯ್ಯ', ur: 'سر ایم وشویشوریا' }, time: '10:15' },
      { name: { en: 'Vidhana Soudha', hi: 'विधान सौध', kn: 'ವಿಧಾನ ಸೌಧ', ur: 'ودھان سودھا' }, time: '10:19' },
      { name: { en: 'Cubbon Park', hi: 'कब्बन पार्क', kn: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್', ur: 'کبن پارک' }, time: '10:23' },
      { name: { en: 'Swami Vivekananda Rd', hi: 'स्वामी विवेकानंद रोड', kn: 'ಸ್ವಾಮಿ ವಿವೇಕಾನಂದ ರಸ್ತೆ', ur: 'سوامی وویکانند روڈ' }, time: '10:32' },
      { name: { en: 'K.R. Puram', hi: 'केआर पुरम', kn: 'ಕೆ.ಆರ್. ಪುರಂ', ur: 'کے آر پورم' }, time: '10:43' }
    ]
  },

  // Silkboard -> Whitefield Corridor
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
    stops: [
      { name: { en: 'Silkboard', hi: 'सिल्कबोर्ड', kn: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್', ur: 'سلک بورಡ್' }, time: '07:45' },
      { name: { en: 'Agara', hi: 'अगरा', kn: 'ಅಗರ', ur: 'اگرا' }, time: '07:53' },
      { name: { en: 'Iblur Junction', hi: 'इब्लूर जंक्शन', kn: 'ಇಬ್ಲೂರು ಜಂಕ್ಷನ್', ur: 'ابلور جنکشن' }, time: '08:01' },
      { name: { en: 'Bellandur EcoSpace', hi: 'इकोस्पेस', kn: 'ಇಕೋಸ್ಪೇಸ್', ur: 'ایکو اسپیس' }, time: '08:12' },
      { name: { en: 'Kadubeesanahalli', hi: 'काडुबीसनहल्ली', kn: 'ಕಾಡುಬಿಸನಹಳ್ಳಿ', ur: 'کاڈو بیسن ہلی' }, time: '08:22' },
      { name: { en: 'Marathahalli Bridge', hi: 'मराठहल्ली ब्रिज', kn: 'ಮಾರತ್ಹಳ್ಳಿ ಬ್ರಿಡ್ಜ್', ur: 'مارتھہلی پل' }, time: '08:35' },
      { name: { en: 'Whitefield', hi: 'व्हाइटफील्ड', kn: 'ವೈಟ್ಫೀಲ್ಡ್', ur: 'وائٹ فیلڈ' }, time: '08:57' }
    ]
  }
];

export function findRoutes(fromId, toId) {
  return ROUTES_DATA.filter(r => r.from === fromId && r.to === toId);
}

export function getRouteById(id) {
  return ROUTES_DATA.find(r => r.id === id) || ROUTES_DATA[0];
}
