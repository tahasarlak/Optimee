import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cpu, ShoppingBag, Tool, Grid } from 'react-feather';

export interface Banner {
  src: string;
  altKey: string;
  priority?: number;
  brand?: string;
  tags?: string[];
  link?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  minimumOrder: string;
  inStock: boolean;
  brand?: string;
  tags?: string[];
  rating?: number;
  discount?: number;
  stockQuantity?: number;
}

export interface Category {
  name: string;
  banners: Banner[]; // تغییر از image به banners
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => void;
  loading: boolean;
  error: { message: string; type?: string } | null;
  retryFetch: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const normalizePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
};

const defaultCategories: Category[] = [
  {
    name: 'all',
    banners: [], // بعداً با اولین بنر هر دسته‌بندی پر می‌شود
    title: 'All Categories',
    path: '/products?category=all',
    icon: Grid,
  },
  {
    name: 'Electronics',
    banners: [
      { src: '/assets/banners/electronics1.jpg', altKey: 'Electronics Banner 1', priority: 1, brand: 'all', tags: ['new'] },
      { src: '/assets/banners/electronics2.jpg', altKey: 'Electronics Banner 2', priority: 2, brand: 'TechCorp', tags: ['featured'] },
    ],
    title: 'Electronics',
    path: '/products?category=Electronics',
    icon: Cpu,
  },
  {
    name: 'Textiles',
    banners: [
      { src: '/assets/banners/textiles1.jpg', altKey: 'Textiles Banner 1', priority: 1, brand: 'all', tags: ['sustainable'] },
      { src: '/assets/banners/textiles2.jpg', altKey: 'Textiles Banner 2', priority: 2, brand: 'FabricWorld', tags: ['trending'] },
    ],
    title: 'Textiles',
    path: '/products?category=Textiles',
    icon: ShoppingBag,
  },
  {
    name: 'Tools',
    banners: [
      { src: '/assets/banners/tools1.jpg', altKey: 'Tools Banner 1', priority: 1, brand: 'all', tags: ['discounted'] },
      { src: '/assets/banners/tools2.jpg', altKey: 'Tools Banner 2', priority: 2, brand: 'ToolMaster', tags: ['trending'] },
    ],
    title: 'Tools',
    path: '/products?category=Tools',
    icon: Tool,
  },
];

// جمع‌آوری اولین بنر هر دسته‌بندی برای دسته‌بندی 'all'
const updateAllCategoryBanners = (categories: Category[]): Category[] => {
  const allCategory = categories.find((cat) => cat.name === 'all');
  if (allCategory) {
    allCategory.banners = categories
      .filter((cat) => cat.name !== 'all')
      .map((cat) => cat.banners[0]) // اولین بنر هر دسته‌بندی
      .filter((banner): banner is Banner => !!banner);
  }
  return categories;
};

const defaultProducts: Product[] = [
  {
    id: 1,
    title: 'Bulk Electronics',
    description: 'High-quality electronic components for industrial use.',
    price: normalizePrice('$5000'),
    image: '/assets/products/electronics.jpg',
    category: 'Electronics',
    minimumOrder: '100 units',
    inStock: true,
    brand: 'TechCorp',
    tags: ['new', 'featured', 'trending'],
    rating: 4.5,
    discount: 0,
    stockQuantity: 50,
  },
  {
    id: 2,
    title: 'Textile Fabrics',
    description: 'Premium fabrics for clothing manufacturing.',
    price: normalizePrice('$2000'),
    image: '/assets/products/textiles.jpg',
    category: 'Textiles',
    minimumOrder: '500 meters',
    inStock: false,
    brand: 'FabricWorld',
    tags: ['sustainable'],
    rating: 4.0,
    discount: 10,
    stockQuantity: 0,
  },
  {
    id: 3,
    title: 'Industrial Tools',
    description: 'Durable tools for heavy-duty industrial applications.',
    price: normalizePrice('$3500'),
    image: '/assets/products/tools.jpg',
    category: 'Tools',
    minimumOrder: '50 units',
    inStock: true,
    brand: 'ToolMaster',
    tags: ['discounted', 'trending'],
    rating: 4.8,
    discount: 20,
    stockQuantity: 10,
  },  
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(updateAllCategoryBanners(defaultCategories));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type?: string } | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    try {
      setProducts(defaultProducts);
      setCategories(updateAllCategoryBanners(defaultCategories));
      setError(null);
    } catch (err) {
      setError({ message: 'Failed to load products', type: 'unknown' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const retryFetch = () => {
    setError(null);
    fetchProducts();
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [
      ...prev,
      {
        ...product,
        brand: product.brand || 'Unknown',
        price: normalizePrice(product.price),
        tags: product.tags || [],
        rating: product.rating || 0,
        discount: product.discount || 0,
        stockQuantity: product.stockQuantity || 0,
        image: product.image?.replace('.jpg', '.webp') || '/assets/fallback.webp',
      },
    ]);
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.error('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, addProduct, loading, error, retryFetch }}>
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

export default ProductProvider;