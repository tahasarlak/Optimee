import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, ChevronDown } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import UserMenu from '../UserMenu/UserMenu';
import CurrencySwitcher from '../CurrencySwitcher/CurrencySwitcher';
import AuthButton from '../AuthButton/AuthButton';
import NotificationBadge from '../NotificationBadge/NotificationBadge';
import LanguageSwitcher from '../../LanguageSwitcher/LanguageSwitcher';
import { AuthContext } from '../../../Context/AuthContext/AuthContext';
import { useProductContext } from '../../../Context/ProductContext/ProductContext';
import './NavBar.css';

interface NavBarProps {
  toggleCartModal: () => void;
  totalItems: number;
  toggleSearchModal: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ toggleCartModal, totalItems, toggleSearchModal }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);
  const { categories } = useProductContext();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProductsMenu = useCallback(() => setIsProductsOpen((prev) => !prev), []);

  const handleCategoryClick = (categoryPath: string) => {
    setIsProductsOpen(false);
    navigate(categoryPath);
  };

  return (
    <motion.nav
      className="nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <a href="/" className="nav-link">
        {t('nav.home')}
      </a>
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
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.path}
                  onClick={() => handleCategoryClick(category.path)}
                  className="dropdown-link"
                >
                  <Icon className="category-icon" />
                  <span>{t(`nav.categories.${category.name}`, category.title)}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
      <a href="/contact" className="nav-link">
        {t('nav.contact')}
      </a>
      <a href="/blog" className="nav-link">
        {t('nav.blog')}
      </a>
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