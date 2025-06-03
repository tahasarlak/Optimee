import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2 } from 'react-feather';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './CartModal.css';
import { useCart } from '../../../Context/CartContext/CartContext';
import { normalizePrice } from '../../../Context/ProductContext/ProductContext';

Modal.setAppElement('#root');

interface CartModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, toggleModal }) => {
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={toggleModal}
      className="cart-modal"
      overlayClassName="cart-modal-overlay"
      closeTimeoutMS={300}
    >
      <motion.div
        className="cart-modal-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="cart-modal-header">
          <h2 className="cart-modal-title">{t('cartModal.title', 'Your Cart')}</h2>
          <button
            onClick={toggleModal}
            className="cart-modal-close"
            aria-label={t('cartModal.close', 'Close cart modal')}
          >
            <X className="cart-modal-icon" />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="cart-modal-empty">{t('cartModal.empty', 'Your cart is empty.')}</p>
        ) : (
          <div className="cart-modal-items">
            {cart.map((item) => (
              <div key={item.product.id} className="cart-modal-item">
                <div className="cart-item-details">
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="cart-item-image"
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/assets/fallback-item.png')}
                    />
                  )}
                  <div>
                    <p className="cart-item-name">{item.product.title}</p>
                    <p className="cart-item-price">
                      {t('cartModal.price', 'Price')}: ${normalizePrice(item.product.price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="cart-item-controls">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="cart-quantity-btn"
                    aria-label={t('cartModal.decreaseQuantity', { item: item.product.title })}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="cart-quantity-btn"
                    aria-label={t('cartModal.increaseQuantity', { item: item.product.title })}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="cart-remove-btn"
                    aria-label={t('cartModal.removeItem', { item: item.product.title })}
                  >
                    <Trash2 className="cart-trash-icon" />
                  </button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <p className="cart-total-text">
                {t('cartModal.total', 'Total')}: ${totalPrice}
              </p>
            </div>
          </div>
        )}

        <div className="cart-footer">
          <button
            onClick={toggleModal}
            className="cart-close-btn"
            aria-label={t('cartModal.close', 'Close')}
          >
            {t('cartModal.close', 'Close')}
          </button>
          <Link
            to="/cart"
            onClick={toggleModal}
            className="cart-checkout-btn"
            aria-label={t('cartModal.checkout', 'Proceed to checkout')}
          >
            {t('cartModal.checkout', 'Checkout')}
          </Link>
        </div>
      </motion.div>
    </Modal>
  );
};

export default CartModal;