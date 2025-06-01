import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './AboutSection.css';

// Define types for props
interface AboutSectionProps {
  titleKey?: string;
  descriptionKey?: string;
  ctaLink?: string;
  sectionHeight?: string; // Optional prop for section height
}

const AboutSection: React.FC<AboutSectionProps> = ({
  titleKey = 'aboutSection.title',
  descriptionKey = 'aboutSection.description',
  ctaLink = '/contact',
  sectionHeight = 'auto',
}) => {
  const { t, i18n } = useTranslation();
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  // Animation trigger when section is in view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants for smooth entrance
  const variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.2,
      },
    },
    child: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  // Dynamic direction based on language
  const isRtl = i18n.language === 'fa';

  // Memoize section style
  const sectionStyle = useMemo(
    () => ({
      minHeight: sectionHeight,
    }),
    [sectionHeight]
  );

  return (
    <section
      className="about-section"
      style={sectionStyle}
      dir={isRtl ? 'rtl' : 'ltr'}
      role="region"
      aria-label={t(titleKey)}
      ref={ref}
    >
      <div className="about-overlay" />
      <div className="about-container">
        {/* Animated heading */}
        <motion.h2
          initial="hidden"
          animate={controls}
          variants={variants}
          className="about-title"
        >
          {t(titleKey)}
        </motion.h2>

        {/* Animated description */}
        <motion.p
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.child }}
          className="about-description"
        >
          {t(descriptionKey)}
        </motion.p>

        {/* Animated call-to-action button */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.child }}
        >
          <Link
            to={ctaLink}
            className="about-cta"
            aria-label={t('aboutSection.getInTouch')}
          >
            {t('aboutSection.getInTouch')}
          </Link>
        </motion.div>
      </div>

      {/* Decorative gradient */}
      <motion.div
        className="about-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </section>
  );
};

export default AboutSection;