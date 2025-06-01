import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2 } from 'react-feather';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../Context/CartContext/CartContext';
import './CartModal.css';

interface CartModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, toggleModal }) => {
  const { t } = useTranslation();
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

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
          <h2 className="cart-modal-title">{t('cart.title')}</h2>
          <button
            onClick={toggleModal}
            className="cart-modal-close"
            aria-label={t('cart.close')}
          >
            <X className="cart-modal-icon" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="cart-modal-empty">{t('cart.empty')}</p>
        ) : (
          <div className="cart-modal-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-modal-item">
                <div className="cart-item-details">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = '/assets/fallback-item.png')}
                    />
                  )}
                  <div>
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">
                      {t('Price')}: ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="cart-item-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="cart-quantity-btn"
                    aria-label={t('cart.decrease', { item: item.name })}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="cart-quantity-btn"
                    aria-label={t('cart.increase', { item: item.name })}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cart-remove-btn"
                    aria-label={t('cart.remove', { item: item.name })}
                  >
                    <Trash2 className="cart-trash-icon" />
                  </button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <p className="cart-total-text">
                {t('cart.total')}: ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="cart-footer">
          <button
            onClick={toggleModal}
            className="cart-close-btn"
            aria-label={t('cart.close')}
          >
            {t('cart.close')}
          </button>
          <Link
            to="/cart"
            onClick={toggleModal}
            className="cart-checkout-btn"
            aria-label={t('cart.checkout')}
          >
            {t('cart.checkout')}
          </Link>
        </div>
      </motion.div>
    </Modal>
  );
};

export default CartModal;