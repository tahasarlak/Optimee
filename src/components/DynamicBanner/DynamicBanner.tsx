import React, { useCallback, useState, useEffect, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './DynamicBanner.css';
import { useProductContext } from '../../Context/ProductContext/ProductContext';

const ASSET_PATH = process.env.REACT_APP_ASSET_PATH || '/assets';
const FALLBACK_IMAGE = `${ASSET_PATH}/fallback.jpg`;

interface DynamicBannerProps {
  category?: string;
  searchQuery?: string;
  selectedBrand?: string;
  selectedTags?: string[];
  fallbackCategory?: string;
  onError?: (error: { category: string; message: string }) => void;
  isSlider?: boolean;
  autoSlideInterval?: number;
  theme?: 'light' | 'dark';
}

const DynamicBanner: React.FC<DynamicBannerProps> = ({
  category = 'all',
  searchQuery = '',
  selectedBrand = 'all',
  selectedTags = [],
  fallbackCategory = 'all',
  onError,
  isSlider = false,
  autoSlideInterval = 5000,
  theme = 'light',
}) => {
  const { t } = useTranslation();
  const { categories } = useProductContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  const validCategories = useMemo(() => categories.map((c) => c.name), [categories]);

  const validCategory = searchQuery
    ? 'search'
    : validCategories.includes(category)
    ? category
    : fallbackCategory;

  const bannerList = useMemo(() => {
    if (validCategory === 'search') {
      return [{ src: `${ASSET_PATH}/banners/search.jpg`, altKey: 'Search Results', priority: 1 }];
    }
    const categoryData = categories.find((cat) => cat.name === validCategory);
    return categoryData?.banners || categories.find((cat) => cat.name === 'all')?.banners || [];
  }, [validCategory, categories]);

  const filteredBanners = useMemo(() => {
    let result = bannerList;
    if (selectedBrand !== 'all') {
      result = result.filter((banner) => banner.brand === selectedBrand || banner.brand === 'all');
    }
    if (selectedTags.length > 0 && !selectedTags.includes('all')) {
      result = result.filter((banner) => banner.tags?.some((tag) => selectedTags.includes(tag)) || !banner.tags);
    }
    return result.length > 0 ? result : bannerList;
  }, [bannerList, selectedBrand, selectedTags]);

  const sortedBanners = filteredBanners.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const currentBanner = sortedBanners[currentSlide] || sortedBanners[0] || {
    src: FALLBACK_IMAGE,
    altKey: 'Fallback Banner',
    priority: 1,
  };

  const bannerAlt = t(`banner.alt.${currentBanner.altKey}`, currentBanner.altKey);
  const bannerTitle = t(`banner.title.${currentBanner.altKey}`, currentBanner.altKey);
  const bannerDescription = t(
    `banner.description.${currentBanner.altKey}`,
    searchQuery ? `Results for "${searchQuery}"` : 'Discover the best products in this category'
  );

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = FALLBACK_IMAGE;
      e.currentTarget.onerror = null;
      const errorMessage = `Failed to load banner for category: ${category}, brand: ${selectedBrand}, tags: ${selectedTags.join(', ')}`;
      console.warn(errorMessage);
      onError?.({ category, message: errorMessage });
    },
    [category, selectedBrand, selectedTags, onError]
  );

  useEffect(() => {
    if (!isSlider || sortedBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sortedBanners.length);
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [isSlider, sortedBanners.length, autoSlideInterval]);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: currentBanner.src,
    name: bannerTitle,
    description: bannerDescription,
    keywords: [validCategory, searchQuery, selectedBrand, ...selectedTags].filter(Boolean),
  };

  return (
    <figure
      className={`dynamic-banner ${theme}`}
      role="group"
      aria-label={`Banner for ${bannerAlt}`}
      itemScope
      itemType="https://schema.org/ImageObject"
    >
      <meta itemProp="contentUrl" content={currentBanner.src} />
      <meta itemProp="name" content={bannerTitle} />
      <meta itemProp="description" content={bannerDescription} />
      <meta itemProp="keywords" content={schemaData.keywords.join(',')} />
      <LazyLoadImage
        src={currentBanner.src}
        alt={bannerAlt}
        title={bannerTitle}
        effect="blur"
        className="banner-image"
        placeholderSrc={FALLBACK_IMAGE}
        onError={handleImageError}
        itemProp="image"
      />
      <figcaption className="banner-overlay" aria-label={`Description for ${bannerAlt}`}>
        <h2 itemProp="headline">{bannerTitle}</h2>
        <p itemProp="description">{bannerDescription}</p>
        {currentBanner.link && (
          <a href={currentBanner.link} className="banner-link" aria-label={`Explore ${bannerAlt}`}>
            {t('banner.explore', 'Explore Now')}
          </a>
        )}
      </figcaption>
      {isSlider && sortedBanners.length > 1 && (
        <div className="slider-controls" aria-label="Banner slider controls">
          {sortedBanners.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </figure>
  );
};

export default memo(DynamicBanner); 