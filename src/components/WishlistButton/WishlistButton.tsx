import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import './WishlistButton.css';

interface WishlistButtonProps {
  productId: number;
  isInWishlist: boolean;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (isInWishlist) {
      removeFromWishlist(productId);
      toast.info(t('wishlist.removed', 'Removed from wishlist'));
    } else {
      addToWishlist(productId);
      toast.success(t('wishlist.added', 'Added to wishlist'));
    }
  };

  return (
    <button
      className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
      onClick={handleClick}
      aria-label={
        isInWishlist
          ? t('wishlist.removeAria', 'Remove from wishlist')
          : t('wishlist.addAria', 'Add to wishlist')
      }
    >
      <HeartIcon className="wishlist-icon" />
    </button>
  );
};

export default WishlistButton;