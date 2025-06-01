import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import './BuyerSection.css';

interface BuyerStep {
  id: number;
  title: string;
  description: string;
}

interface BuyerSectionProps {
  ctaLink?: string;
}

const BuyerSection: React.FC<BuyerSectionProps> = ({ ctaLink = '/contact' }) => {
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
    card: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buyerSteps: BuyerStep[] = useMemo(
    () => [
      { id: 1, title: t('buyerSection.step1.title'), description: t('buyerSection.step1.description') },
      { id: 2, title: t('buyerSection.step2.title'), description: t('buyerSection.step2.description') },
      { id: 3, title: t('buyerSection.step3.title'), description: t('buyerSection.step3.description') },
    ],
    [t]
  );

  const isRtl = i18n.language === 'fa';

  return (
    <section className="buyer-section" dir={isRtl ? 'rtl' : 'ltr'} ref={ref}>
      <div className="buyer-overlay" />
      <div className="buyer-container">
        <motion.h2
          initial="hidden"
          animate={controls}
          variants={variants}
          className="buyer-title"
        >
          {t('buyerSection.title')}
        </motion.h2>
        <motion.p
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.card }}
          className="buyer-description"
        >
          {t('buyerSection.description')}
        </motion.p>
        <motion.div
          className="buyer-grid"
          initial="hidden"
          animate={controls}
          variants={variants}
        >
          {buyerSteps.map((step) => (
            <motion.div
              key={step.id}
              className="buyer-card"
              variants={{ hidden: variants.hidden, visible: variants.card }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 24px var(--shadow-color)' }}
            >
              <CheckCircle className="buyer-icon" />
              <h3 className="buyer-card-title">{step.title}</h3>
              <p className="buyer-card-description">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.card }}
          className="buyer-cta-container"
        >
          <Link
            to={ctaLink}
            className="buyer-cta"
            aria-label={t('buyerSection.getStarted')}
          >
            {t('buyerSection.getStarted')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BuyerSection;