// Ocean background images from Unsplash - Free high-quality photos
export const oceanBackgrounds = [
  {
    id: 'coral-reef-underwater',
    url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&h=1080&fit=crop&crop=center',
    alt: 'שונית אלמוגים צבעונית מתחת למים',
    description: 'שונית אלמוגים צבעונית עם מים צלולים כחולים',
    photographer: 'Marek Okon'
  },
  {
    id: 'clear-blue-ocean',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&crop=center',
    alt: 'מים כחולים צלולים של אוקיינוס',
    description: 'מים כחולים צלולים עמוקים של האוקיינוס',
    photographer: 'Silas Baisch'
  },
  {
    id: 'tropical-reef',
    url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1920&h=1080&fit=crop&crop=center',
    alt: 'שונית טרופית עם דגים צבעוניים',
    description: 'שונית טרופית עם דגים צבעוניים ומים צלולים',
    photographer: 'David Clode'
  },
  {
    id: 'underwater-paradise',
    url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&h=1080&fit=crop&crop=faces',
    alt: 'גן עדן תת-ימי עם שונית',
    description: 'גן עדן תת-ימי עם שונית אלמוגים ומים צלולים',
    photographer: 'Francesco Ungaro'
  },
  {
    id: 'deep-blue-ocean',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
    alt: 'אוקיינוס כחול עמוק',
    description: 'אוקיינוס כחול עמוק עם מים צלולים',
    photographer: 'Hiroko Yoshii'
  },
  {
    id: 'coral-garden',
    url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1920&h=1080&fit=crop&crop=top',
    alt: 'גן אלמוגים תת-ימי',
    description: 'גן אלמוגים תת-ימי עם צבעים חיים',
    photographer: 'Q.U.I'
  }
];

// טיפוס לתמונת רקע של אוקיינוס
interface OceanBackgroundType {
  id: string;
  url: string;
  alt: string;
  description: string;
  photographer: string;
}

// פונקציה לקבלת תמונת רקע אקראית
export const getRandomOceanBackground = (): OceanBackgroundType => {
  const randomIndex = Math.floor(Math.random() * oceanBackgrounds.length);
  return oceanBackgrounds[randomIndex];
};

// פונקציה לקבלת תמונת רקע לפי ID
export const getOceanBackgroundById = (id: string): OceanBackgroundType | undefined => {
  return oceanBackgrounds.find(bg => bg.id === id);
};

// פונקציה לקבלת URL של תמונת רקע אקראית (לשימוש ב-CSS)
export const getRandomOceanBackgroundUrl = (): string => {
  return getRandomOceanBackground().url;
};
