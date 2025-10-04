# 🚀 התקנה מהירה - אורקה יומן צלילה

## התקנת האפליקציה

### 1. התקנת Node.js
אם עדיין לא מותקן לכם Node.js:
- בקרו ב-https://nodejs.org
- הורידו והתקינו את הגרסה המומלצת (LTS)

### 2. הורדת הפרויקט
```bash
# פתחו טרמינל/Command Prompt ובצעו:
cd Desktop
mkdir OrcaApp
cd OrcaApp
```

### 3. התקנת התלויות
```bash
npm install
```

### 4. הפעלת האפליקציה
```bash
npm run dev
```

האפליקציה תיפתח בדפדפן בכתובת: http://localhost:5173

## התקנה על המובייל

### iPhone (Safari)
1. פתחו את האפליקציה בספארי
2. לחצו על כפתור השיתוף (חץ כלפי מעלה)
3. בחרו "הוסף למסך הבית"
4. אשרו את ההתקנה

### Android (Chrome)
1. פתחו את האפליקציה בכרום
2. תופיע הודעה "הוסף ל-Home screen"
3. לחצו "הוסף"
4. האפליקציה תותקן כאפליקציה רגילה

## בנייה לפרודקשן

```bash
# בנייה לפרודקשן
npm run build

# צפייה בגרסת הפרודקשן
npm run preview
```

## פתרון בעיות נפוצות

### שגיאת "command not found: npm"
- וודאו שNode.js מותקן נכון
- אתחלו את הטרמינל/Command Prompt

### שגיאות התקנה
```bash
# נקו cache ונסו שוב
npm cache clean --force
npm install
```

### האפליקציה לא נפתחת
- ודאו שהפורט 5173 פנוי
- נסו פורט אחר: `npm run dev -- --port 3000`

## עזרה נוספת

אם נתקלתם בבעיות:
1. ודאו שיש לכם חיבור אינטרנט יציב
2. וודאו שהגרסה של Node.js היא 16 ומעלה: `node --version`
3. נסו להריץ עם הרשאות מנהל (Windows) או sudo (Mac/Linux)

---

🎯 **מטרה**: ליצור אפליקציה שעובדת מושלם גם במובייל וגם במחשב!



