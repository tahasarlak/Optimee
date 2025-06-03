import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductContext } from '../../Context/ProductContext/ProductContext';
import { useCart } from '../../Context/CartContext/CartContext';
import { useCompareContext } from '../../Context/CompareContext/CompareContext';
import { useBlog, BlogPost } from '../../Context/BlogContext/BlogContext';
import { useUser } from '../../Context/UserContext/UserContext';
import { useWishlist } from '../../Context/WishlistContext/WishlistContext';
import { useReviews } from '../../Context/ReviewContext/ReviewContext';
import { useCurrency } from '../../Context/CurrencyContext/CurrencyContext';
import { FunnelIcon, TableCellsIcon, ListBulletIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import queryString from 'query-string';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import ProductFilters from '../../components/ProductFilters/ProductFilters';
import CompareTable from '../../components/CompareTable/CompareTable';
import ProductQuickView from '../../components/ProductQuickView/ProductQuickView';
import ProductReviews from '../../components/ProductReviews/ProductReviews';
import DynamicBanner from '../../components/DynamicBanner/DynamicBanner';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { normalizePrice, Product } from '../../Context/ProductContext/ProductContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Products.css';

const BlogPostCard: React.FC<{ post: BlogPost }> = React.memo(({ post }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  return (
    <motion.div
      className="blog-post-card"
      dir={isRtl ? 'rtl' : 'ltr'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      role="article"
      aria-labelledby={`blog-post-title-${post.id}`}
    >
      {post.image && (
        <LazyLoadImage
          src={post.image.replace('.jpg', '.avif')}
          alt={t('blog.imageAlt', { title: post.title })}
          effect="blur"
          className="blog-post-image"
          placeholderSrc="/assets/placeholder.avif"
          onError={(e) => {
            e.currentTarget.src = '/assets/fallback.avif';
            e.currentTarget.onerror = null;
          }}
        />
      )}
      <h3 id={`blog-post-title-${post.id}`} className="blog-post-title">{post.title}</h3>
      <p className="blog-post-excerpt">{post.excerpt}</p>
      <p className="blog-post-category">{t('blog.category', { category: post.category })}</p>
      <p className="blog-post-date">{new Date(post.date).toLocaleDateString(i18n.language)}</p>
      <a
        href={`/blog/${post.id}`}
        className="blog-post-link"
        aria-label={t('blog.readMoreAria', { title: post.title })}
      >
        {t('blog.readMore', 'Read More')}
      </a>
    </motion.div>
  );
});

const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { products, loading, error, retryFetch } = useProductContext();
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, compareItems } = useCompareContext();
  const { posts } = useBlog();
  const { user } = useUser();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getReviewsByProduct } = useReviews();
  const { currency, exchangeRate } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listWidth, setListWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockFilter, setInStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [discountFilter, setDiscountFilter] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showReviewsForProduct, setShowReviewsForProduct] = useState<number | null>(null);
  const [loadedItems, setLoadedItems] = useState(12);

  const handleSaveFilters = useCallback(() => {
    const filterSet = {
      searchTerm,
      selectedCategory,
      selectedBrand,
      sortOption,
      priceRange,
      inStockFilter,
      selectedTags,
      selectedRating,
      discountFilter,
    };
    setSavedFilters((prev) => [...prev, filterSet]);
    localStorage.setItem('savedFilters', JSON.stringify([...savedFilters, filterSet]));
    toast.success(t('products.filtersSaved', 'Filters saved!'));
  }, [searchTerm, selectedCategory, selectedBrand, sortOption, priceRange, inStockFilter, selectedTags, selectedRating, discountFilter, savedFilters, t]);

  const handleApplySavedFilter = useCallback((filter: any) => {
    setSearchTerm(filter.searchTerm);
    setSelectedCategory(filter.selectedCategory);
    setSelectedBrand(filter.selectedBrand);
    setSortOption(filter.sortOption);
    setPriceRange(filter.priceRange);
    setInStockFilter(filter.inStockFilter);
    setSelectedTags(filter.selectedTags);
    setSelectedRating(filter.selectedRating);
    setDiscountFilter(filter.discountFilter);
    setIsFilterOpen(false);
    toast.info(t('products.filtersApplied', 'Filters applied successfully!'));
  }, [t]);

  const handleApplyFilters = useCallback(() => {
    setIsFilterOpen(false);
    setLoadedItems(12); // Reset infinite scroll
    toast.info(t('products.filtersApplied', 'Filters applied successfully!'));
  }, [t]);

  const handleShare = useCallback((product: Product) => {
    const shareData = {
      title: product.title,
      text: product.description,
      url: `${window.location.origin}/products/${product.id}`,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => toast.error(t('products.shareError', 'Failed to share product')));
    } else {
      toast.info(t('products.shareFallback', 'Share feature not supported on this device'));
    }
  }, [t]);

  const trackEvent = useCallback((action: string, label: string) => {
    window.gtag?.('event', action, { event_category: 'Products', event_label: label });
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (listContainerRef.current) {
        setListWidth(listContainerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const params = queryString.parse(location.search);
    setSearchTerm(params.search as string || localStorage.getItem('searchTerm') || '');
    setSelectedCategory(params.category as string || localStorage.getItem('selectedCategory') || 'all');
    setSelectedBrand(params.brand as string || localStorage.getItem('selectedBrand') || 'all');
    setSortOption(params.sort as string || localStorage.getItem('sortOption') || 'default');
    setPriceRange(params.priceRange ? JSON.parse(params.priceRange as string) : JSON.parse(localStorage.getItem('priceRange') || '[0, 10000]'));
    setInStockFilter(params.stock as 'all' | 'inStock' | 'outOfStock' || 'all');
    setSelectedTags(params.tags ? (Array.isArray(params.tags) ? params.tags : [params.tags]) : []);
    setSelectedRating(params.rating ? parseInt(params.rating as string) : 0);
    setDiscountFilter(params.discount === 'true');
  }, [location.search]);

  const debouncedNavigate = useCallback(
    (params: {
      search?: string;
      category?: string;
      brand?: string;
      sort?: string;
      priceRange?: string;
      stock?: string;
      tags?: string[];
      rating?: number;
      discount?: boolean;
    }) => {
      setTimeout(() => {
        navigate({ search: queryString.stringify(params, { arrayFormat: 'comma' }) });
      }, 300);
    },
    [navigate]
  );

  useEffect(() => {
    const params = {
      search: searchTerm || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      brand: selectedBrand !== 'all' ? selectedBrand : undefined,
      sort: sortOption !== 'default' ? sortOption : undefined,
      priceRange: JSON.stringify(priceRange),
      stock: inStockFilter !== 'all' ? inStockFilter : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      rating: selectedRating > 0 ? selectedRating : undefined,
      discount: discountFilter ? true : undefined,
    };
    debouncedNavigate(params);

    localStorage.setItem('searchTerm', searchTerm);
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('selectedBrand', selectedBrand);
    localStorage.setItem('sortOption', sortOption);
    localStorage.setItem('priceRange', JSON.stringify(priceRange));
  }, [searchTerm, selectedCategory, selectedBrand, sortOption, priceRange, inStockFilter, selectedTags, selectedRating, discountFilter, debouncedNavigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        setLoadedItems((prev) => prev + 12); // Load more items
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (selectedBrand !== 'all') {
      result = result.filter((product) => (product.brand || 'Unknown') === selectedBrand);
    }

    if (inStockFilter === 'inStock') {
      result = result.filter((product) => product.inStock);
    } else if (inStockFilter === 'outOfStock') {
      result = result.filter((product) => !product.inStock);
    }

    if (selectedTags.length > 0 && !selectedTags.includes('all')) {
      result = result.filter((product) =>
        product.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    if (selectedRating > 0) {
      result = result.filter((product) => (product.rating || 0) >= selectedRating);
    }

    if (discountFilter) {
      result = result.filter((product) => (product.discount || 0) > 0);
    }

    result = result.filter((product) => {
      const price = normalizePrice(product.price) * exchangeRate;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (sortOption === 'price-asc') {
      result.sort((a, b) => normalizePrice(a.price) * exchangeRate - normalizePrice(b.price) * exchangeRate);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => normalizePrice(b.price) * exchangeRate - normalizePrice(a.price) * exchangeRate);
    } else if (sortOption === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'rating-desc') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedBrand, sortOption, priceRange, inStockFilter, selectedTags, selectedRating, discountFilter, exchangeRate]);

  const suggestedProducts = useMemo(() => {
    return products
      .filter((p) => p.tags?.includes('featured') && !filteredProducts.includes(p))
      .slice(0, 4);
  }, [products, filteredProducts]);

  const trendingProducts = useMemo(() => {
    return products
      .filter((p) => p.tags?.includes('trending'))
      .slice(0, 4);
  }, [products]);

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === selectedCategory && !filteredProducts.includes(p))
      .slice(0, 4);
  }, [products, selectedCategory, filteredProducts]);

  const relatedBlogPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const personalizedProducts = useMemo(() => {
    if (!user?.preferredCategories) return [];
    return products
      .filter((p) => user.preferredCategories.includes(p.category))
      .slice(0, 4);
  }, [products, user]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, loadedItems);
  }, [filteredProducts, loadedItems]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const product = paginatedProducts[index];
    return (
      <div style={style} className={`product-card ${viewMode}`}>
        <ProductCard
          product={product}
          viewMode={viewMode}
          addToCart={addToCart}
          addToCompare={addToCompare}
          removeFromCompare={removeFromCompare}
          compareItems={compareItems}
          onShare={handleShare}
          onTrack={trackEvent}
          onQuickView={() => setQuickViewProduct(product)}
          onShowReviews={() => setShowReviewsForProduct(product.id)}
          isInWishlist={isInWishlist(product.id)}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
        />
      </div>
    );
  };

  const pageTitle = selectedCategory === 'all'
    ? t('products.title', 'Our Products')
    : t('products.titleCategory', { category: selectedCategory });
  const pageDescription = t('products.description', {
    defaultValue: 'Explore our wide range of products.',
    category: selectedCategory !== 'all' ? selectedCategory : '',
  });

  return (
    <div className="products-container" role="main" aria-label={t('products.title')}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="/assets/og-image.avif" />
        <meta property="og:url" content={window.location.href} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: pageTitle,
            description: pageDescription,
            url: window.location.href,
            hasPart: filteredProducts.map((product) => ({
              '@type': 'Product',
              name: product.title,
              description: product.description,
              image: product.image,
              offers: {
                '@type': 'Offer',
                price: normalizePrice(product.price) * exchangeRate,
                priceCurrency: currency,
                availability: product.inStock ? 'InStock' : 'OutOfStock',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating || 0,
                reviewCount: getReviewsByProduct(product.id).length,
              },
            })),
          })}
        </script>
      </Helmet>
      <ToastContainer position="top-right" autoClose={3000} />

