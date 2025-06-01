import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './CurrencySwitcher.css';

const CurrencySwitcher: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const currencies = [
    { name: 'USD', symbol: '$' },
    { name: 'EUR', symbol: '€' },
    { name: 'GBP', symbol: '£' },
  ];

  const handleCurrencySelect = useCallback((currency: string) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  }, []);

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
      className="currency-menu"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={toggleMenu}
        className="currency-button"
        aria-expanded={isOpen}
        aria-controls="currency-menu-dropdown"
      >
        <span>{selectedCurrency}</span>
        <ChevronDown
          className={`currency-icon ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        id="currency-menu-dropdown"
        className="currency-menu-dropdown"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="currency-menu-content">
          {currencies.map((currency) => (
            <button
              key={currency.name}
              onClick={() => handleCurrencySelect(currency.name)}
              className={`currency-menu-item ${selectedCurrency === currency.name ? 'selected' : ''}`}
            >
              {currency.name} ({currency.symbol})
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CurrencySwitcher;