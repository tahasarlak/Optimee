import React, { useState, useEffect } from 'react';

interface QuantitySelectorProps {
  minimumOrder: string;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ minimumOrder, onQuantityChange }) => {
  const minQty = parseInt(minimumOrder) || 1; // Extract number from minimumOrder (e.g., "100 units" -> 100)
  const [quantity, setQuantity] = useState(minQty);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quantity < minQty) {
      setError(`Minimum order is ${minimumOrder}`);
    } else {
      setError(null);
    }
    onQuantityChange(quantity);
  }, [quantity, minQty, minimumOrder, onQuantityChange]);

  return (
    <div className="flex items-center mb-4">
      <label htmlFor="quantity" className="mr-2 text-gray-700 font-medium">
        Quantity:
      </label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || minQty)}
        min={minQty}
        className={`w-20 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        aria-describedby={error ? 'quantity-error' : undefined}
      />
      {error && (
        <p id="quantity-error" className="ml-2 text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default QuantitySelector;