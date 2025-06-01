import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  minimumOrder: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: 'Bulk Electronics',
      description: 'High-quality electronic components for industrial use.',
      price: '$5000',
      image: '/assets/electronics.jpg',
      category: 'Electronics',
      minimumOrder: '100 units',
    },
    {
      id: 2,
      title: 'Textile Fabrics',
      description: 'Premium fabrics for clothing manufacturing.',
      price: '$2000',
      image: '/assets/textiles.jpg',
      category: 'Textiles',
      minimumOrder: '500 meters',
    },
    {
      id: 3,
      title: 'Industrial Tools',
      description: 'Durable tools for heavy-duty industrial applications.',
      price: '$3500',
      image: '/assets/tools.jpg',
      category: 'Tools',
      minimumOrder: '50 units',
    },
  ]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};