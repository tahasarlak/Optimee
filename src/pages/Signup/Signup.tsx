import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = t('auth.errors.nameRequired');
    if (!form.email) newErrors.email = t('auth.errors.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = t('auth.errors.invalidEmail');
    if (!form.password) newErrors.password = t('auth.errors.passwordRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Simulate signup API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/login');
    } catch (error) {
      setErrors({ general: t('auth.errors.signupFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page max-w-md mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">{t('auth.signup.title')}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-md shadow">
        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium">
            {t('auth.signup.name')}
          </label>
          <input
            id="signup-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium">
            {t('auth.signup.email')}
          </label>
          <input
            id="signup-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium">
            {t('auth.signup.password')}
          </label>
          <input
            id="signup-password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium"
        >
          {isLoading ? t('auth.signup.loading') : t('auth.signup.submit')}
        </button>
      </form>
    </div>
  );
};

export default Signup;