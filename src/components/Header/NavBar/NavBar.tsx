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
import './NavBar.css';

interface NavBarProps {
  toggleCartModal: () => void;
  totalItems: number;
  toggleSearchModal: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ toggleCartModal, totalItems, toggleSearchModal }) => {
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
    <motion.nav
      className="nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="nav-link">
        {t('nav.home')}
      </Link>
      <div className="dropdown">
        <button
          onClick={toggleProductsMenu}
          className="dropdown-button"
          aria-expanded={isProductsOpen}
        >
          {t('nav.products')}
          <ChevronDown
            className={`dropdown-icon ${isProductsOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <motion.div
          className="dropdown-menu"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isProductsOpen ? 1 : 0, scale: isProductsOpen ? 1 : 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="dropdown-content">
            {productCategories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="dropdown-link"
                onClick={() => setIsProductsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
      <Link to="/contact" className="nav-link">
        {t('nav.contact')}
      </Link>
      <Link to="/blog" className="nav-link">
        {t('nav.blog')}
      </Link>
      <div className="nav-actions">
        <button
          onClick={toggleSearchModal}
          className="search-button"
        >
          <Search className="search-icon" />
        </button>
        <button
          onClick={toggleCartModal}
          className="cart-button"
        >
          <ShoppingCart className="cart-icon" />
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </button>
        <NotificationBadge />
        <CurrencySwitcher />
        {isAuthenticated ? <UserMenu /> : <AuthButton />}
        <LanguageSwitcher />
      </div>
    </motion.nav>
  );
};

export default NavBar;