import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'USD';
  });
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  useEffect(() => {
    // نرخ تبدیل ارز (برای شبیه‌سازی بدون بک‌اند)
    const rates: { [key: string]: number } = {
      USD: 1,
      IRR: 42000,
      EUR: 0.85,
      GBP: 0.73,
    };
    setExchangeRate(rates[currency] || 1);
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};