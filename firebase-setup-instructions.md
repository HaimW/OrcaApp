# Firebase Setup Instructions

## 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `orcaapp-54de4`
3. Go to **Firestore Database**
4. Go to **Rules** tab
5. Replace the existing rules with the content from `firestore.rules` file

## 2. Firestore Rules

Copy and paste these rules in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write dive entries
    match /diveEntries/{entryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3. Authentication Setup

1. Go to **Authentication** in Firebase Console
2. Go to **Sign-in method** tab
3. Enable **Email/Password** provider
4. Enable **Google** provider (optional)

## 4. Test the Setup

1. Start the app: `npm run dev`
2. Try to register a new user
3. Try to add a dive entry
4. Check the console for any errors

## 5. Common Issues

### Permission Denied Error
- Make sure Firestore rules are updated
- Make sure user is authenticated
- Check if user has proper permissions

### Network Error
- Check internet connection
- Check Firebase project configuration
- Verify API keys are correct

### Authentication Error
- Make sure Authentication is enabled
- Check if user is properly signed in
- Verify email/password are correct
