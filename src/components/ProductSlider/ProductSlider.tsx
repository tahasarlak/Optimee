import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../Context/ProductContext/ProductContext';
import ProductCard from '../ProductCard/ProductCard';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './ProductSlider.css';

interface ProductSliderProps {
  products: Product[];
  title: string;
  viewMode?: 'grid' | 'list' | 'table';
  addToCart: (product: Product) => void;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  compareItems: number[];
  onShare: (product: Product) => void;
  onTrack: (action: string, label: string) => void;
  slidesToShow?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onQuickView: (product: Product) => void;
  onShowReviews: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  products,
  title,
  viewMode = 'grid',
  addToCart,
  addToCompare,
  removeFromCompare,
  compareItems,
  onShare,
  onTrack,
  slidesToShow: initialSlidesToShow = 4,
  autoPlay = false,
  autoPlayInterval = 5000,
  onQuickView,
  onShowReviews,
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(initialSlidesToShow);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const updateSlidesToShow = useCallback(() => {
    const width = window.innerWidth;
    if (width < 600) setSlidesToShow(1);
    else if (width < 900) setSlidesToShow(2);
    else if (width < 1200) setSlidesToShow(3);
    else setSlidesToShow(initialSlidesToShow);
  }, [initialSlidesToShow]);

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, [updateSlidesToShow]);

  const totalSlides = Math.ceil(products.length / slidesToShow);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
      onTrack('next_slide', title);
    }
  }, [currentSlide, totalSlides, onTrack, title]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      onTrack('prev_slide', title);
    }
  }, [currentSlide, onTrack, title]);

  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  const startIndex = currentSlide * slidesToShow;
  const visibleProducts = products.slice(startIndex, startIndex + slidesToShow);

  const slideVariants = {
    hidden: { opacity: 0, x: isRtl ? 100 : -100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRtl ? -100 : 100 },
  };

  return (
    <section
      className="product-slider"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }}
    >
      <h2 className="slider-title">{title}</h2>
      {products.length > 0 ? (
        <div
          className="slider-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          ref={sliderRef}
        >
          <button
            className={`slider-nav prev ${currentSlide === 0 ? 'disabled' : ''}`}
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-label={t('slider.prev', 'Previous slide')}
          >
            {isRtl ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
          </button>
          <div className="slider-container">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentSlide}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', gap: '1rem', width: '100%' }}
              >
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="slider-item"
                    style={{ flex: `0 0 ${100 / slidesToShow}%`, maxWidth: `${100 / slidesToShow}%` }} // اصلاح عرض آیتم‌ها
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                      addToCart={addToCart}
                      addToCompare={addToCompare}
                      removeFromCompare={removeFromCompare}
                      compareItems={compareItems}
                      onShare={onShare}
                      onTrack={() => onTrack('view_product', product.title)}
                      onQuickView={() => onQuickView(product)}
                      onShowReviews={() => onShowReviews(product.id)}
                      isInWishlist={isInWishlist(product.id)}
                      addToWishlist={addToWishlist}
                      removeFromWishlist={removeFromWishlist}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            className={`slider-nav next ${currentSlide === totalSlides - 1 ? 'disabled' : ''}`}
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            aria-label={t('slider.next', 'Next slide')}
          >
            {isRtl ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
          </button>
        </div>
      ) : (
        <p className="no-products">{t('products.noProducts', 'No products available.')}</p>
      )}
      {totalSlides > 1 && (
        <div className="slider-pagination" style={{ textAlign: 'center', marginTop: '1rem' }}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <span
              key={index}
              className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setCurrentSlide(index);
                onTrack('select_slide', `Slide ${index + 1}`);
              }}
              role="button"
              tabIndex={0}
              aria-label={t('slider.goToSlide', `Go to slide ${index + 1}`, { slide: index + 1 })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setCurrentSlide(index);
                  onTrack('select_slide', `Slide ${index + 1}`);
                }
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSlider;