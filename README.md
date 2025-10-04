# 🐋 אורקה - יומן צלילה מקצועי

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

אפליקציית Progressive Web App (PWA) מתקדמת לניהול יומן צלילה לדייגים. האפליקציה מותאמת לשימוש במובייל וטאבלט, עובדת גם ללא חיבור לאינטרנט, וניתנת להתקנה על המסך הראשי.

## ✨ תכונות עיקריות

### 🔥 Firebase Integration
- **☁️ מסד נתונים בענן** - כל הנתונים נשמרים ב-Firestore
- **🔐 Authentication** - התחברות אנונימית או עם Google
- **📱 Real-time Sync** - סנכרון מיידי בין כל המכשירים
- **🛡️ Security** - אבטחה מתקדמת ברמת Google
- **💾 Offline Support** - עבודה גם ללא אינטרנט

### 📊 ניהול צלילות מקצועי
- **פרטי צלילה מפורטים**: תאריך, שעה, מיקום, עומק, משך, ראות
- **תנאי מזג אוויר**: מזג אוויר, טמפרטורות, רוח, גלים, זרם
- **ציוד צלילה**: מסכה, סנפירים, חליפה, משקל, ציוד נוסף
- **שיטות דיג**: רובה צלילה, פול ספייר, חכה, רשת ועוד
- **דגים שנתפסו**: רישום מפורט עם משקל, אורך, כמות והערות
- **תמונות**: העלאה ותצוגת תמונות מהצלילה
- **הערות ודירוג**: תיעוד חוויות אישיות ודירוג הצלילה

### 🔍 חיפוש וסינון מתקדם
- חיפוש טקסט חופשי
- סינון לפי תאריכים, מיקום, שיטת דיג, עומק ודירוג
- מיון וארגון הצלילות

### 📈 סטטיסטיקות מפורטות
- סיכום כללי: סה"כ צלילות, דגים, שעות במים
- נתונים מפורטים: עומק ממוצע ומקסימלי, ראות, טמפרטורות
- דגים מובילים ושיטות דיג פופולריות
- פעילות אחרונה וטרנדים

### 💾 ניהול נתונים
- שמירה בענן עם Firebase
- ייצוא וייבוא נתונים (JSON)
- גיבוי ושחזור מלא
- סנכרון בין מכשירים

### 📱 Progressive Web App (PWA)
- **עבודה ללא אינטרנט**: כל הפונקציונליות זמינה גם offline
- **התקנה על המסך הראשי**: חוויה כמו אפליקציה native
- **מהירות גבוהה**: טעינה מהירה וביצועים מעולים
- **מותאם למובייל**: עיצוב responsive לכל גדלי מסך
- **Safe Area**: תמיכה מלאה ב-notch ו-safe areas של iPhone

## 🚀 התקנה והפעלה

### דרישות מערכת
- Node.js 16+ 
- npm או yarn
- חשבון Firebase (בחינם)

### שלב 1: שכפול הפרויקט
```bash
git clone https://github.com/your-username/orca-dive-log.git
cd orca-dive-log
npm install
```

### שלב 2: הגדרת Firebase
1. **צור פרויקט Firebase:**
   - לך ל-https://console.firebase.google.com
   - צור פרויקט חדש
   - הפעל Firestore Database
   - הפעל Authentication (Anonymous + Google)

2. **העתק את ה-config:**
   - בFirebase Console, לחץ על הגדרות הפרויקט
   - העתק את ה-firebaseConfig
   - הדבק ב-`src/firebase/config.ts`

3. **הוראות מפורטות:**
   ראה קובץ `firebase-instructions.md` להוראות שלב אחר שלב

### שלב 3: הפעלה
```bash
# הפעלת שרת הפיתוח
npm run dev

# בנייה לפרודקשן
npm run build

# צפייה בגרסת הפרודקשן
npm run preview
```

### שלב 4: התקנה כ-PWA
1. פתח את האפליקציה בדפדפן במובייל
2. לחץ על "הוסף למסך הבית" (Safari) או "התקן" (Chrome)
3. האפליקציה תותקן כאפליקציה native

## 🛠 טכנולוגיות

### Frontend
- **React 18** - ספריית UI מתקדמת
- **TypeScript** - פיתוח מאובטח עם types
- **Redux Toolkit** - ניהול state מתקדם
- **React Router** - ניווט בין דפים
- **Tailwind CSS** - עיצוב מודרני וגמיש

