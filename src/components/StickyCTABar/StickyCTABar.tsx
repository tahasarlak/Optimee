import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './StickyCTABar.css';

interface StickyCTABarProps {
  ctaLink?: string;
}

const StickyCTABar: React.FC<StickyCTABarProps> = ({ ctaLink = '/contact' }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  return (
    <motion.div
      className="sticky-cta-bar"
      dir={isRtl ? 'rtl' : 'ltr'}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sticky-cta-container">
        <p className="sticky-cta-text">{t('stickyCTABar.text')}</p>
        <Link
          to={ctaLink}
          className="sticky-cta-button"
          aria-label={t('stickyCTABar.requestQuote')}
        >
          {t('stickyCTABar.requestQuote')}
        </Link>
      </div>
    </motion.div>
  );
};

export default StickyCTABar;