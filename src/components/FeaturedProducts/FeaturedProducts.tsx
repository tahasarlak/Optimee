import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Product } from '../../Context/ProductContext/ProductContext';
import './FeaturedProducts.css';

// Define types for props
interface FeaturedProductsProps {
  products: Product[];
  maxProducts?: number; // Optional prop to control number of displayed products
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  maxProducts = 3,
}) => {
  const { t, i18n } = useTranslation();
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
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
    card: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  // Memoize featured products
  const featuredProducts = useMemo(
    () => products.slice(0, maxProducts),
    [products, maxProducts]
  );

  // Dynamic direction based on language
  const isRtl = i18n.language === 'fa';

  return (
    <section
      className="featured-products"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="region"
      aria-label={t('featuredProducts.title')}
      ref={ref}
    >
      <div className="featured-overlay" />
      <div className="featured-container">
        <motion.h2
          initial="hidden"
          animate={controls}
          variants={variants}
          className="featured-title"
        >
          {t('featuredProducts.title')}
        </motion.h2>

        {featuredProducts.length > 0 ? (
          <motion.div
            className="featured-grid"
            initial="hidden"
            animate={controls}
            variants={variants}
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="featured-card"
                variants={{ hidden: variants.hidden, visible: variants.card }}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 24px var(--shadow-color)' }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="featured-image"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = '/assets/fallback.jpg')}
                />
                <div className="featured-content">
                  <h3 className="featured-card-title">{product.title}</h3>
                  <p className="featured-card-description">{product.description}</p>
                  <p className="featured-card-price">{product.price}</p>
                  <p className="featured-card-minimum">
                    {t('featuredProducts.minimumOrder', {
                      minimumOrder: product.minimumOrder,
                    })}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    className="featured-cta"
                    aria-label={t('featuredProducts.viewDetails')}
                  >
                    {t('featuredProducts.viewDetails')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial="hidden"
            animate={controls}
            variants={{ hidden: variants.hidden, visible: variants.card }}
            className="featured-no-products"
          >
            {t('featuredProducts.noProducts')}
          </motion.p>
        )}
      </div>

      {/* Decorative gradient */}
      <motion.div
        className="featured-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </section>
  );
};

export default FeaturedProducts;