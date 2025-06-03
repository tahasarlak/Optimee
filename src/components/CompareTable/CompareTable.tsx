import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Product, normalizePrice } from '../../Context/ProductContext/ProductContext';
import { useCurrency } from '../../Context/CurrencyContext/CurrencyContext';
import './CompareTable.css';

interface CompareTableProps {
  products: Product[];
  removeFromCompare: (productId: number) => void;
}

const CompareTable: React.FC<CompareTableProps> = React.memo(({ products, removeFromCompare }) => {
  const { t, i18n } = useTranslation();
  const { currency, exchangeRate } = useCurrency();

  return (
    <motion.div
      className="compare-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="grid"
      aria-label={t('products.compareTable', 'Product Comparison Table')}
    >
      <h2>{t('products.compareTable', 'Compare Products')}</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">{t('products.feature', 'Feature')}</th>
            {products.map((product) => (
              <th key={product.id} scope="col">
                {product.title}
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="remove-compare"
                  aria-label={t('products.removeFromCompareAria', { title: product.title })}
                >
                  {t('products.remove', 'Remove')}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{t('products.image', 'Image')}</th>
            {products.map((product) => (
              <td key={product.id}>
                <img
                  src={product.image?.replace('.jpg', '.avif') || '/assets/fallback.avif'}
                  alt={t('products.imageAlt', { title: product.title })}
                  className="compare-image"
                />
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row">{t('products.price', 'Price')}</th>
            {products.map((product) => (
              <td key={product.id}>
                {new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US', {
                  style: 'currency',
                  currency,
                }).format(normalizePrice(product.price) * exchangeRate * (1 - (product.discount || 0) / 100))}
                {product.discount ? ` (${product.discount}% OFF)` : ''}
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row">{t('products.brand', 'Brand')}</th>
            {products.map((product) => (
              <td key={product.id}>{product.brand || 'Unknown'}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">{t('products.category', 'Category')}</th>
            {products.map((product) => (
              <td key={product.id}>{product.category}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">{t('products.rating', 'Rating')}</th>
            {products.map((product) => (
              <td key={product.id}>{product.rating || 'N/A'}/5</td>
            ))}
          </tr>
          <tr>
            <th scope="row">{t('products.stock', 'Stock')}</th>
            {products.map((product) => (
              <td key={product.id}>
                {product.inStock ? t('products.inStock') : t('products.outOfStock')}
                {product.stockQuantity !== undefined && product.inStock
                  ? ` (${product.stockQuantity} left)`
                  : ''}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
});

export default CompareTable;