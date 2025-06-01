import React, { useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, ChevronDown } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import UserMenu from '../UserMenu/UserMenu';
import CurrencySwitcher from '../CurrencySwitcher/CurrencySwitcher';
import AuthButton from '../AuthButton/AuthButton';
import NotificationBadge from '../NotificationBadge/NotificationBadge';
import LanguageSwitcher from '../../LanguageSwitcher/LanguageSwitcher';
import { AuthContext } from '../../../Context/AuthContext/AuthContext';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMobileMenu: () => void;
  toggleCartModal: () => void;
  toggleSearchModal: () => void;
  totalItems: number;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  toggleMobileMenu,
  toggleCartModal,
  toggleSearchModal,
  totalItems,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const toggleProductsMenu = useCallback(() => setIsProductsOpen((prev) => !prev), []);

  const productCategories = [
    { name: t('nav.categories.electronics'), path: '/products/electronics' },
    { name: t('nav.categories.clothing'), path: '/products/clothing' },
    { name: t('nav.categories.home'), path: '/products/home' },
    { name: t('nav.categories.featured'), path: '/products/featured' },
    { name: t('nav.categories.deals'), path: '/products/deals' },
  ];

  return (
    <motion.div
      className="mobile-menu"
      initial={{ maxHeight: 0, opacity: 0 }}
      animate={{ maxHeight: isOpen ? '100vh' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <nav className="mobile-nav">
        <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
          {t('nav.home')}
        </Link>
        <div className="mobile-dropdown">
          <button
            onClick={toggleProductsMenu}
            className="mobile-dropdown-button"
            aria-expanded={isProductsOpen}
          >
            {t('nav.products')}
            <ChevronDown
              className={`mobile-dropdown-icon ${isProductsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <motion.div
            className="mobile-dropdown-content"
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: isProductsOpen ? 384 : 0, opacity: isProductsOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {productCategories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="mobile-dropdown-link"
                onClick={() => {
                  setIsProductsOpen(false);
                  toggleMobileMenu();
                }}
              >
                {category.name}
              </Link>
            ))}
          </motion.div>
        </div>
        <Link to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>
          {t('nav.contact')}
        </Link>
        <Link to="/blog" className="mobile-nav-link" onClick={toggleMobileMenu}>
          {t('nav.blog')}
        </Link>
        <button
          onClick={() => {
            toggleCartModal();
            toggleMobileMenu();
          }}
          className="mobile-cart-button"
        >
          <ShoppingCart className="mobile-cart-icon" />
          {t('nav.cart')}
          {totalItems > 0 && (
            <span className="mobile-cart-badge">{totalItems}</span>
          )}
        </button>
        <button
          onClick={() => {
            toggleSearchModal();
            toggleMobileMenu();
          }}
          className="mobile-search-button"
        >
          <Search className="mobile-search-icon" />
          {t('nav.search')}
        </button>
        <div className="mobile-menu-footer">
          <NotificationBadge />
          <CurrencySwitcher />
          {isAuthenticated ? <UserMenu /> : <AuthButton />}
          <LanguageSwitcher />
        </div>
      </nav>
    </motion.div>
  );
};

export default MobileMenu;