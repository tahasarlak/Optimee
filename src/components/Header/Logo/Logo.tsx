import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Logo.css';

const Logo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        to="/"
        className="logo"
        aria-label={t('logo.ariaLabel')}
      >
        <img
          src="/Logo.png"
          alt={t('logo.alt')}
          className="logo-image"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = '/assets/fallback-logo.png')}
        />
        <span className="logo-text">{t('logo.text')}</span>
      </Link>
    </motion.div>
  );
};

export default Logo;