// Utility function to reset all application data
export const resetAllData = () => {
  // Get all localStorage keys that start with 'orca'
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('orca')) {
      keysToRemove.push(key);
    }
  }
  
  // Remove all orca-related data
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('All Orca data has been cleared!');
  alert('כל הנתונים נמחקו! העמוד ייטען מחדש.');
  
  // Reload the page to start fresh
  window.location.reload();
};

// Function to create a default admin user
export const createDefaultAdmin = () => {
  const defaultAdmin = {
    id: 'admin-default-001',
    username: 'admin',
    email: 'admin@orca.app',
    fullName: 'מנהל מערכת',
    createdAt: new Date().toISOString(),
    role: 'admin',
    preferences: {
      language: 'he',
      units: 'metric',
      theme: 'light',
      notifications: {
        diveReminders: true,
        weatherAlerts: true,
        safetyTips: true,
      },
    },
  };

  // Save to localStorage
  const existingUsers = JSON.parse(localStorage.getItem('orca_users') || '[]');
  const updatedUsers = [defaultAdmin, ...existingUsers.filter((u: any) => u.username !== 'admin')];
  
  localStorage.setItem('orca_users', JSON.stringify(updatedUsers));
  localStorage.setItem('orca_current_user', JSON.stringify(defaultAdmin));
  
  console.log('Default admin created with username: admin');
  alert('נוצר משתמש אדמין ברירת מחדל!\nשם משתמש: admin\nניתן להתחבר עם כל סיסמה');
  
  window.location.reload();
};
