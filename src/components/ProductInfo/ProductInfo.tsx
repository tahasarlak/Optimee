import React, { useState } from 'react';
import { Product } from '../../Context/ProductContext/ProductContext';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import QuantitySelector from '../QuantitySelector/QuantitySelector';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Placeholder for backend integration
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-blue-600 font-bold text-lg">Price: {product.price}</p>
      <p className="text-gray-600">Category: {product.category}</p>
      <p className="text-gray-600">Minimum Order: {product.minimumOrder}</p>
      <QuantitySelector minimumOrder={product.minimumOrder} onQuantityChange={setQuantity} />
      <AddToCartButton productTitle={product.title} quantity={quantity} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default ProductInfo;