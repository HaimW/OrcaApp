import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { signUpWithEmail, signInWithGoogle, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'שם מלא נדרש';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'שם חייב להכיל לפחות 2 תווים';
    }
    
    if (!formData.email) {
      newErrors.email = 'אימייל נדרש';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'אימייל לא תקין';
    }
    
    if (!formData.password) {
      newErrors.password = 'סיסמה נדרשת';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'אישור סיסמה נדרש';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'סיסמאות לא תואמות';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await signUpWithEmail(formData.email, formData.password, formData.displayName.trim());
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="gradient-ocean rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center text-4xl">
          🐋
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          הרשמה לאורקה
        </h2>
        <p className="text-gray-600">
          צור חשבון חדש
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="שם מלא"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className={errors.displayName ? 'border-red-500' : ''}
          />
          {errors.displayName && (
            <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
          )}
        </div>

        <div>
          <Input
            type="email"
            placeholder="כתובת אימייל"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="סיסמה"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="אישור סיסמה"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          className="h-12"
        >
          {isLoading ? 'יוצר חשבון...' : 'הירשם'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">או</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mt-4 h-12"
        >
          <FaGoogle size={20} />
          הירשם עם Google
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          יש לך כבר חשבון?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-ocean-600 hover:text-ocean-700 font-medium"
          >
            התחבר כאן
          </button>
        </p>
      </div>
    </Card>
  );
};

export default RegisterForm;