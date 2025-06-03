import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Product, normalizePrice } from '../../Context/ProductContext/ProductContext';
import { useCurrency } from '../../Context/CurrencyContext/CurrencyContext';
import WishlistButton from '../WishlistButton/WishlistButton';
import './ProductQuickView.css';

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
  addToCart: (product: Product) => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: boolean;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  addToCart,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
}) => {
  const { t, i18n } = useTranslation();
  const { currency, exchangeRate } = useCurrency();

  return (
    <motion.div
      className="quick-view-modal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-labelledby="quick-view-title"
    >
      <div className="quick-view-content">
        <button
          className="close-button"
          onClick={onClose}
          aria-label={t('products.closeQuickView', 'Close Quick View')}
        >
          ×
        </button>
        <img
          src={product.image?.replace('.jpg', '.avif') || '/assets/fallback.avif'}
          alt={t('products.imageAlt', { title: product.title })}
          className="quick-view-image"
        />
        <h2 id="quick-view-title">{product.title}</h2>
        <p>{product.description}</p>
        <p>
          {new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US', {
            style: 'currency',
            currency,
          }).format(normalizePrice(product.price) * exchangeRate * (1 - (product.discount || 0) / 100))}
          {product.discount ? ` (${product.discount}% OFF)` : ''}
        </p>
        <div className="quick-view-actions">
          <button onClick={() => addToCart(product)}>{t('products.addToCart', 'Add to Cart')}</button>
          <WishlistButton
            productId={product.id}
            isInWishlist={isInWishlist}
            addToWishlist={addToWishlist}
            removeFromWishlist={removeFromWishlist}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductQuickView;