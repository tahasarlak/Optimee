// src/components/FeaturedProducts/FeaturedProducts.tsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Product } from '../../Context/ProductContext/ProductContext';
import { useCart } from '../../Context/CartContext/CartContext';
import { useCompareContext } from '../../Context/CompareContext/CompareContext';
import ProductSlider from '../ProductSlider/ProductSlider';
import { toast } from 'react-toastify';
import './FeaturedProducts.css';

interface FeaturedProductsProps {
  products: Product[];
  maxProducts?: number;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  maxProducts = 3,
}) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, compareItems } = useCompareContext();
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleShare = (product: Product) => {
    const shareData = {
      title: product.title,
      text: product.description,
      url: `${window.location.origin}/products/${product.id}`,
    };
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => toast.success(t('products.shareSuccess', 'Product shared successfully!')))
        .catch(() => toast.error(t('products.shareError', 'Failed to share product.')));
    } else {
      toast.info(t('products.shareFallback', 'Copy the product link to share: ') + shareData.url);
      navigator.clipboard.writeText(shareData.url);
    }
  };

  const handleTrack = (action: string, label: string) => {
    console.log(`Tracking ${action}: ${label}`);
  };

  const featuredProducts = products.slice(0, maxProducts);
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
     <ProductSlider
  products={featuredProducts}
  title={t('featuredProducts.title', 'Featured Products')}
  viewMode="grid"
  addToCart={addToCart}
  addToCompare={addToCompare}
  removeFromCompare={removeFromCompare}
  compareItems={compareItems}
  onShare={handleShare} // اصلاح به handleShare
  onTrack={handleTrack} // اصلاح به handleTrack
  slidesToShow={4}
  onQuickView={(product) => console.log('Quick View', product)}
  onShowReviews={(productId) => console.log('Show Reviews', productId)}
  isInWishlist={(productId) => false}
  addToWishlist={(productId) => console.log('Add to Wishlist', productId)}
  removeFromWishlist={(productId) => console.log('Remove from Wishlist', productId)}
/>
      </div>
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