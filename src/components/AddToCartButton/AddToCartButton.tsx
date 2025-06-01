import React, { useState } from 'react';
import { ShoppingCart } from '@mui/icons-material';

interface AddToCartButtonProps {
  productTitle: string;
  quantity: number;
  onAddToCart: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productTitle, quantity, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onAddToCart();
      alert(`Added ${quantity} of ${productTitle} to cart`);
    } catch (error) {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center px-6 py-2 rounded-lg font-semibold transition-colors ${
        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
      aria-label={`Add ${productTitle} to cart`}
    >
      <ShoppingCart className="mr-2" />
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;