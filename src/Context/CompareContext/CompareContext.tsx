import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Product } from '../ProductContext/ProductContext';

interface CompareContextType {
  compareItems: number[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<number[]>([]);

  const addToCompare = (product: Product) => {
    if (compareItems.length < 4) {
      setCompareItems((prev) => [...prev, product.id]);
      toast.success(`${product.title} added to comparison!`);
      window.gtag?.('event', 'add_to_compare', { event_category: 'Compare', event_label: product.title });
    } else {
      toast.error('You can compare up to 4 products at a time.');
    }
  };

  const removeFromCompare = (productId: number) => {
    setCompareItems((prev) => prev.filter((id) => id !== productId));
    toast.info('Product removed from comparison.');
    window.gtag?.('event', 'remove_from_compare', { event_category: 'Compare', event_label: productId.toString() });
  };

  const clearCompare = () => {
    setCompareItems([]);
    toast.info('Comparison list cleared.');
    window.gtag?.('event', 'clear_compare', { event_category: 'Compare', event_label: 'All' });
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompareContext = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompareContext must be used within a CompareProvider');
  }
  return context;
};

export default CompareProvider;