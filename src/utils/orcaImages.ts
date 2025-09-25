// Orca images from Unsplash - Free high-quality photos
export const orcaImages = [
  {
    id: 'orca-swimming-pair',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop&crop=center',
    alt: 'זוג אורקות שוחות במים',
    description: 'זוג אורקות שוחות יחד במים כחולים',
    photographer: 'Vidar Nordli-Mathisen'
  },
  {
    id: 'orca-black-white',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&crop=center',
    alt: 'אורקה בשחור לבן',
    description: 'אורקה במים בצילום שחור לבן מרהיב',
    photographer: 'Iewek Gnos'
  },
  {
    id: 'orca-ocean-swimming',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&crop=top',
    alt: 'אורקה שוחה באוקיינוס',
    description: 'אורקה שוחה באוקיינוס הכחול',
    photographer: 'Zdeněk Macháček'
  },
  {
    id: 'orca-daylight',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&crop=bottom',
    alt: 'אורקה באור יום',
    description: 'אורקה במים באור יום טבעי',
    photographer: 'Mike Doherty'
  },
  {
    id: 'orca-duo',
    url: 'https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?w=400&h=400&fit=crop&crop=center',
    alt: 'שתי אורקות',
    description: 'שתי אורקות שוחות בגוף מים',
    photographer: 'Stephen Walker'
  },
  {
    id: 'whale-jump',
    url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=400&fit=crop&crop=center',
    alt: 'לוויתן קופץ מהמים',
    description: 'לוויתן קופץ מהמים בתנועה מרהיבה',
    photographer: 'Rudi De Meyer'
  },
  {
    id: 'orca-water-surface',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&crop=faces',
    alt: 'אורקה על פני המים',
    description: 'אורקה במים ליד פני השטח',
    photographer: 'Nitesh Jain'
  },
  {
    id: 'killer-whales-trio',
    url: 'https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?w=400&h=400&fit=crop&crop=top',
    alt: 'שלוש אורקות',
    description: 'שלוש אורקות צפות על המים',
    photographer: 'Bart'
  },
  {
    id: 'orcas-sunrise',
    url: 'https://images.unsplash.com/photo-1507808973436-a4ed7b5e87c9?w=400&h=400&fit=crop&crop=bottom',
    alt: 'אורקות בזריחה',
    description: 'שתי אורקות במים בזמן זריחה',
    photographer: 'Bart'
  },
  {
    id: 'killer-whale-top',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&crop=entropy',
    alt: 'אורקה מעל המים',
    description: 'אורקה מעל פני המים',
    photographer: 'Tim Cole'
  },
  {
    id: 'whale-ocean-jump',
    url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=400&fit=crop&crop=top',
    alt: 'לוויתן קופץ באוקיינוס',
    description: 'לוויתן קופץ מהמים באוקיינוס',
    photographer: 'Lachlan Gowen'
  },
  {
    id: 'orca-ocean-swim',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&crop=edges',
    alt: 'אורקה שוחה באוקיינוס',
    description: 'אורקה שחורה לבנה שוחה באוקיינוס',
    photographer: 'Tomáš Malík'
  }
];

// טיפוס לתמונת אורקה
interface OrcaImageType {
  id: string;
  url: string;
  alt: string;
  description: string;
  photographer: string;
}

// פונקציה לקבלת תמונה אקראית
export const getRandomOrcaImage = (): OrcaImageType => {
  const randomIndex = Math.floor(Math.random() * orcaImages.length);
  return orcaImages[randomIndex];
};

// פונקציה לקבלת תמונה לפי ID
export const getOrcaImageById = (id: string): OrcaImageType | undefined => {
  return orcaImages.find(img => img.id === id);
};

// פונקציה לקבלת כמה תמונות אקראיות
export const getRandomOrcaImages = (count: number): OrcaImageType[] => {
  const shuffled = [...orcaImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// פונקציה לקבלת תמונה חדשה (לא זהה לקודמת)
export const getNewOrcaImage = (currentImageId?: string): OrcaImageType => {
  const availableImages = orcaImages.filter(img => img.id !== currentImageId);
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  return availableImages[randomIndex];
};
