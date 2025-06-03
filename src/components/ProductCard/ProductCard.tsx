import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Product, normalizePrice } from '../../Context/ProductContext/ProductContext';
import { useCurrency } from '../../Context/CurrencyContext/CurrencyContext';
import WishlistButton from '../WishlistButton/WishlistButton';
import ProductVariants from '../ProductVariants/ProductVariants';
import './ProductCard.css';

const ASSET_PATH = process.env.REACT_APP_ASSET_PATH || '/assets';
const FALLBACK_IMAGE = `${ASSET_PATH}/fallback.jpg`;

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list' | 'table';
  addToCart: (product: Product) => void;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  compareItems: number[];
  onShare: (product: Product) => void;
  onTrack: (action: string, label: string) => void;
  onQuickView: () => void;
  onShowReviews: () => void;
  isInWishlist: boolean;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  addToCart,
  addToCompare,
  removeFromCompare,
  compareItems,
  onShare,
  onTrack,
  onQuickView,
  onShowReviews,
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
}) => {
  const { t, i18n } = useTranslation();
  const { currency, exchangeRate } = useCurrency();
  const productImage = product.image || FALLBACK_IMAGE; // حذف تبدیل به .avif

  const handleVariantSelect = (variantId: string) => {
    onTrack('select_variant', `${product.title}:${variantId}`);
  };

  return (
    <motion.div
      className={`product-card ${viewMode}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      role="article"
      aria-labelledby={`product-title-${product.id}`}
    >
      <LazyLoadImage
        src={productImage}
        alt={t('products.imageAlt', { title: product.title })}
        effect="blur"
        className="product-image"
        placeholderSrc={`${ASSET_PATH}/placeholder.jpg`} // تغییر به .jpg
        onError={(e) => {
          console.log('Image failed to load:', productImage); // لاگ برای دیباگ
          e.currentTarget.src = FALLBACK_IMAGE;
          e.currentTarget.onerror = null;
        }}
      />
      <div className="product-content">
        <h3 id={`product-title-${product.id}`} className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">
          {new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US', {
            style: 'currency',
            currency,
          }).format(normalizePrice(product.price) * exchangeRate * (1 - (product.discount || 0) / 100))}
          {product.discount ? ` (${product.discount}% OFF)` : ''}
        </p>
        <ProductVariants product={product} onSelectVariant={handleVariantSelect} />
        <div className="product-actions">
          <button
            onClick={() => {
              addToCart(product);
              onTrack('add_to_cart', product.title);
            }}
            aria-label={t('products.addToCartAria', { title: product.title })}
          >
            {t('products.addToCart', 'Add to Cart')}
          </button>
          <button
            onClick={() => {
              compareItems.includes(product.id)
                ? removeFromCompare(product.id)
                : addToCompare(product);
              onTrack('toggle_compare', product.title);
            }}
            aria-label={
              compareItems.includes(product.id)
                ? t('products.removeFromCompareAria', { title: product.title })
                : t('products.addToCompareAria', { title: product.title })
            }
          >
            {compareItems.includes(product.id)
              ? t('products.removeFromCompare', 'Remove')
              : t('products.addToCompare', 'Compare')}
          </button>
          <button
            onClick={() => {
              onShare(product);
              onTrack('share_product', product.title);
            }}
            aria-label={t('products.shareAria', { title: product.title })}
          >
            {t('products.share', 'Share')}
          </button>
          <button
            onClick={() => {
              onQuickView();
              onTrack('quick_view', product.title);
            }}
            aria-label={t('products.quickViewAria', { title: product.title })}
          >
            {t('products.quickView', 'Quick View')}
          </button>
          <button
            onClick={() => {
              onShowReviews();
              onTrack('view_reviews', product.title);
            }}
            aria-label={t('products.reviewsAria', { title: product.title })}
          >
            {t('products.reviews', 'Reviews')}
          </button>
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

export default ProductCard;