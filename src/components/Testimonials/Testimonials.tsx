import React, { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import './Testimonials.css';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  quote: string;
  avatar: string;
}

interface TestimonialsProps {
  maxTestimonials?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({ maxTestimonials = 2 }) => {
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

  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        id: 1,
        name: t('testimonials.testimonial1.name'),
        company: t('testimonials.testimonial1.company'),
        quote: t('testimonials.testimonial1.quote'),
        avatar: '/assets/avatars/avatars.jpg',
      },
      {
        id: 2,
        name: t('testimonials.testimonial2.name'),
        company: t('testimonials.testimonial2.company'),
        quote: t('testimonials.testimonial2.quote'),
        avatar: '/assets/avatars/avatars.jpg',
      },
    ].slice(0, maxTestimonials),
    [t, maxTestimonials]
  );

  const isRtl = i18n.language === 'fa';

  return (
    <section className="testimonials-section" dir={isRtl ? 'rtl' : 'ltr'} ref={ref}>
      <div className="testimonials-overlay" />
      <div className="testimonials-container">
        <motion.h2
          initial="hidden"
          animate={controls}
          variants={variants}
          className="testimonials-title"
        >
          {t('testimonials.title')}
        </motion.h2>
        <motion.div
          className="testimonials-grid"
          initial="hidden"
          animate={controls}
          variants={variants}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="testimonials-card"
              variants={{ hidden: variants.hidden, visible: variants.card }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 24px var(--shadow-color)' }}
            >
              <div className="testimonials-header">
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.name}'s avatar`}
                  className="testimonials-avatar"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = '/assets/avatars/fallback.jpg')}
                />
                <div>
                  <h3 className="testimonials-name">{testimonial.name}</h3>
                  <p className="testimonials-company">{testimonial.company}</p>
                </div>
              </div>
              <p className="testimonials-quote">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;