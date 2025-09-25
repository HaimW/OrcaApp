import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';
import OrcaImage from '../UI/OrcaImage';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      return;
    }
    
    if (!formData.password) {
      return;
    }

    dispatch(loginUser(formData));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <OrcaImage 
            size="xl" 
            shape="circle" 
            className="mx-auto mb-4"
            specificImage="orca-underwater"
            showCredits={false}
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ברוכים הבאים לאורקה
          </h1>
          <p className="text-gray-600">
            היכנסו לחשבון שלכם לניהול יומן הצלילה
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="שם משתמש"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            icon={<FaUser />}
            placeholder="הכניסו את שם המשתמש שלכם"
            required
          />

          <div className="relative">
            <Input
              label="סיסמה"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              icon={<FaLock />}
              placeholder="הכניסו את הסיסמה שלכם"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-[38px] text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.username.trim() || !formData.password}
          >
            {isLoading ? 'מתחבר...' : 'כניסה למערכת'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            עדיין אין לכם חשבון?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              הרשמו כאן
            </button>
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🔒 הנתונים שלכם נשמרים באופן מקומי במכשיר שלכם
          </p>
        </div>
      </Card>
    </div>
  );
};
