import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { X } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../Context/AuthContext/AuthContext';
import './AuthButton.css';

// Set app element for accessibility
Modal.setAppElement('#root');

const AuthButton: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const loginModalRef = useRef<HTMLDivElement>(null);
  const signupModalRef = useRef<HTMLDivElement>(null);

  const openLoginModal = useCallback(() => setIsLoginOpen(true), []);
  const closeLoginModal = useCallback(() => {
    setIsLoginOpen(false);
    setLoginForm({ email: '', password: '' });
    setErrors({});
  }, []);
  const openSignupModal = useCallback(() => setIsSignupOpen(true), []);
  const closeSignupModal = useCallback(() => {
    setIsSignupOpen(false);
    setSignupForm({ name: '', email: '', password: '' });
    setErrors({});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (loginModalRef.current && !loginModalRef.current.contains(event.target as Node)) ||
        (signupModalRef.current && !signupModalRef.current.contains(event.target as Node))
      ) {
        closeLoginModal();
        closeSignupModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeLoginModal, closeSignupModal]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, modalType: 'login' | 'signup') => {
    if (event.key === 'Escape') {
      if (modalType === 'login') closeLoginModal();
      else closeSignupModal();
    }
  }, [closeLoginModal, closeSignupModal]);

  const validateForm = useCallback((form: any, isSignup: boolean) => {
    const newErrors: { [key: string]: string } = {};
    if (!form.email) newErrors.email = t('auth.errors.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = t('auth.errors.email');
    if (!form.password) newErrors.password = t('auth.errors.passwordRequired');
    else if (form.password.length < 8) newErrors.password = t('auth.errors.passwordRequired');
    if (isSignup && !form.name) newErrors.name = t('auth.errors.nameRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [t]);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(loginForm, false)) return;
    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      closeLoginModal();
    } catch (error) {
      setErrors({ general: t('auth.errors.loginFailed') });
    } finally {
      setIsLoading(false);
    }
  }, [loginForm, validateForm, login, closeLoginModal, t]);

  const handleSignupSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(signupForm, true)) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      closeSignupModal();
    } catch (error) {
      setErrors({ general: t('auth.errors.signup') });
    } finally {
      setIsLoading(true);
    }
  }, [signupForm, validateForm, closeSignupModal, t]);

  return (
    <div className="auth-buttons">
      <button
        onClick={openLoginModal}
        className="auth-button login"
        aria-label="Login"
      >
        {t('Login')}
      </button>
      <button
        onClick={openSignupModal}
        className="auth-button signup"
          aria-label="Sign up"
      >
        {t('auth.signup.title')}
      </button>

      <Modal
        isOpen={isLoginOpen}
        onRequestClose={closeLoginModal}
        className="auth-modal"
        overlayClassName="auth-modal-overlay"
        aria-labelledby="login-modal-title"
        closeTimeoutMS={300}
      >
        <motion.div
          className="modal-content"
          ref={loginModalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onKeyDown={(e) => handleKeyDown(e, 'login')}
        >
          <ModalHeader>
            <h2 id="login-modal-title">{t('auth.login.title')}</h2>
            <button
              onClick={closeLoginModal}
              className="modal-close-button"
              aria-label="Close login modal"
            >
              <X />
            </button>
          </ModalHeader>
          <form onSubmit={handleLoginSubmit}>
            {errors.generalError && (
<p className="modal-error">{errors.general}</p>            )}
            <FormField
              label="Email"
              id="login-email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              error={errors.email}
              autoFocus
            />
            <FormField
              label="Password"
              id="login-password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              error={errors.password}
            />
            <ModalFooter>
              <button
                type="button"
                onClick={closeLoginModal}
                className="modal-button cancel"
                aria-label="Cancel"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="modal-button submit"
                aria-label="Log in"
              >
                {isLoading ? t('auth.loading') : t('auth.login.submit')}
              </button>
            </ModalFooter>
          </form>
</motion.div>      </Modal>

      <Modal
        isOpen={isSignupOpen}
        onRequestClose={closeSignupModal}
        className="auth-modal"
        overlayClassName="auth-modal-overlay"
        aria-labelledby="signup-modal-title"
        closeTimeoutMS={300}
      >
        <motion.div
          className="modal-content"
          ref={signupModalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onKeyDown={(e) => handleKeyDown(e, 'signup')}
        >
          <ModalHeader>
            <h2 id="signup-modal-title">{t('auth.signup.title')}</h2>
            <button
              onClick={closeSignupModal}
              className="modal-button"
              aria-label="Close signup modal"
            >
              <X />
            </button>
          </ModalHeader>
          <form onSubmit={handleSignupSubmit}>
            {errors.general && (
              <p className="modal-error">{errors.general}</p>
            )}
            <FormField
              label="Name"
              id="signup-name"
              value={signupForm.name}
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              error={errors.name}
              autoFocus
            />
            <FormField
              label="Email"
              id="signup-email"
              type="email"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              error={errors.email}
            />
            <FormField
              label="Password"
              id="signup-password"
              type="password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              error={errors.password}
            />
            <ModalFooter>
              <button
                type="button"
                onClick={closeSignupModal}
                className="modal-button cancel"
                aria-label="Cancel"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="modal-button submit"
                aria-label="Sign up"
              >
                {isLoading ? t('auth.loading') : t('auth.signup.submit')}
              </button>
            </ModalFooter>
          </form>
</motion.div>      </Modal>
    </div>
  );
};

// Helper components for modularity
interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoFocus?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, type = 'text', value, onChange, error, autoFocus }) => (
  <div className="form-field">
    <label htmlFor={id} className="form-label">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="form-input"
      aria-describedby={error ? `${id}-error` : undefined}
      autoFocus={autoFocus}
    />
    {error && (
      <p id={`${id}-error`} className="form-error">{error}</p>
    )}
  </div>
);

const ModalHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="modal-header">{children}</div>
);

const ModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="modal-footer">{children}</div>
);

export default AuthButton;