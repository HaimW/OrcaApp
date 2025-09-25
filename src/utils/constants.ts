import { WeatherCondition, FishingMethod } from '../types';

export const WEATHER_CONDITIONS: WeatherCondition[] = [
  { condition: 'sunny', label: 'שמש', icon: 'sun' },
  { condition: 'cloudy', label: 'מעונן', icon: 'cloud' },
  { condition: 'rainy', label: 'גשום', icon: 'rain' },
  { condition: 'stormy', label: 'סוער', icon: 'storm' },
  { condition: 'foggy', label: 'ערפילי', icon: 'fog' },
];

export const FISHING_METHODS: FishingMethod[] = [
  { type: 'speargun', label: 'רובה צלילה', icon: 'speargun' },
  { type: 'pole_spear', label: 'פול ספייר', icon: 'pole' },
  { type: 'hook', label: 'חכה', icon: 'hook' },
  { type: 'net', label: 'רשת', icon: 'net' },
  { type: 'other', label: 'אחר', icon: 'other' },
];

export const CURRENT_LEVELS = [
  { value: 'none', label: 'ללא זרם' },
  { value: 'weak', label: 'זרם חלש' },
  { value: 'medium', label: 'זרם בינוני' },
  { value: 'strong', label: 'זרם חזק' },
];

export const COMMON_FISH_SPECIES = [
  'לברק',
  'דניס',
  'בורי',
  'סרגוס',
  'קרפיון',
  'טונה',
  'בקלה',
  'שפמנון',
  'חרוב',
  'מלכה',
  'קציר',
  'שמנון',
  'כוסבר',
  'פרידה',
  'ספר',
  'סולטנית',
  'ברבוניה',
  'ליטרינוס',
  'אוכף',
  'פרפור',
];

export const DIVING_LOCATIONS = [
  'אילת - ספינת הדולפינים',
  'אילת - ריף הדולפינים',
  'אילת - גן לאומי אלמוגים',
  'אילת - חוף מגדן',
  'חיפה - חוף דדו',
  'תל אביב - צוק תל אביב',
  'נתניה - חוף ג\'מבל',
  'אשקלון - חוף דלילה',
  'עכו - חוף הזהב',
  'נהריה - חוף גליל',
  'כנרת - גינוסר',
  'כנרת - אמנון',
  'כנרת - מגדל',
  'ים המלח - עין גדי',
];

export const DEPTH_RANGES = [
  { min: 0, max: 5, label: '0-5 מטר' },
  { min: 5, max: 10, label: '5-10 מטר' },
  { min: 10, max: 15, label: '10-15 מטר' },
  { min: 15, max: 20, label: '15-20 מטר' },
  { min: 20, max: 30, label: '20-30 מטר' },
  { min: 30, max: 999, label: '30+ מטר' },
];

export const VISIBILITY_RANGES = [
  { min: 0, max: 2, label: 'גרועה (0-2 מטר)' },
  { min: 2, max: 5, label: 'בינונית (2-5 מטר)' },
  { min: 5, max: 10, label: 'טובה (5-10 מטר)' },
  { min: 10, max: 20, label: 'מעולה (10-20 מטר)' },
  { min: 20, max: 999, label: 'פנטסטית (20+ מטר)' },
];

export const EQUIPMENT_TYPES = {
  masks: [
    'מסכה סיליקון שחורה',
    'מסכה סיליקון שקופה',
    'מסכה חומר שחור',
    'מסכה עם עדשות תיקון',
  ],
  fins: [
    'סנפירים פלסטיק',
    'סנפירים פייברגלס',
    'סנפירים קרבון',
    'סנפירים מפוצלים',
  ],
  suits: [
    'חליפה 3 מ"מ',
    'חליפה 5 מ"מ',
    'חליפה 7 מ"מ',
    'חליפה יבשה',
    'בגד ים',
  ],
};
