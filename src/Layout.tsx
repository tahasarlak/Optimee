import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  // Determine direction based on language
  const direction = i18n.language === 'fa' ? 'rtl' : 'ltr';

  return (
    <div className="flex flex-col min-h-screen" dir={direction}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;