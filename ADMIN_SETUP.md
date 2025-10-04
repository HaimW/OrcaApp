# 🔐 הגדרת משתמש אדמין

## דרך 1: שימוש במייל admin (פשוט)

רשום משתמש עם אחד מהמיילים הבאים:
- `admin@orca.com`
- או כל מייל שמכיל "admin" (למשל: `myname.admin@gmail.com`)

---

## דרך 2: Custom Claims ב-Firebase (מומלץ למערכת ייצור)

### שלב 1: התקן Firebase Admin SDK

```bash
npm install firebase-admin
```

### שלב 2: צור קובץ סקריפט לניהול אדמינים

צור קובץ `scripts/setAdmin.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // תצטרך להוריד מ-Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ המשתמש ${email} הוגדר כאדמין!`);
  } catch (error) {
    console.error('❌ שגיאה:', error);
  }
}

// שנה את המייל למייל שלך
setAdminClaim('your-email@example.com');
```

### שלב 3: הורד Service Account Key

1. לך ל-Firebase Console: https://console.firebase.google.com/
2. בחר את הפרויקט: **orcaapp-54de4**
3. לחץ על ⚙️ **Project settings** > **Service accounts**
4. לחץ על **Generate new private key**
5. שמור את הקובץ בתיקייה `scripts/serviceAccountKey.json`

### שלב 4: הרץ את הסקריפט

```bash
node scripts/setAdmin.js
```

### שלב 5: עדכן את הקוד לבדוק Custom Claims

עדכן את `src/components/Layout/BottomNav.tsx`:

```typescript
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  if (user) {
    // בדוק custom claims
    auth.currentUser?.getIdTokenResult().then((tokenResult) => {
      setIsAdmin(!!tokenResult.claims.admin);
    });
  }
}, [user]);
```

---

## דרך 3: Firestore Admin Collection (גמיש)

### שלב 1: צור Collection ב-Firestore

ב-Firebase Console, צור collection בשם `admins`:

```
Collection: admins
Document ID: [user email or UID]
Fields:
  - email: "your-email@example.com"
  - role: "admin"
  - createdAt: [timestamp]
```

### שלב 2: עדכן את הקוד לבדוק ב-Firestore

צור `src/hooks/useAdminCheck.ts`:

```typescript
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists() && adminDoc.data()?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
};
```

---

## המלצה שלי: 💡

**לפיתוח ובדיקות:** השתמש בדרך 1 (מייל admin)
**לייצור (production):** השתמש בדרך 2 (Custom Claims) או דרך 3 (Firestore)

---

## הוספת אדמינים נוספים בעתיד:

ניתן להוסיף עוד מיילים לרשימת האדמינים ב-`BottomNav.tsx`:

```typescript
const adminEmails = [
  'admin@orca.com',
  'your-email@example.com',
  'another-admin@example.com'
];

const isAdmin = user?.email && adminEmails.includes(user.email);
```

