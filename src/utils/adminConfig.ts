// src/utils/adminConfig.ts
// רשימת מיילים של אדמינים
export const ADMIN_EMAILS = [
  'admin@orca.com',
  // הוסף כאן מיילים נוספים של אדמינים
  // 'your-email@example.com',
];

/**
 * בדיקה אם משתמש הוא אדמין
 * @param email - כתובת המייל של המשתמש
 * @returns true אם המשתמש הוא אדמין
 */
export const isUserAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  
  // בדיקה אם המייל ברשימת האדמינים
  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    return true;
  }
  
  // בדיקה אם המייל מכיל 'admin'
  if (email.toLowerCase().includes('admin')) {
    return true;
  }
  
  return false;
};

