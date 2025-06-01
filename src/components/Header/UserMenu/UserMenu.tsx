import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../Context/AuthContext/AuthContext';
import './UserMenu.css';

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false);
    navigate('/login');
  }, [logout, navigate]);

  const userMenuItems = [
    { name: t('nav.profile'), path: '/profile' },
    { name: t('nav.orders'), path: '/orders' },
    { name: t('nav.wishlist'), path: '/wishlist' },
    { name: t('nav.logout'), action: handleLogout },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  return (
    <motion.div
      className="user-menu"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={toggleMenu}
        className="user-menu-button"
        aria-expanded={isOpen}
        aria-controls="user-menu-dropdown"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={t('nav.profileAvatar')}
            className="user-menu-avatar"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = '/assets/fallback-avatar.png')}
          />
        ) : (
          <div className="user-menu-placeholder">
            <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
        )}
        <span className="user-menu-name">{user?.name || t('nav.profile')}</span>
        <ChevronDown
          className={`user-menu-icon ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        id="user-menu-dropdown"
        className="user-menu-dropdown"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="user-menu-content">
          {userMenuItems.map((item) =>
            item.path ? (
              <Link
                key={item.path}
                to={item.path}
                className="user-menu-link"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={item.action}
                className="user-menu-link"
              >
                {item.name}
              </button>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserMenu;