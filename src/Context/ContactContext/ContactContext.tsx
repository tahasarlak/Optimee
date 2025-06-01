import React, { createContext, useContext } from 'react';

interface ContactContextType {
  submitContact: (name: string, email: string, message: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const submitContact = async (name: string, email: string, message: string) => {
    // Placeholder for backend API call
    console.log('Submitting contact:', { name, email, message });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <ContactContext.Provider value={{ submitContact }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContactContext = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
};