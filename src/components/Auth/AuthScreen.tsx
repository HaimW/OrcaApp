import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthMode = 'login' | 'register';

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  if (mode === 'login') {
    return <LoginForm onSwitchToRegister={() => setMode('register')} />;
  }

  return <RegisterForm onSwitchToLogin={() => setMode('login')} />;
};
