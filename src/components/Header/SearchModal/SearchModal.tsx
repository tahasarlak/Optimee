import React, { useCallback, useRef } from 'react';
import { Search, X } from 'react-feather';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, toggleModal }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={toggleModal}
      className="search-modal"
      overlayClassName="search-modal-overlay"
      closeTimeoutMS={300}
      onAfterOpen={handleFocus}
    >
      <motion.div
        className="search-modal-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="search-modal-header">
          <h2 className="search-modal-title">{t('search.title')}</h2>
          <button
            onClick={toggleModal}
            className="search-modal-close"
            aria-label={t('search.close')}
          >
            <X className="search-modal-icon" />
          </button>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            ref={inputRef}
            placeholder={t('search.placeholder')}
            className="search-input"
            aria-label={t('search.ariaLabel')}
          />
          <Search className="search-icon" aria-hidden="true" />
        </div>
      </motion.div>
    </Modal>
  );
};

export default SearchModal;