### Backend & Database
- **Firebase Firestore** - מסד נתונים NoSQL בענן
- **Firebase Auth** - מערכת התחברות מאובטחת
- **Firebase Storage** - אחסון תמונות בענן
- **Real-time Listeners** - עדכונים בזמן אמת

### PWA & Build
- **Vite** - build tool מהיר ומתקדם
- **Vite PWA Plugin** - יצירת PWA אוטומטית
- **Service Worker** - תמיכה offline ו-caching
- **Web App Manifest** - התקנה על המסך הראשי

### UI/UX
- **React Icons** - אייקונים מקצועיים
- **date-fns** - עבודה עם תאריכים
- **עיצוב RTL** - תמיכה מלאה בעברית
- **Responsive Design** - מותאם לכל המכשירים

## 🎯 קהל יעד

האפליקציה מיועדת לדייגי צלילה חופשית:
- דייגי רובה צלילה
- דייגי פול ספייר
- דייגי חכה תת-מימיים
- צוללים חובבים ומקצועיים

## 📊 מבנה הפרויקט

```
src/
├── components/          # רכיבי UI
│   ├── Auth/           # רכיבי התחברות
│   ├── Forms/          # טפסים
│   ├── Layout/         # רכיבי פריסה
│   ├── UI/             # רכיבי UI בסיסיים
│   └── Entries/        # רכיבים ספציפיים לצלילות
├── pages/              # דפי האפליקציה
├── store/              # Redux store ו-slices
├── firebase/           # הגדרות Firebase
├── hooks/              # React hooks מותאמים אישית
├── types/              # הגדרות TypeScript
├── utils/              # פונקציות עזר וקבועים
└── main.tsx           # נקודת כניסה ראשית
```

## 🔧 פיתוח והרחבה

### הוספת תכונות חדשות
1. הוסף types חדשים ב-`src/types/`
2. עדכן את Firebase collections ב-`src/firebase/firestore.ts`
3. עדכן את Redux store ב-`src/store/slices/`
4. צור רכיבים חדשים ב-`src/components/`
5. הוסף דפים חדשים ב-`src/pages/`

### הרצת בדיקות
```bash
npm run lint
npm run type-check
```

## 🌟 תכונות מתקדמות

### Real-time Sync
- שינויים מתעדכנים מיד בכל המכשירים
- עבודה collaborative אפשרית
- עדכונים אוטומטיים ללא רענון

### Multi-user Support
- כל משתמש רואה רק את הנתונים שלו
- אפשרות לשיתוף נתונים (עתידי)
- ניהול הרשאות מתקדם

### Offline-first
- כל הפעולות עובדות offline
- סנכרון אוטומטי כשחוזרים online
- אחסון מקומי לביצועים מהירים

## 📱 תמיכה במכשירים

### Desktop
- Chrome, Firefox, Safari, Edge
- Windows, macOS, Linux

### Mobile
- iOS Safari (iPhone, iPad)
- Android Chrome
- Progressive Web App support

### Tablet
- iPad (Safari)
- Android tablets
- מותאם לכל גדלי מסך

## 🤝 תרומה לפרויקט

אנו מזמינים תרומות לפרויקט:
- דיווח על באגים
- הצעות לתכונות חדשות
- שיפורי UI/UX
- תרגומים
- תיעוד

### איך לתרום:
1. Fork את הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit את השינויים (`git commit -m 'Add amazing feature'`)
4. Push לbranch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

## 📄 רישיון

פרויקט זה נבנה עבור קהילת הדייגים הישראלית ומיועד לשימוש חופשי.

## 🆘 תמיכה

אם נתקלת בבעיות:
1. בדוק את `firebase-instructions.md`
2. ודא שFirebase מוגדר נכון
3. בדוק את ה-console לשגיאות
4. פתח issue בGitHub

## 🎉 Credits

**נבנה עם ❤️ לקהילת הדייגים הישראלית**

### טכנולוגיות בשימוש:
- React + TypeScript
- Firebase (Firestore, Auth, Storage)
- Redux Toolkit
- Tailwind CSS
- Vite + PWA
- React Icons
- date-fns

---

**🎣 תהנו מיומן הצלילה החדש! 🌊**