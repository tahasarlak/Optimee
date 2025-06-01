import React from 'react';
import { Search } from 'react-feather';
import { useTranslation } from 'react-i18next';
import './SearchBar.css';

interface SearchBarProps {
  toggleSearchModal?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ toggleSearchModal }) => {
  const { t } = useTranslation();

  return (
    <div className="search-container hidden md:flex flex-1 mx-4 max-w-md">
      <div className="search-input-wrapper relative w-full">
        <input
          type="text"
          placeholder={t('header.search.placeholder')}
          className="search-input w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          aria-label={t('header.search.ariaLabel')}
          onClick={toggleSearchModal}
        />
      </div>
    </div>
  );
};

export default SearchBar;