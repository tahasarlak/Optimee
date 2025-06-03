import React, { createContext, useContext, useState, useEffect } from 'react';

interface Review {
  productId: number;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Review) => void;
  getReviewsByProduct: (productId: number) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (review: Review) => {
    setReviews((prev) => [...prev, review]);
  };

  const getReviewsByProduct = (productId: number) => {
    return reviews.filter((review) => review.productId === productId);
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewsByProduct }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};