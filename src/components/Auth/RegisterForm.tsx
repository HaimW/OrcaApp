import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';
import { FaUser, FaEnvelope, FaUserTag, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'שם משתמש נדרש';
    } else if (formData.username.length < 3) {
      errors.username = 'שם משתמש חייב להכיל לפחות 3 תווים';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'שם משתמש יכול להכיל רק אותיות, מספרים וקו תחתון';
    }

    if (!formData.email.trim()) {
      errors.email = 'כתובת אימייל נדרשת';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'כתובת אימייל לא תקינה';
    }

    if (!formData.fullName.trim()) {
      errors.fullName = 'שם מלא נדרש';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'שם מלא חייב להכיל לפחות 2 תווים';
    }

    if (!formData.password) {
      errors.password = 'סיסמה נדרשת';
    } else if (formData.password.length < 6) {
      errors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'אישור סיסמה נדרש';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'הסיסמאות לא תואמות';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(registerUser(formData));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear server error
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="gradient-ocean rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-3xl">
            🐋
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            הצטרפו לאורקה
          </h1>
          <p className="text-gray-600">
            צרו חשבון חדש ותתחילו לנהל את יומן הצלילה שלכם
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
            icon={<FaUserTag />}
            placeholder="בחרו שם משתמש ייחודי"
            error={validationErrors.username}
            required
          />

          <Input
            label="כתובת אימייל"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            icon={<FaEnvelope />}
            placeholder="הכניסו את כתובת האימייל שלכם"
            error={validationErrors.email}
            required
          />

          <Input
            label="שם מלא"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            icon={<FaUser />}
            placeholder="הכניסו את שמכם המלא"
            error={validationErrors.fullName}
            required
          />

          <div className="relative">
            <Input
              label="סיסמה"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              icon={<FaLock />}
              placeholder="בחרו סיסמה חזקה"
              error={validationErrors.password}
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

          <Input
            label="אישור סיסמה"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            icon={<FaLock />}
            placeholder="הכניסו שוב את הסיסמה"
            error={validationErrors.confirmPassword}
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'נרשם...' : 'הרשמה לאורקה'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            יש לכם כבר חשבון?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              היכנסו כאן
            </button>
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🔒 הנתונים שלכם נשמרים באופן מקומי במכשיר שלכם<br/>
            📱 האפליקציה עובדת גם ללא חיבור לאינטרנט
          </p>
        </div>
      </Card>
    </div>
  );
};
