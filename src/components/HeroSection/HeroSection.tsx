import React, { useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation, Variant } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './HeroSection.css';

// Define types for props
interface HeroSectionProps {
  backgroundImage?: string;
  fallbackImage?: string;
  ctaLink?: string;
  titleKey?: string;
  descriptionKey?: string;
  height?: string; // Added prop for custom height
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  fallbackImage,
  ctaLink = '/products',
  titleKey = 'heroSection.title',
  descriptionKey = 'heroSection.description',
  height = '100vh',
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

  // Animation variants with enhanced easing and stagger
  const variants: Record<string, Variant> = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.2,
      },
    },
    description: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.3 },
    },
    button: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.5 },
    },
  };

  // Dynamic direction based on language
  const isRtl = i18n.language === 'fa';

  // Memoize background style
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : `url(${fallbackImage || ''})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height,
    }),
    [backgroundImage, fallbackImage, height]
  );

  // Memoize language change handler
  const handleLanguageChange = useCallback(
    (lang: string) => {
      i18n.changeLanguage(lang);
    },
    [i18n]
  );

  return (
    <section
      className="hero-section"
      style={backgroundStyle}
      dir={isRtl ? 'rtl' : 'ltr'}
      role="banner"
      aria-label={t(titleKey)}
    >
      {/* Overlay for better text contrast */}
      <div className="hero-overlay" />

      {/* Container */}
      <div className="hero-container">
        {/* Heading with animation */}
        <motion.h1
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={variants}
          className="hero-title"
        >
          {t(titleKey)}
        </motion.h1>

        {/* Description with animation */}
        <motion.p
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.description }}
          className="hero-description"
        >
          {t(descriptionKey)}
        </motion.p>

        {/* Call-to-action button with hover and focus states */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.button }}
        >
          <Link
            to={ctaLink}
            className="hero-cta"
            aria-label={t('heroSection.exploreProducts')}
          >
            {t('heroSection.exploreProducts')}
          </Link>
        </motion.div>

        {/* Language switcher with enhanced styling */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.button }}
          className="hero-language-switcher"
        >
          {['en', 'fa', 'ru'].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`hero-language-button ${i18n.language === lang ? 'active' : ''}`}
              aria-label={t(`languages.${lang}`)}
              aria-pressed={i18n.language === lang}
            >
              {t(`languages.${lang}`)}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Decorative gradient with subtle animation */}
      <motion.div
        className="hero-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Subtle floating particles for visual flair */}
      <div className="hero-particles">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="hero-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${10 + Math.random() * 10}px`,
              height: `${10 + Math.random() * 10}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;