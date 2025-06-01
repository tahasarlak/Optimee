import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  // Mock wishlist data
  const wishlist = [
    { id: '1', name: 'Wireless Headphones', price: 99.99 },
    { id: '2', name: 'Smart Watch', price: 199.99 },
  ];

  return (
    <div className="wishlist-page max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">{t('wishlist.title')}</h1>
      {user ? (
        wishlist.length > 0 ? (
          <div className="wishlist-items flex flex-col gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item bg-white p-4 rounded-md shadow">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p>{t('wishlist.price')}: ${item.price.toFixed(2)}</p>
                <button
                  className="px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium mt-2"
                >
                  {t('wishlist.remove')}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">{t('wishlist.empty')}</p>
        )
      ) : (
        <p className="text-gray-600">{t('wishlist.noUser')}</p>
      )}
    </div>
  );
};

export default Wishlist;