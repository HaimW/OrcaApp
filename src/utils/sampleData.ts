import { DiveEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const sampleDiveEntries: DiveEntry[] = [
  {
    id: uuidv4(),
    date: '2024-01-15',
    time: '08:30',
    location: 'אילת - ספינת הדולפינים',
    coordinates: {
      lat: 29.5581,
      lng: 34.9482
    },
    depth: 15,
    duration: 45,
    visibility: 20,
    weather: {
      condition: 'sunny',
      temperature: 28,
      waterTemperature: 24,
      windSpeed: 5,
      windDirection: 'צפון',
      waveHeight: 0.5,
      current: 'weak'
    },
    equipment: {
      mask: 'מסכה סיליקון שחורה',
      fins: 'סנפירים פייברגלס',
      suit: 'חליפה 3 מ"מ',
      weight: 4,
      gear: ['סכין צלילה', 'מצפן', 'שעון צלילה']
    },
    fishingType: 'speargun',
    catches: [
      {
        id: uuidv4(),
        species: 'לברק',
        weight: 1200,
        length: 35,
        quantity: 1,
        method: 'speargun',
        released: false,
        notes: 'דג יפה שנתפס ליד האלמוגים'
      },
      {
        id: uuidv4(),
        species: 'דניס',
        weight: 800,
        length: 28,
        quantity: 2,
        method: 'speargun',
        released: false
      }
    ],
    photos: [],
    notes: 'צלילה מעולה עם ראות פנטסטית. המים היו צלולים והדגים פעילים. מומלץ לחזור למקום הזה.',
    rating: 5,
    createdAt: '2024-01-15T08:30:00.000Z',
    updatedAt: '2024-01-15T08:30:00.000Z'
  },
  {
    id: uuidv4(),
    date: '2024-01-20',
    time: '07:00',
    location: 'חיפה - חוף דדו',
    depth: 8,
    duration: 30,
    visibility: 5,
    weather: {
      condition: 'cloudy',
      temperature: 22,
      waterTemperature: 19,
      windSpeed: 15,
      windDirection: 'מערב',
      waveHeight: 1.2,
      current: 'medium'
    },
    equipment: {
      mask: 'מסכה סיליקון שקופה',
      fins: 'סנפירים פלסטיק',
      suit: 'חליפה 5 מ"מ',
      weight: 6,
      gear: ['כפפות', 'מגפי צלילה']
    },
    fishingType: 'pole_spear',
    catches: [
      {
        id: uuidv4(),
        species: 'בורי',
        weight: 600,
        length: 25,
        quantity: 1,
        method: 'pole_spear',
        released: true,
        notes: 'דג קטן שהוחזר למים'
      }
    ],
    photos: [],
    notes: 'צלילה מאתגרת בתנאי גלים. הראות הייתה מוגבלת אבל הצלחתי לתפוס דג אחד קטן שהחזרתי למים.',
    rating: 3,
    createdAt: '2024-01-20T07:00:00.000Z',
    updatedAt: '2024-01-20T07:00:00.000Z'
  },
  {
    id: uuidv4(),
    date: '2024-02-01',
    time: '09:15',
    location: 'אשקלון - חוף דלילה',
    depth: 12,
    duration: 40,
    visibility: 8,
    weather: {
      condition: 'sunny',
      temperature: 25,
      waterTemperature: 20,
      windSpeed: 8,
      windDirection: 'דרום מערב',
      waveHeight: 0.8,
      current: 'weak'
    },
    equipment: {
      mask: 'מסכה עם עדשות תיקון',
      fins: 'סנפירים מפוצלים',
      suit: 'חליפה 5 מ"מ',
      weight: 5,
      gear: ['פנס צלילה', 'רשת איסוף']
    },
    fishingType: 'hook',
    catches: [
      {
        id: uuidv4(),
        species: 'סרגוס',
        weight: 400,
        length: 20,
        quantity: 3,
        method: 'hook',
        released: false,
        notes: 'תפיסה טובה עם חכות קטנות'
      }
    ],
    photos: [],
    notes: 'יום נעים עם תנאים טובים. השתמשתי בחכות קטנות ותפסתי כמה דגים יפים.',
    rating: 4,
    createdAt: '2024-02-01T09:15:00.000Z',
    updatedAt: '2024-02-01T09:15:00.000Z'
  }
];

// פונקציה להוספת נתוני דוגמה
export const addSampleData = () => {
  const existingData = localStorage.getItem('orca-dive-entries');
  if (!existingData || JSON.parse(existingData).length === 0) {
    localStorage.setItem('orca-dive-entries', JSON.stringify(sampleDiveEntries));
    return true;
  }
  return false;
};



