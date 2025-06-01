import React from 'react';
import { Menu, X } from 'react-feather';
import './HamburgerMenuIcon.css';

interface HamburgerMenuIconProps {
  isOpen: boolean;
  toggle: () => void;
  ariaLabel: string;
}

const HamburgerMenuIcon: React.FC<HamburgerMenuIconProps> = ({ isOpen, toggle, ariaLabel }) => {
  return (
    <button className="menu-button flex items-center bg-transparent border-none cursor-pointer md:hidden" onClick={toggle} aria-label={ariaLabel}>
      {isOpen ? <X className="menu-icon w-6 h-6" /> : <Menu className="menu-icon w-6 h-6" />}
    </button>
  );
};

export default HamburgerMenuIcon;