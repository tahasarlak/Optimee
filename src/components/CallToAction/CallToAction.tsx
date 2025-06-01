import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import './CallToAction.css';

interface CallToActionProps {
  ctaLink?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ ctaLink = '/contact' }) => {
  const { t, i18n } = useTranslation();
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], staggerChildren: 0.2 },
    },
    child: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const isRtl = i18n.language === 'fa';

  return (
    <section className="cta-section" dir={isRtl ? 'rtl' : 'ltr'} ref={ref}>
      <div className="cta-overlay" />
      <div className="cta-container">
        <motion.h2
          initial="hidden"
          animate={controls}
          variants={variants}
          className="cta-title"
        >
          {t('callToAction.title')}
        </motion.h2>
        <motion.p
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.child }}
          className="cta-description"
        >
          {t('callToAction.description')}
        </motion.p>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.child }}
        >
          <Link
            to={ctaLink}
            className="cta-button"
            aria-label={t('callToAction.contactUs')}
          >
            {t('callToAction.contactUs')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;