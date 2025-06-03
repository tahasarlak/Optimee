import React, { JSX, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Autosuggest from 'react-autosuggest';
import { Product } from '../../Context/ProductContext/ProductContext';
import './ProductFilters.css';

// تعریف نوع‌های دستی برای Autosuggest
interface Suggestion {
  title: string;
}

interface AutosuggestProps {
  suggestions: Suggestion[];
  onSuggestionsFetchRequested: (params: { value: string; reason: string }) => void;
  onSuggestionsClearRequested: () => void;
  getSuggestionValue: (suggestion: Suggestion) => string;
  renderSuggestion: (suggestion: Suggestion) => JSX.Element;
  inputProps: {
    value: string;
    onChange: (event: React.FormEvent<HTMLElement>, params: { newValue: string }) => void;
    placeholder?: string;
    className?: string;
    'aria-label'?: string;
  };
}

// به‌روزرسانی رابط props
interface ProductFiltersProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  inStockFilter: 'all' | 'inStock' | 'outOfStock';
  setInStockFilter: (value: 'all' | 'inStock' | 'outOfStock') => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRating: number;
  setSelectedRating: (value: number) => void;
  discountFilter: boolean;
  setDiscountFilter: (value: boolean) => void;
  savedFilters: any[];
  onSaveFilters: () => void;
  onApplySavedFilter: (filter: any) => void;
  onClose: () => void;
  onApply: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange,
  inStockFilter,
  setInStockFilter,
  selectedTags,
  setSelectedTags,
  selectedRating,
  setSelectedRating,
  discountFilter,
  setDiscountFilter,
  savedFilters,
  onSaveFilters,
  onApplySavedFilter,
  onClose,
  onApply,
}) => {
  const { t } = useTranslation();

  const categories = useMemo(() => ['all', ...new Set(products.map((p) => p.category))], [products]);
  const brands = useMemo(() => ['all', ...new Set(products.map((p) => p.brand || 'Unknown'))], [products]);
  const tags = useMemo(() => ['all', ...new Set(products.flatMap((p) => p.tags || []))], [products]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const suggestions = useMemo(() => {
    return products
      .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((p) => ({ title: p.title }))
      .slice(0, 5);
  }, [products, searchTerm]);

  const handlePriceRangeChange = useCallback(
    (index: number, value: number) => {
      setPriceRange((prev) => {
        const newRange = [...prev] as [number, number];
        newRange[index] = value;
        return newRange;
      });
    },
    [setPriceRange]
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    },
    [setSelectedTags]
  );

  const resetFilters = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setSearchTerm('');
      setSelectedCategory('all');
      setSelectedBrand('all');
      setSortOption('default');
      setPriceRange([0, 10000]);
      setInStockFilter('all');
      setSelectedTags([]);
      setSelectedRating(0);
      setDiscountFilter(false);
    },
    [
      setSearchTerm,
      setSelectedCategory,
      setSelectedBrand,
      setSortOption,
      setPriceRange,
      setInStockFilter,
      setSelectedTags,
      setSelectedRating,
      setDiscountFilter,
    ]
  );

  const handleApply = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onApply();
    },
    [onApply]
  );

  const handleModalClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const applyQuickFilter = (type: string) => {
    resetFilters({ stopPropagation: () => {} } as any);
    switch (type) {
      case 'discounted':
        setDiscountFilter(true);
        break;
      case 'trending':
        setSelectedTags(['trending']);
        break;
      case 'inStock':
        setInStockFilter('inStock');
        break;
    }
    onApply();
  };

  return (
    <motion.div
      className="filter-modal"
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.3 }}
      onClick={handleModalClick}
      role="dialog"
      aria-labelledby="filter-modal-title"
      aria-controls="products-grid"
    >
      <div className="filter-modal-header">
        <h2 id="filter-modal-title">{t('products.filters', 'Filters')}</h2>
        <button
          onClick={onClose}
          className="close-button"
          aria-label={t('products.closeFilters', 'Close Filters')}
        >
          <XMarkIcon className="close-icon" />
        </button>
      </div>

      <div className="filter-content">
        <div className="search-container">
          <MagnifyingGlassIcon className="search-icon" />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={(params: { value: string; reason: string }) => {
              // منطق پیشنهادی در صورت نیاز
            }}
            onSuggestionsClearRequested={() => {
              // پاک کردن پیشنهادات
            }}
            getSuggestionValue={(suggestion: Suggestion) => suggestion.title}
            renderSuggestion={(suggestion: Suggestion) => <div>{suggestion.title}</div>}
            inputProps={{
              value: searchTerm,
              onChange: (_event: React.FormEvent<HTMLElement>, { newValue }: { newValue: string }) =>
                setSearchTerm(newValue),
              placeholder: t('search.placeholder', 'Search products...'),
              className: 'search-input',
              'aria-label': t('search.ariaLabel', 'Search products'),
            }}
          />
        </div>

        {/* بقیه کد بدون تغییر باقی می‌ماند */}
        <div className="quick-filters">
          <button
            className="quick-filter-button"
            onClick={() => applyQuickFilter('discounted')}
            aria-label={t('products.quickFilters.discounted')}
          >
            {t('products.quickFilters.discounted', 'Discounted Products')}
          </button>
          <button
            className="quick-filter-button"
            onClick={() => applyQuickFilter('trending')}
            aria-label={t('products.quickFilters.trending')}
          >
            {t('products.quickFilters.trending', 'Trending Products')}
          </button>
          <button
            className="quick-filter-button"
            onClick={() => applyQuickFilter('inStock')}
            aria-label={t('products.quickFilters.inStock')}
          >
            {t('products.quickFilters.inStock', 'In Stock Only')}
          </button>
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            {t('products.category', 'Category')}
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-filter"
            aria-label={t('products.categoryAriaLabel', 'Filter by category')}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {`${t(`nav.categories.${category}`, category === 'all' ? 'All Categories' : category)} (${
                  categoryCounts[category] || 0
                })`}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="brand-filter" className="filter-label">
            {t('products.brand', 'Brand')}
          </label>
          <select
            id="brand-filter"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="select-filter"
            aria-label={t('products.brandAriaLabel', 'Filter by brand')}
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {t(`nav.brands.${brand}`, brand === 'all' ? 'All Brands' : brand)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('products.tags', 'Tags')}</label>
          <div className="tags-container">
            {tags.map((tag) => (
              <label key={tag} className="tag-label">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  aria-label={t(`products.tags.${tag}`, tag)}
                />
                {t(`products.tags.${tag}`, tag)}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter" className="filter-label">
            {t('products.sort', 'Sort')}
          </label>
          <select
            id="sort-filter"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select-filter"
            aria-label={t('products.sortAriaLabel', 'Sort products')}
          >
            <option value="default">{t('products.sort.default', 'Default Sort')}</option>
            <option value="price-asc">{t('products.sort.priceAsc', 'Price: Low to High')}</option>
            <option value="price-desc">{t('products.sort.priceDesc', 'Price: High to Low')}</option>
            <option value="title-asc">{t('products.sort.titleAsc', 'Title: A to Z')}</option>
            <option value="rating-desc">{t('products.sort.ratingDesc', 'Rating: High to Low')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="stock-filter" className="filter-label">
            {t('products.stock', 'Stock Status')}
          </label>
          <select
            id="stock-filter"
            value={inStockFilter}
            onChange={(e) => setInStockFilter(e.target.value as 'all' | 'inStock' | 'outOfStock')}
            className="select-filter"
            aria-label={t('products.stockAriaLabel', 'Filter by stock status')}
          >
            <option value="all">{t('products.stock.all', 'All Stock Status')}</option>
            <option value="inStock">{t('products.inStock', 'In Stock')}</option>
            <option value="outOfStock">{t('products.outOfStock', 'Out of Stock')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="rating-filter" className="filter-label">
            {t('products.rating', 'Minimum Rating')}
          </label>
          <select
            id="rating-filter"
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseInt(e.target.value))}
            className="select-filter"
            aria-label={t('products.ratingAriaLabel', 'Filter by rating')}
          >
            <option value={0}>{t('products.rating.all', 'All Ratings')}</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <input
              type="checkbox"
              checked={discountFilter}
              onChange={(e) => setDiscountFilter(e.target.checked)}
              aria-label={t('products.discountFilter', 'Show discounted products only')}
            />
            {t('products.discountFilter', 'Show Discounted Products Only')}
          </label>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('products.priceRange', 'Price Range')}</label>
          <div className="price-range-container">
            <input
              type="range"
              min={0}
              max={10000}
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, parseFloat(e.target.value))}
              className="price-range-input"
              aria-label={t('products.priceMinAriaLabel', 'Minimum price filter')}
            />
            <input
              type="range"
              min={0}
              max={10000}
              value={priceRange[1] === Infinity ? 10000 : priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, parseFloat(e.target.value))}
              className="price-range-input"
              aria-label={t('products.priceMaxAriaLabel', 'Maximum price filter')}
            />
            <div className="price-range-values">
              <span>{priceRange[0]}</span>
              <span>{priceRange[1] === Infinity ? '∞' : priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('products.savedFilters', 'Saved Filters')}</label>
          {savedFilters.length > 0 ? (
            <select
              onChange={(e) => {
                const index = parseInt(e.target.value);
                if (index >= 0) onApplySavedFilter(savedFilters[index]);
              }}
              className="select-filter"
              aria-label={t('products.savedFiltersAriaLabel', 'Select saved filters')}
            >
              <option value="-1">{t('products.selectSavedFilter', 'Select a saved filter')}</option>
              {savedFilters.map((filter, index) => (
                <option key={index} value={index}>
                  {filter.searchTerm || `Filter ${index + 1}`}
                </option>
              ))}
            </select>
          ) : (
            <p>{t('products.noSavedFilters', 'No saved filters')}</p>
          )}
          <button className="save-filter-button" onClick={onSaveFilters}>
            {t('products.saveFilters', 'Save Filters')}
          </button>
        </div>

        <div className="filter-actions">
          <button className="reset-filter-button" onClick={resetFilters}>
            {t('products.resetFilters', 'Reset Filters')}
          </button>
          <button className="apply-filter-button" onClick={handleApply}>
            {t('products.applyFilters', 'Apply Filters')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductFilters;