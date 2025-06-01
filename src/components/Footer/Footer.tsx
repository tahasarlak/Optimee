import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  return (
    <footer className="footer-section" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="footer-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="footer-text">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p className="footer-subtext">{t('footer.serving')}</p>
          <div className="footer-links">
            <Link to="/privacy" className="footer-link" aria-label={t('footer.privacy')}>
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="footer-link" aria-label={t('footer.terms')}>
              {t('footer.terms')}
            </Link>
            <Link to="/contact" className="footer-link" aria-label={t('footer.contact')}>
              {t('footer.contact')}
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;