<DynamicBanner
  category={selectedCategory}
  searchQuery={searchTerm}
  selectedBrand={selectedBrand}
  selectedTags={selectedTags}
  isSlider={true}
  autoSlideInterval={3000}
  theme="dark"
/>
      <h1 className="products-title">{pageTitle}</h1>

      <div className="results-view-section">
        <p className="results-count" aria-live="polite">
          {t('products.resultsCount', { count: filteredProducts.length })}
        </p>
        <div className="view-mode-buttons">
          <button
            onClick={() => setViewMode('grid')}
            className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
            aria-label={t('products.gridView', 'Grid View')}
          >
            <TableCellsIcon className="view-mode-icon" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
            aria-label={t('products.listView', 'List View')}
          >
            <ListBulletIcon className="view-mode-icon" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`view-mode-button ${viewMode === 'table' ? 'active' : ''}`}
            aria-label={t('products.tableView', 'Table View')}
          >
            <TableCellsIcon className="view-mode-icon" />
          </button>
        </div>
      </div>

      <button
        className="filter-toggle"
        onClick={() => setIsFilterOpen(true)}
        aria-label={t('products.toggleFilters', 'Show Filters')}
        aria-controls="filter-modal"
      >
        <FunnelIcon className="filter-icon" />
        {t('products.filters', 'Filters')}
      </button>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="filter-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFilterOpen(false)}
          >
            <ProductFilters
              products={products}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              sortOption={sortOption}
              setSortOption={setSortOption}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockFilter={inStockFilter}
              setInStockFilter={setInStockFilter}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              discountFilter={discountFilter}
              setDiscountFilter={setDiscountFilter}
              savedFilters={savedFilters}
              onSaveFilters={handleSaveFilters}
              onApplySavedFilter={handleApplySavedFilter}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="error-message" role="alert">
          <p>
            {error.type === 'offline' ? (
              <>
                {t('products.offlineError', 'You are offline. Please check your internet connection.')}
                <button onClick={retryFetch} className="retry-button">
                  {t('products.retry', 'Retry')}
                </button>
              </>
            ) : (
              t('products.error', { message: error.message })
            )}
          </p>
        </div>
      )}

      <div aria-live="polite" ref={listContainerRef}>
        {loading ? (
          <LoadingSpinner />
        ) : !error && paginatedProducts.length > 0 ? (
<AutoSizer>{({ height, width }: { height: number; width: number }) => (
                <List
                height={height || 600}
                width={width || listWidth}
                itemCount={paginatedProducts.length}
                itemSize={viewMode === 'grid' ? 300 : 150}
              >
                {Row}
              </List>
            )}
</AutoSizer>        ) : (
          <p className="no-results">{t('products.noResults', 'No products found matching your criteria.')}</p>
        )}
      </div>

      {compareItems.length > 0 && (
        <CompareTable
          products={products.filter((p) => compareItems.includes(p.id))}
          removeFromCompare={removeFromCompare}
        />
      )}

      {suggestedProducts.length > 0 && (
        <ProductSlider
          products={suggestedProducts}
          title={t('products.suggested', 'Suggested Products')}
          viewMode={viewMode}
          addToCart={addToCart}
          addToCompare={addToCompare}
          removeFromCompare={removeFromCompare}
          compareItems={compareItems}
          onShare={handleShare}
          onTrack={trackEvent}
          slidesToShow={4}
          autoPlay={true}
          onQuickView={setQuickViewProduct}
          onShowReviews={setShowReviewsForProduct}
          isInWishlist={isInWishlist}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
        />
      )}

      {trendingProducts.length > 0 && (
        <ProductSlider
          products={trendingProducts}
          title={t('products.trending', 'Trending Products')}
          viewMode={viewMode}
          addToCart={addToCart}
          addToCompare={addToCompare}
          removeFromCompare={removeFromCompare}
          compareItems={compareItems}
          onShare={handleShare}
          onTrack={trackEvent}
          slidesToShow={4}
          autoPlay={true}
          onQuickView={setQuickViewProduct}
          onShowReviews={setShowReviewsForProduct}
          isInWishlist={isInWishlist}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
        />
      )}

      {relatedProducts.length > 0 && (
        <ProductSlider
          products={relatedProducts}
          title={t('products.related', 'Related Products')}
          viewMode={viewMode}
          addToCart={addToCart}
          addToCompare={addToCompare}
          removeFromCompare={removeFromCompare}
          compareItems={compareItems}
          onShare={handleShare}
          onTrack={trackEvent}
          slidesToShow={4}
          autoPlay={true}
          onQuickView={setQuickViewProduct}
          onShowReviews={setShowReviewsForProduct}
          isInWishlist={isInWishlist}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
        />
      )}

      {personalizedProducts.length > 0 && (
        <ProductSlider
          products={personalizedProducts}
          title={t('products.personalized', 'Recommended for You')}
          viewMode={viewMode}
          addToCart={addToCart}
          addToCompare={addToCompare}
          removeFromCompare={removeFromCompare}
          compareItems={compareItems}
          onShare={handleShare}
          onTrack={trackEvent}
          slidesToShow={4}
          autoPlay={true}
          onQuickView={setQuickViewProduct}
          onShowReviews={setShowReviewsForProduct}
          isInWishlist={isInWishlist}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
        />
      )}

      {relatedBlogPosts.length > 0 && (
        <div className="related-blog-posts">
          <h2 className="related-blog-title">{t('products.relatedBlogs', 'Related Articles')}</h2>
          <div className="blog-posts-grid">
            {relatedBlogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {quickViewProduct && (
          <ProductQuickView
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            removeFromWishlist={removeFromWishlist}
            isInWishlist={isInWishlist(quickViewProduct.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewsForProduct && (
          <ProductReviews
            productId={showReviewsForProduct}
            onClose={() => setShowReviewsForProduct(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="back-to-top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={t('products.backToTop', 'Back to top')}
          >
            <ArrowUpIcon className="back-to-top-icon" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;