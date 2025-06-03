import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../Context/ProductContext/ProductContext';
import './ProductVariants.css';

interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

interface ProductVariantsProps {
  product: Product;
  onSelectVariant: (variantId: string) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ product, onSelectVariant }) => {
  const { t } = useTranslation();
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});

  // نمونه داده‌های تنوع (برای شبیه‌سازی بدون بک‌اند)
  const variants: ProductVariant[] = [
    { id: 'color', name: t('products.variants.color', 'Color'), options: ['Red', 'Blue', 'Black'] },
    { id: 'size', name: t('products.variants.size', 'Size'), options: ['S', 'M', 'L'] },
  ];

  const handleVariantChange = (variantId: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantId]: option }));
    onSelectVariant(`${variantId}:${option}`);
  };

  return (
    <div className="product-variants">
      {variants.map((variant) => (
        <div key={variant.id} className="variant-group">
          <label className="variant-label">{variant.name}</label>
          <div className="variant-options">
            {variant.options.map((option) => (
              <button
                key={option}
                className={`variant-option ${selectedVariants[variant.id] === option ? 'active' : ''}`}
                onClick={() => handleVariantChange(variant.id, option)}
                aria-label={t('products.variants.selectOption', { option, variant: variant.name })}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;