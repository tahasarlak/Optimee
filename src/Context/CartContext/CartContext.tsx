import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Product, normalizePrice } from '../ProductContext/ProductContext';
import { useTranslation } from 'react-i18next';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  totalPrice: string; // تغییر از number به string
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        toast.info(`${product.title} quantity updated in cart!`);
        window.gtag?.('event', 'add_to_cart', { event_category: 'Cart', event_label: product.title });
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`${product.title} added to cart!`);
      window.gtag?.('event', 'add_to_cart', { event_category: 'Cart', event_label: product.title });
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const product = prev.find((item) => item.product.id === productId)?.product;
      if (product) {
        toast.info(`${product.title} removed from cart!`);
        window.gtag?.('event', 'remove_from_cart', { event_category: 'Cart', event_label: product.title });
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + normalizePrice(item.product.price) * item.quantity,
    0
  );

  const formattedTotalPrice = new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US', {
    style: 'currency',
    currency: i18n.language === 'fa' ? 'IRR' : 'USD',
  }).format(totalPrice);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, totalPrice: formattedTotalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;