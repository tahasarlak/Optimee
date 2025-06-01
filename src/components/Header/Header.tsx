import React, { useState, useContext, useCallback } from 'react';
import Modal from 'react-modal';
import { Menu, X } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../Context/CartContext/CartContext';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import Logo from './Logo/Logo';
import MobileMenu from './MobileMenu/MobileMenu';
import NavBar from './NavBar/NavBar';
import CartModal from './CartModal/CartModal';
import SearchModal from './SearchModal/SearchModal';
import './Header.css';

// Set app element for accessibility
Modal.setAppElement('#root');

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { totalItems } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
  const toggleCartModal = useCallback(() => setIsCartModalOpen((prev) => !prev), []);
  const toggleSearchModal = useCallback(() => setIsSearchModalOpen((prev) => !prev), []);

  return (
    <motion.header
      className="header"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="header-container">
        <Logo />
        <NavBar
          toggleCartModal={toggleCartModal}
          totalItems={totalItems}
          toggleSearchModal={toggleSearchModal}
        />
        <button
          type="button"
          className="header-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? t('mobileMenu.close') : t('mobileMenu.open')}
        >
          {isMobileMenuOpen ? (
            <X className="header-icon" />
          ) : (
            <Menu className="header-icon" />
          )}
        </button>
      </div>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        toggleCartModal={toggleCartModal}
        toggleSearchModal={toggleSearchModal}
        totalItems={totalItems}
      />
   <CartModal
  isOpen={isCartModalOpen}
  toggleModal={toggleCartModal} // Changed to toggleModal
/>
<SearchModal
  isOpen={isSearchModalOpen}
  toggleModal={toggleSearchModal} // Changed to toggleModal
/>
    </motion.header>
  );
};

export default Header;