import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  productId: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (productId: number) => {
    setWishlist((prev) => [...prev, { productId }]);
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};