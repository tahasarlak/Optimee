import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  preferredCategories: string[];
  browsingHistory: string[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    preferredCategories: ['Technology', 'Fashion'],
    browsingHistory: [],
  });

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser?.preferredCategories) {
      window.gtag?.('event', 'set_preferred_categories', {
        event_category: 'User',
        event_label: newUser.preferredCategories.join(','),
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};