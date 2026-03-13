// src/utils/adminConfig.ts
// רשימת מיילים של אדמינים
export const ADMIN_EMAILS = [
  'yafim.sh@gmail.com',
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

  const normalizedEmail = email.trim().toLowerCase();

  // בדיקה אם המייל ברשימת האדמינים בלבד (ללא wildcard)
  return ADMIN_EMAILS.includes(normalizedEmail);
};

