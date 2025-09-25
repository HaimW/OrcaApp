export interface DiveEntry {
  id: string;
  date: string;
  time: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // פרטי צלילה
  depth: number; // עומק במטרים
  duration: number; // משך בדקות
  visibility: number; // ראות במטרים
  
  // תנאי מזג אוויר
  weather: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
    temperature: number; // טמפרטורת אוויר
    waterTemperature: number; // טמפרטורת מים
    windSpeed: number; // מהירות רוח
    windDirection: string; // כיוון רוח
    waveHeight: number; // גובה גלים
    current: 'none' | 'weak' | 'medium' | 'strong'; // זרם
  };
  
  // ציוד
  equipment: {
    mask: string;
    fins: string;
    suit: string;
    weight: number; // משקל במקג
    gear: string[]; // ציוד נוסף
  };
  
  // סוג דיג
  fishingType: 'speargun' | 'pole_spear' | 'hook' | 'net' | 'other';
  
  // תוצאות
  catches: Catch[];
  
  // תמונות
  photos: string[]; // base64 או URLs
  
  // הערות
  notes: string;
  
  // דירוג
  rating: number; // 1-5 כוכבים
  
  // תאריך יצירה ועדכון
  createdAt: string;
  updatedAt: string;
}

export interface Catch {
  id: string;
  species: string; // סוג דג
  weight?: number; // משקל בגרמים
  length?: number; // אורך בס"מ
  quantity: number; // כמות
  method: 'speargun' | 'pole_spear' | 'hook' | 'net' | 'other';
  released: boolean; // האם שוחרר
  photo?: string; // תמונה
  notes?: string;
}

export interface WeatherCondition {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
  label: string;
  icon: string;
}

export interface FishingMethod {
  type: 'speargun' | 'pole_spear' | 'hook' | 'net' | 'other';
  label: string;
  icon: string;
}

export interface AppState {
  diveEntries: DiveEntry[];
  currentEntry?: DiveEntry;
  isLoading: boolean;
  error?: string;
}

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  fishingType?: string;
  minDepth?: number;
  maxDepth?: number;
  minRating?: number;
}

