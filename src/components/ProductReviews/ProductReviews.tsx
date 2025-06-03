import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useReviews } from '../../Context/ReviewContext/ReviewContext';
import { useUser } from '../../Context/UserContext/UserContext';
import { toast } from 'react-toastify';
import './ProductReviews.css';

interface ProductReviewsProps {
  productId: number;
  onClose: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, onClose }) => {
  const { t } = useTranslation();
  const { reviews, addReview } = useReviews();
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const productReviews = reviews.filter((review) => review.productId === productId);

  const handleSubmitReview = () => {
    if (!user) {
      toast.error(t('products.reviews.loginRequired', 'Please log in to submit a review'));
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error(t('products.reviews.invalidRating', 'Please select a valid rating'));
      return;
    }
    addReview({
      productId,
      userId: user.id,
      rating,
      comment,
      date: new Date().toISOString(),
    });
    toast.success(t('products.reviews.submitted', 'Review submitted successfully'));
    setRating(0);
    setComment('');
  };

  return (
    <motion.div
      className="reviews-modal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-labelledby="reviews-title"
    >
      <div className="reviews-content">
        <button
          className="close-button"
          onClick={onClose}
          aria-label={t('products.closeReviews', 'Close Reviews')}
        >
          ×
        </button>
        <h2 id="reviews-title">{t('products.reviews.title', 'Product Reviews')}</h2>
        {productReviews.length > 0 ? (
          <div className="reviews-list">
            {productReviews.map((review, index) => (
              <div key={index} className="review-item">
                <p>{t('products.reviews.rating', 'Rating')}: {review.rating}/5</p>
                <p>{review.comment}</p>
                <p>{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>{t('products.reviews.noReviews', 'No reviews yet')}</p>
        )}
        {user && (
          <div className="review-form">
            <h3>{t('products.reviews.addReview', 'Add a Review')}</h3>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              aria-label={t('products.reviews.ratingAria', 'Select rating')}
            >
              <option value={0}>{t('products.reviews.selectRating', 'Select Rating')}</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('products.reviews.commentPlaceholder', 'Write your review...')}
              aria-label={t('products.reviews.commentAria', 'Review comment')}
            />
            <button onClick={handleSubmitReview}>{t('products.reviews.submit', 'Submit Review')}</button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductReviews;