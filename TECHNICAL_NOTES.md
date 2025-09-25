# 🔧 מידע טכני - אורקה

## 🏗️ ארכיטקטורת המערכת

### מבנה נתונים ב-localStorage
```
orca_users                    # כל המשתמשים במערכת
orca_current_user            # המשתמש המחובר כרגע
orca-dive-entries-{userId}   # צלילות של משתמש ספציפי
```

### איך האדמין רואה נתונים של משתמשים אחרים?
האדמין יכול לגשת לנתונים של כל המשתמשים כי:
1. כל המשתמשים רשומים ב-`orca_users`
2. האדמין עובר על כל המשתמשים ומביא את הנתונים שלהם
3. הקוד קורא מה-localStorage עבור כל משתמש:

```javascript
// מהקוד באדמין:
const allDiveEntries = users.flatMap(user => {
  try {
    const userEntries = localStorage.getItem(`orca-dive-entries-${user.id}`);
    return userEntries ? JSON.parse(userEntries) : [];
  } catch {
    return [];
  }
});
```

## 🔐 מערכת ההרשאות

### תפקידי משתמשים
- **user**: משתמש רגיל, רואה רק את הנתונים שלו
- **moderator**: (עתידי) הרשאות חלקיות
- **admin**: גישה מלאה לכל המערכת

### איך נקבע תפקיד אדמין?
```typescript
// ב-authSlice.ts
role: username === 'admin' ? 'admin' : 'user'
```

## 🗂️ מבנה הקבצים החשובים

### Pages (דפים ראשיים)
- `HomePage.tsx` - דף הבית עם סיכום
- `EntriesPage.tsx` - רשימת צלילות
- `AddEntryPage.tsx` - הוספה/עריכה של צלילה
- `AdminPage.tsx` - לוח בקרת מנהל
- `SettingsPage.tsx` - הגדרות וכלי מפתח

### Components (רכיבים)
- `Auth/` - מערכת אימות (כניסה/הרשמה)
- `Forms/` - טפסים לניהול צלילות
- `UI/` - רכיבי יסוד (Button, Card, Input)
- `Layout/` - פריסה כללית (Header, BottomNav)

### Store (Redux)
- `authSlice.ts` - ניהול משתמשים והתחברות
- `diveEntriesSlice.ts` - ניהול צלילות

### Types (טיפוסים)
- `user.ts` - טיפוסי משתמשים ואדמין
- `index.ts` - טיפוסי צלילות כלליים

## 🚀 איך לפתח תכונות חדשות

### הוספת דף חדש
1. צרו קובץ ב-`src/pages/NewPage.tsx`
2. הוסיפו ב-`App.tsx` route חדש
3. הוסיפו ב-`BottomNav.tsx` אם נדרש

### הוספת טיפוס נתונים חדש
1. הגדירו ב-`src/types/`
2. עדכנו את ה-Redux slices
3. הוסיפו פונקציות localStorage אם נדרש

### הוספת רכיב UI חדש
1. צרו ב-`src/components/UI/`
2. השתמשו בעיצוב Tailwind עקבי
3. הוסיפו ייצוא named וdefault

## 🎨 עקרונות עיצוב

### צבעים עיקריים
- Ocean: כחול ים (`#0891b2`)
- Coral: אדום אלמוגים (`#ef4444`)
- Gray: גוונים של אפור לרקע

### RTL Support
- כל הטקסטים בעברית
- `direction: rtl` בכל הרכיבים
- Font: Heebo

### Responsive Design
- Mobile-first approach
- Safe areas לiPhone
- Touch targets מינימום 44px

## 🔧 כלי פיתוח

### Development
```bash
npm run dev          # הרצת שרת פיתוח
npm run build        # בנייה לפרודקשן
npm run preview      # צפייה בגרסת פרודקשן
```

### איך לאפס נתונים בפיתוח
```javascript
// מהקונסול או בקוד:
import { resetAllData } from './src/utils/resetData';
resetAllData();
```

### איך ליצור אדמין במהירות
```javascript
// מהקונסול:
import { createDefaultAdmin } from './src/utils/resetData';
createDefaultAdmin();
```

## 📱 PWA Features

### Service Worker
- Cache של כל הקבצים הסטטיים
- עבודה offline מלאה
- עדכון אוטומטי

### Manifest
- התקנה על מסך הבית
- אייקונים מותאמים
- Splash screen

## 🐛 בעיות ידועות ופתרונות

### בעיית ES Modules
**בעיה:** `"Card" is not exported`
**פתרון:** הוספנו named exports לכל רכיבי ה-UI

### בעיית Reserved Keywords
**בעיה:** שימוש במילה `catch` כפרמטר
**פתרון:** שמנו שם ל-`fishCatch`

### בעיית JSX Quotes
**בעיה:** Escaped quotes בטקסט עברי
**פתרון:** שימוש ב-HTML entities או forward slash

## 📊 ביצועים

### localStorage Optimization
- נתונים נשמרים בנפרד לכל משתמש
- טעינה lazy של נתונים
- מפתחות מובנים לחיפוש מהיר

### Bundle Size
- Tree shaking של Tailwind
- Code splitting של React Router
- מינימיזציה של Vite

---

**📅 תאריך יצירה:** ${new Date().toLocaleDateString('he-IL')}
**🔨 לעדכון המסמך הזה בעת הוספת תכונות חדשות**
