/**
 * TransitOne - Internationalization (i18n) Engine
 * Unified RTL and Indic Design System
 * Supported Languages: English (en), Hindi (hi), Kannada (kn), Urdu (ur)
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', welcome: 'Welcome', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', welcome: 'स्वागत है', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', welcome: 'ಸ್ವಾಗತ', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', welcome: 'خوش آمدید', dir: 'rtl' }
];

export const translations = {
  en: {
    appName: 'TransitOne',
    tagline: 'Move freely. Travel Confidently',
    welcomeTitle: 'Welcome to TransitOne',
    welcomeSub: 'Your journey, Your language',
    chooseLang: 'Choose your preferred language',
    changeAnytime: 'You can change this anytime in Settings.',
    langCanChange: 'Language can be changed anytime.',
    interfaceDirection: 'Interface direction',
    welcomeWord: 'Welcome',
    continue: 'CONTINUE →',
    fromLabel: 'From',
    toLabel: 'To',
    searchRoutes: 'Search routes',
    recentSearches: 'Recent searches',
    seeAll: 'See all',
    availableRoutes: 'Available routes',
    routeDetails: 'Route Details',
    stopsTimeline: 'Stops & Timetable',
    stopsCountTitle: 'Stops',
    durationLabel: 'Duration',
    fareLabel: 'Fare',
    departureLabel: 'Next departure',
    nextDeparture: 'Next departure',
    searchAgain: 'Search again',
    min: 'min',
    stops: 'stops',
    back: 'Back',
    navHome: 'Home',
    navSearch: 'Search',
    navSettings: 'Settings',
    language: 'Language',
    accessibility: 'Accessibility',
    makeEasier: 'Make the app easier to use',
    largerText: 'Larger text',
    largerTextDesc: 'Increase text size across the app',
    highContrast: 'High contrast',
    highContrastDesc: 'Use stronger colours for better visibility',
    about: 'About app',
    aboutDesc: 'App version, credits and more information',
    prototypeTools: 'Prototype tools',
    designSystem: 'Design System',
    forceOpposite: 'Force opposite direction (layout stress test)',
    textExpansion: 'Text-expansion stress test (+40%)',
    emptyTitle: 'No routes found',
    emptyDesc: 'No direct public transit routes found between these locations.',
    tryAnother: 'Try another route',
    loadingRoutes: 'Searching for fastest connections...',
    errorSameLocation: 'Origin and destination cannot be identical.',
    errorEmptyLocation: 'Please select both origin and destination.',
    offlineBanner: 'You are currently offline. Showing scheduled data.',
    deniedTitle: 'Location Access Blocked',
    deniedDesc: 'Location access was denied. You can select your stops manually.',
    enterManually: 'Enter location manually',
    aboutModalTitle: 'About TransitOne',
    aboutAcademicNotice: 'Academic prototype, demo data only. Version 2.0. Built with Unified RTL and Indic Design System.',
    close: 'Close',
    langAnnounce: 'Language changed to English',
    filterAll: 'All',
    filterMetro: 'Metro',
    filterBus: 'Bus',
    sortFastest: 'Fastest',
    sortCheapest: 'Cheapest',
    sortFewestStops: 'Fewest stops',
    favouriteRoutes: 'Saved routes',
    saveRoute: 'Save route',
    routeSaved: 'Saved',
    shareRoute: 'Share',
    linkCopied: 'Link copied to clipboard',
    liveBadge: 'Live',
    departuresTimeline: 'Upcoming Departures',
    comboboxNoMatch: 'No matching stops found',
    swapLocations: 'Swap origin and destination',
    buyTicket: 'Buy ticket',
    myTickets: 'My tickets',
    passengers: 'Passengers',
    passenger: 'Passenger',
    passengerName: 'Traveler name',
    passengerPhone: 'Mobile number',
    paymentMethod: 'Payment method',
    payUpi: 'UPI Payment',
    payCard: 'Transit Card',
    payCash: 'Cash at counter',
    totalFare: 'Total fare',
    confirmAndPay: 'Confirm & Book (Demo)',
    ticketConfirmed: 'Ticket Confirmed',
    showQrAtGate: 'Scan QR code at automated gate',
    ticketId: 'Ticket ID',
    validFor: 'Valid for today on selected corridor',
    numerals: 'Numerals',
    latinDigits: 'Latin (1, 2, 3)',
    nativeDigits: 'Native script digits',
    clearSavedData: 'Clear saved data',
    dataCleared: 'All demonstration data cleared',
    directRoute: 'Direct route',
    transferRoute: '1 Transfer',
    transferAt: 'Transfer at'
  },
  hi: {
    appName: 'TransitOne',
    tagline: 'Move freely. Travel Confidently',
    welcomeTitle: 'TransitOne में आपका स्वागत है',
    welcomeSub: 'अपनी यात्रा, अपनी भाषा',
    chooseLang: 'अपनी पसंदीदा भाषा चुनें',
    changeAnytime: 'आप इसे बाद में सेटिंग्स में बदल सकते हैं',
    langCanChange: 'भाषा कभी भी बदली जा सकती है।',
    interfaceDirection: 'इंटरफ़ेस दिशा',
    welcomeWord: 'स्वागत है',
    continue: 'जारी रखें →',
    fromLabel: 'से',
    toLabel: 'तक',
    searchRoutes: 'मार्ग खोजें',
    recentSearches: 'हाल की खोजें',
    seeAll: 'सभी देखें',
    availableRoutes: 'उपलब्ध मार्ग',
    routeDetails: 'मार्ग विवरण',
    stopsTimeline: 'स्टॉप और समय सारिणी',
    stopsCountTitle: 'स्टॉप',
    durationLabel: 'अवधि',
    fareLabel: 'किराया',
    departureLabel: 'अगली प्रस्थान',
    nextDeparture: 'अगली प्रस्थान',
    searchAgain: 'फिर से खोजें',
    min: 'मिनट',
    stops: 'स्टॉप',
    back: 'वापस',
    navHome: 'होम',
    navSearch: 'खोजें',
    navSettings: 'सेटिंग्स',
    language: 'भाषा',
    accessibility: 'सुगम्यता',
    makeEasier: 'ऐप को उपयोग में अधिक आसान बनाएं',
    largerText: 'बड़ा टेक्स्ट',
    largerTextDesc: 'ऐप में टेक्स्ट का आकार बढ़ाएं',
    highContrast: 'उच्च कंट्रास्ट',
    highContrastDesc: 'बेहतर दृश्यता के लिए मजबूत रंग उपयोग करें',
    about: 'ऐप के बारे में',
    aboutDesc: 'ऐप संस्करण, क्रेडिट और अन्य जानकारी',
    prototypeTools: 'प्रोटोटाइप टूल्स',
    designSystem: 'डिज़ाइन सिस्टम',
    forceOpposite: 'विपरीत दिशा लागू करें (दिशा परीक्षण)',
    textExpansion: 'विस्तारित टेक्स्ट परीक्षण (+40%)',
    emptyTitle: 'कोई मार्ग नहीं मिला',
    emptyDesc: 'इन स्थानों के बीच कोई सीधा सार्वजनिक परिवहन उपलब्ध नहीं है।',
    tryAnother: 'दूसरा मार्ग खोजें',
    loadingRoutes: 'निकटतम मार्गों की खोज जारी है...',
    errorSameLocation: 'प्रारंभिक और अंतिम स्थान एक समान नहीं हो सकते।',
    errorEmptyLocation: 'कृपया दोनों स्थान चुनें।',
    offlineBanner: 'आप ऑफ़लाइन हैं। पूर्व-निर्धारित डेटा दिखाया जा रहा है।',
    deniedTitle: 'स्थान अनुमति अवरुद्ध',
    deniedDesc: 'स्थान अनुमति अस्वीकृत है। आप स्थान स्वयं चुन सकते हैं।',
    enterManually: 'स्थान मैन्युअल दर्ज करें',
    aboutModalTitle: 'TransitOne के बारे में',
    aboutAcademicNotice: 'शैक्षणिक प्रोटोटाइप, केवल प्रदर्शन डेटा। संस्करण 2.0।',
    close: 'बंद करें',
    langAnnounce: 'भाषा बदलकर हिन्दी कर दी गई है',
    filterAll: 'सभी',
    filterMetro: 'मेट्रो',
    filterBus: 'बस',
    sortFastest: 'सबसे तेज़',
    sortCheapest: 'किफ़ायती',
    sortFewestStops: 'कम स्टॉप',
    favouriteRoutes: 'सहेजे गए मार्ग',
    saveRoute: 'मार्ग सहेजें',
    routeSaved: 'सहेजा गया',
    shareRoute: 'शेयर करें',
    linkCopied: 'लिंक क्लिपबोर्ड पर कॉपी किया गया',
    liveBadge: 'लाइव',
    departuresTimeline: 'आगामी रवानगी समय',
    comboboxNoMatch: 'कोई मेल खाता स्टॉप नहीं मिला',
    swapLocations: 'स्थान आपस में बदलें',
    buyTicket: 'टिकट खरीदें',
    myTickets: 'मेरे टिकट',
    passengers: 'यात्री',
    passenger: 'यात्री',
    passengerName: 'यात्री का नाम',
    passengerPhone: 'मोबाइल नंबर',
    paymentMethod: 'भुगतान विधि',
    payUpi: 'यूपीआई भुगतान',
    payCard: 'ट्रांज़िट कार्ड',
    payCash: 'काउंटर पर नकद',
    totalFare: 'कुल किराया',
    confirmAndPay: 'पुष्टि करें और बुक करें (डेमो)',
    ticketConfirmed: 'टिकट पुष्ट हुआ',
    showQrAtGate: 'स्वचालित गेट पर क्यूआर स्कैन करें',
    ticketId: 'टिकट आईडी',
    validFor: 'चयनित मार्ग पर आज के लिए मान्य',
    numerals: 'अंक प्रणाली',
    latinDigits: 'लैटिन (1, 2, 3)',
    nativeDigits: 'देवनागरी अंक (१, २, ३)',
    clearSavedData: 'सहेजा गया डेटा साफ़ करें',
    dataCleared: 'सभी प्रदर्शन डेटा साफ़ कर दिया गया है',
    directRoute: 'सीधा मार्ग',
    transferRoute: '1 स्थानांतरण',
    transferAt: 'स्थान परिवर्तन:'
  },
  kn: {
    appName: 'TransitOne',
    tagline: 'Move freely. Travel Confidently',
    welcomeTitle: 'TransitOne ಗೆ ಸ್ವಾಗತ',
    welcomeSub: 'ನಿಮ್ಮ ಪ್ರಯಾಣ, ನಿಮ್ಮ ಭಾಷೆ',
    chooseLang: 'ನಿಮ್ಮ ಇಷ್ಟದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    changeAnytime: 'ನೀವು ನಂತರ ಸೆಟ್ಟಿಂಗ್ಗಳಲ್ಲಿ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು',
    langCanChange: 'ಯಾವಾಗ ಬೇಕಾದರೂ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು.',
    interfaceDirection: 'ಇಂಟರ್ಫೇಸ್ ದಿಕ್ಕು',
    welcomeWord: 'ಸ್ವಾಗತ',
    continue: 'ಮುಂದುವರಿಸಿ →',
    fromLabel: 'ಇಂದ',
    toLabel: 'ಗೆ',
    searchRoutes: 'ಮಾರ್ಗ ಹುಡುಕಿ',
    recentSearches: 'ಇತ್ತೀಚಿನ ಹುಡುಕಾಟಗಳು',
    seeAll: 'ಎಲ್ಲಾ ನೋಡಿ',
    availableRoutes: 'ಲಭ್ಯವಿರುವ ಮಾರ್ಗಗಳು',
    routeDetails: 'ಮಾರ್ಗದ ವಿವರಗಳು',
    stopsTimeline: 'ನಿಲ್ದಾಣಗಳು ಮತ್ತು ಸಮಯಪಟ್ಟಿ',
    stopsCountTitle: 'ನಿಲ್ದಾಣಗಳು',
    durationLabel: 'ಅವಧಿ',
    fareLabel: 'ಪ್ರಯಾಣ ದರ',
    departureLabel: 'ಮುಂದಿನ ನಿರ್ಗಮನ',
    nextDeparture: 'ಮುಂದಿನ ನಿರ್ಗಮನ',
    searchAgain: 'ಮತ್ತೆ ಹುಡುಕಿ',
    min: 'ನಿಮಿಷ',
    stops: 'ನಿಲ್ದಾಣಗಳು',
    back: 'ಹಿಂದೆ',
    navHome: 'ಮುಖಪುಟ',
    navSearch: 'ಹುಡುಕಿ',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    language: 'ಭಾಷೆ',
    accessibility: 'ಸುಗಮ ಬಳಕೆ',
    makeEasier: 'ಆಪ್ ಬಳಕೆಯನ್ನು ಇನ್ನಷ್ಟು ಸುಲಭಗೊಳಿಸಿ',
    largerText: 'ದೊಡ್ಡ ಗಾತ್ರದ ಪಠ್ಯ',
    largerTextDesc: 'ಆಪ್ನಲ್ಲಿ ಪಠ್ಯದ ಗಾತ್ರವನ್ನು ಹೆಚ್ಚಿಸಿ',
    highContrast: 'ಹೆಚ್ಚು ಕಾಂಟ್ರಾಸ್ಟ್',
    highContrastDesc: 'ಉತ್ತಮ ದೃಷ್ಟಿಗಾಗಿ ಹೆಚ್ಚು ಸ್ಪಷ್ಟ ಬಣ್ಣಗಳನ್ನು ಬಳಸಿ',
    about: 'ಆಪ್ ಕುರಿತು',
    aboutDesc: 'ಆಪ್ ಆವೃತ್ತಿ, ಕ್ರೆಡಿಟ್ ಮತ್ತು ಇತರ ಮಾಹಿತಿ',
    prototypeTools: 'ಮಾದರಿ ಪರಿಕರಗಳು',
    designSystem: 'ವಿನ್ಯಾಸ ವ್ಯವಸ್ಥೆ',
    forceOpposite: 'ವಿರುದ್ಧ ದಿಕ್ಕು ಜಾರಿಗೊಳಿಸಿ (ವಿನ್ಯಾಸ ಪರೀಕ್ಷೆ)',
    textExpansion: 'ಪಠ್ಯ ವಿಸ್ತರಣೆ ಪರೀಕ್ಷೆ (+40%)',
    emptyTitle: 'ಯಾವುದೇ ಮಾರ್ಗ ಕಂಡುಬಂದಿಲ್ಲ',
    emptyDesc: 'ಈ ಸ್ಥಳಗಳ ನಡುವೆ ನೇರ ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ ಲಭ್ಯವಿಲ್ಲ.',
    tryAnother: 'ಬೇರೆ ಮಾರ್ಗ ಹುಡುಕಿ',
    loadingRoutes: 'ವೇಗದ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    errorSameLocation: 'ಆರಂಭಿಕ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನ ಒಂದೇ ಆಗಿರಬಾರದು.',
    errorEmptyLocation: 'ದಯವಿಟ್ಟು ಎರಡೂ ಸ್ಥಳಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    offlineBanner: 'ನೀವು ಆಫ್ಲೈನ್ನಲ್ಲಿದ್ದೀರಿ. ವೇಳಾಪಟ್ಟಿ ಡೇಟಾ ತೋರಿಸಲಾಗುತ್ತಿದೆ.',
    deniedTitle: 'ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ',
    deniedDesc: 'ಸ್ಥಳದ ಅನುಮತಿ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಹಸ್ತಚಾಲಿತವಾಗಿ ಆಯ್ಕೆ ಮಾಡಬಹುದು.',
    enterManually: 'ಸ್ಥಳವನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ',
    aboutModalTitle: 'TransitOne ಬಗ್ಗೆ',
    aboutAcademicNotice: 'ಶೈಕ್ಷಣಿಕ ಮಾದರಿ, ಕೇವಲ ಪ್ರಾಯೋಗಿಕ ಮಾಹಿತಿ. ಆವೃತ್ತಿ 2.0.',
    close: 'ಮುಚ್ಚಿ',
    langAnnounce: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ',
    filterAll: 'ಎಲ್ಲವೂ',
    filterMetro: 'ಮೆಟ್ರೋ',
    filterBus: 'ಬಸ್',
    sortFastest: 'ಅತ್ಯಂತ ವೇಗ',
    sortCheapest: 'ಕಡಿಮೆ ದರ',
    sortFewestStops: 'ಕಡಿಮೆ ನಿಲ್ದಾಣ',
    favouriteRoutes: 'ಉಳಿಸಿದ ಮಾರ್ಗಗಳು',
    saveRoute: 'ಮಾರ್ಗ ಉಳಿಸಿ',
    routeSaved: 'ಉಳಿಸಲಾಗಿದೆ',
    shareRoute: 'ಹಂಚಿಕೊಳ್ಳಿ',
    linkCopied: 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ',
    liveBadge: 'ಲೈವ್',
    departuresTimeline: 'ಮುಂದಿನ ನಿರ್ಗಮನಗಳು',
    comboboxNoMatch: 'ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ನಿಲ್ದಾಣ ಕಂಡುಬಂದಿಲ್ಲ',
    swapLocations: 'ಸ್ಥಳಗಳನ್ನು ಅದಲುಬದಲು ಮಾಡಿ',
    buyTicket: 'ಟಿಕೆಟ್ ಖರೀದಿಸಿ',
    myTickets: 'ನನ್ನ ಟಿಕೆಟ್ಗಳು',
    passengers: 'ಪ್ರಯಾಣಿಕರು',
    passenger: 'ಪ್ರಯಾಣಿಕ',
    passengerName: 'ಪ್ರಯಾಣಿಕರ ಹೆಸರು',
    passengerPhone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
    payUpi: 'ಯುಪಿಐ ಪಾವತಿ',
    payCard: 'ಟ್ರಾನ್ಸಿಟ್ ಕಾರ್ಡ್',
    payCash: 'ಕೌಂಟರ್ ನಗದು',
    totalFare: 'ಒಟ್ಟು ದರ',
    confirmAndPay: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಬುಕ್ ಮಾಡಿ (ಮಾದರಿ)',
    ticketConfirmed: 'ಟಿಕೆಟ್ ದೃಢಪಟ್ಟಿದೆ',
    showQrAtGate: 'ಸ್ವಯಂಚಾಲಿತ ಗೇಟ್ನಲ್ಲಿ ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    ticketId: 'ಟಿಕೆಟ್ ಸಂಖ್ಯೆ',
    validFor: 'ಆಯ್ಕೆಮಾಡಿದ ಮಾರ್ಗದಲ್ಲಿ ಇಂದಿಗೆ ಮಾನ್ಯವಾಗಿದೆ',
    numerals: 'ಸಂಖ್ಯೆಗಳು',
    latinDigits: 'ಲ್ಯಾಟಿನ್ (1, 2, 3)',
    nativeDigits: 'ಕನ್ನಡ ಅಂಕಿಗಳು (೧, ೨, ೩)',
    clearSavedData: 'ಡೇಟಾ ಅಳಿಸಿ',
    dataCleared: 'ಎಲ್ಲಾ ಮಾದರಿ ಡೇಟಾವನ್ನು ಅಳಿಸಲಾಗಿದೆ',
    directRoute: 'ನೇರ ಮಾರ್ಗ',
    transferRoute: '1 ಬದಲಾವಣೆ',
    transferAt: 'ಬದಲಾವಣಾ ಸ್ಥಳ:'
  },
  ur: {
    appName: 'TransitOne',
    tagline: 'Move freely. Travel Confidently',
    welcomeTitle: 'TransitOne میں خوش آمدید',
    welcomeSub: 'اپنی زبان، اپنا سفر',
    chooseLang: 'اپنی پسندیدہ زبان منتخب کریں',
    changeAnytime: 'آپ یہ انتخاب بعد میں بھی سیٹنگز میں بدل سکتے ہیں',
    langCanChange: 'زبان کسی بھی وقت تبدیل کی جا سکتی ہے۔',
    interfaceDirection: 'انٹرفیس کی سمت',
    welcomeWord: 'خوش آمدید',
    continue: 'جاری رکھیں ←',
    fromLabel: 'سے',
    toLabel: 'تک',
    searchRoutes: 'راستہ تلاش کریں',
    recentSearches: 'حالیہ تلاشیں',
    seeAll: 'سب دیکھیں',
    availableRoutes: 'دستیاب راستے',
    routeDetails: 'راستے کی تفصیلات',
    stopsTimeline: 'اسٹاپس اور ٹائم ٹیبل',
    stopsCountTitle: 'اسٹاپس',
    durationLabel: 'مدت',
    fareLabel: 'کرایہ',
    departureLabel: 'اگلی روانگی',
    nextDeparture: 'اگلی روانگی',
    searchAgain: 'دوبارہ تلاش کریں',
    min: 'منٹ',
    stops: 'اسٹاپ',
    back: 'واپس',
    navHome: 'ہوم',
    navSearch: 'تلاش',
    navSettings: 'سیٹنگز',
    language: 'زبان',
    accessibility: 'رسائی کی سہولت',
    makeEasier: 'ایپ کو استعمال میں آسان بنائیں',
    largerText: 'بڑا متن',
    largerTextDesc: 'ایپ میں متن کا سائز بڑھائیں',
    highContrast: 'ہائی کنٹراسٹ',
    highContrastDesc: 'بہتر دکھائی کے لیے مضبوط رنگ استعمال کریں',
    about: 'ایپ کے بارے میں',
    aboutDesc: 'ایپ کا ورژن، کریڈٹس اور مزید معلومات',
    prototypeTools: 'پروٹوٹائپ ٹولز',
    designSystem: 'ڈیزائن سسٹم',
    forceOpposite: 'مخالف سمت نافذ کریں (لے آؤٹ ٹیسٹ)',
    textExpansion: 'متن کی توسیع کا ٹیسٹ (+40%)',
    emptyTitle: 'کوئی راستہ نہیں ملا',
    emptyDesc: 'ان مقامات کے درمیان کوئی براہ راست پبلک ٹرانسپورٹ دستیاب نہیں ہے۔',
    tryAnother: 'دوسرا راستہ آزمائیں',
    loadingRoutes: 'تیز ترین راستوں کی تلاش جاری ہے...',
    errorSameLocation: 'روانگی اور منزل کے مقامات ایک جیسے نہیں ہو سکتے۔',
    errorEmptyLocation: 'براہ کرم دونوں مقامات منتخب کریں۔',
    offlineBanner: 'آپ اس وقت آف لائن ہیں۔ شیڈول ڈیٹا دکھایا جا رہا ہے۔',
    deniedTitle: 'مقام کی رسائی مسدود ہے',
    deniedDesc: 'مقام کی اجازت مسترد کر دی گئی ہے۔ آپ دستی طور پر انتخاب کر سکتے ہیں۔',
    enterManually: 'مقام دستی طور پر درج کریں',
    aboutModalTitle: 'TransitOne کا تعارف',
    aboutAcademicNotice: 'تعلیمی پروٹوٹائپ، صرف نمائشی ڈیٹا۔ ورژن 2.0۔',
    close: 'بند کریں',
    langAnnounce: 'زبان اردو میں تبدیل کر دی گئی ہے',
    filterAll: 'تمام',
    filterMetro: 'میٹرو',
    filterBus: 'بس',
    sortFastest: 'تیز ترین',
    sortCheapest: 'سستا ترین',
    sortFewestStops: 'کم اسٹاپس',
    favouriteRoutes: 'محفوظ شدہ راستے',
    saveRoute: 'راستہ محفوظ کریں',
    routeSaved: 'محفوظ',
    shareRoute: 'شیئر کریں',
    linkCopied: 'لنک کاپی ہو گیا',
    liveBadge: 'لائیو',
    departuresTimeline: 'اگلی روانگیاں',
    comboboxNoMatch: 'کوئی مماثل اسٹاپ نہیں ملا',
    swapLocations: 'روانگی اور منزل کا تبادلہ',
    buyTicket: 'ٹکٹ خریدیں',
    myTickets: 'میرے ٹکٹ',
    passengers: 'مسافر',
    passenger: 'مسافر',
    passengerName: 'مسافر کا نام',
    passengerPhone: 'موبائل نمبر',
    paymentMethod: 'طریقۂ ادائیگی',
    payUpi: 'یو پی آئی',
    payCard: 'ٹرانزٹ کارڈ',
    payCash: 'کاؤنٹر نقد',
    totalFare: 'کل کرایہ',
    confirmAndPay: 'تصدیق اور بک کریں (ڈیمو)',
    ticketConfirmed: 'ٹکٹ کی تصدیق ہو گئی',
    showQrAtGate: 'خودکار گیٹ پر کیو آر اسکین کریں',
    ticketId: 'ٹکٹ نمبر',
    validFor: 'منتخب راستے پر آج کے لیے درست',
    numerals: 'ہندسے',
    latinDigits: 'لاطینی (1, 2, 3)',
    nativeDigits: 'مشرقی عربی ہندسے (۱، ۲، ۳)',
    clearSavedData: 'محفوظ ڈیٹا صاف کریں',
    dataCleared: 'تمام نمائشی ڈیٹا صاف کر دیا گیا ہے',
    directRoute: 'براہ راست راستہ',
    transferRoute: '1 منتقلی',
    transferAt: 'منتقلی بذریعہ:'
  }
};

const STORAGE_KEY = 'transitone_lang';

export function getStoredLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['en', 'hi', 'kn', 'ur'].includes(saved)) {
      return saved;
    }
  } catch (e) {
    // LocalStorage unavailable
  }
  return null;
}

export function setStoredLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // LocalStorage unavailable
  }
}

let currentLanguage = getStoredLanguage() || 'en';
let forcedOppositeDir = false;
let textExpansionActive = false;

export function getCurrentLanguage() {
  return currentLanguage;
}

export function isForcedOpposite() {
  return forcedOppositeDir;
}

export function setForcedOpposite(val) {
  forcedOppositeDir = val;
  applyDir();
}

export function isTextExpansionActive() {
  return textExpansionActive;
}

export function setTextExpansionActive(val) {
  textExpansionActive = val;
  if (typeof renderCallback === 'function') {
    renderCallback(currentLanguage);
  }
}

export function t(key) {
  const langTable = translations[currentLanguage] || translations.en;
  let text = langTable[key] || translations.en[key] || key;
  if (textExpansionActive && typeof text === 'string' && text.length > 3) {
    return `${text} [+++]`;
  }
  return text;
}

let renderCallback = null;

export function registerRenderCallback(fn) {
  renderCallback = fn;
}

function applyDir() {
  const naturalRTL = (currentLanguage === 'ur');
  const effectiveRTL = forcedOppositeDir ? !naturalRTL : naturalRTL;
  document.documentElement.dir = effectiveRTL ? 'rtl' : 'ltr';
}

export function applyLanguage(lang) {
  if (!['en', 'hi', 'kn', 'ur'].includes(lang)) {
    lang = 'en';
  }
  currentLanguage = lang;
  setStoredLanguage(lang);
  
  document.documentElement.lang = lang;
  applyDir();
  
  document.title = `${t('appName')} - ${t('tagline')}`;
  
  const announcer = document.getElementById('live-announcer');
  if (announcer) {
    announcer.textContent = t('langAnnounce');
  }
  
  if (typeof renderCallback === 'function') {
    renderCallback(lang);
  }
}
