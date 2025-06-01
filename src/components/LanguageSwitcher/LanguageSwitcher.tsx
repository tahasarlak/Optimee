import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import './LanguageSwitcher.css';

const languages = [
  { code: 'en', name: 'English', countryCode: 'US' },
  { code: 'fa', name: 'فارسی', countryCode: 'IR' },
  { code: 'ru', name: 'Русский', countryCode: 'RU' },
];

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = useCallback((code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    document.documentElement.lang = code;
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mouseup', handleClickOutside);
    return () => document.removeEventListener('mouseup', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  return (
    <motion.div
      className="language-switcher"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="language-dropdown"
      >
        <ReactCountryFlag
          countryCode={currentLanguage.countryCode}
          svg
          className="language-flag"
          title={t(`languages.${currentLanguage.code}`)}
        />
        <span className="language-name">{t(`languages.${currentLanguage.code}`)}</span>
        <ChevronDown className={`language-icon ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <motion.div
        id="language-dropdown"
        className="language-dropdown"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="language-options">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
            >
              <ReactCountryFlag
                countryCode={lang.countryCode}
                svg
                className="language-flag"
                title={t(`languages.${lang.code}`)}
              />
              <span>{t(`languages.${lang.code}`)}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LanguageSwitcher;