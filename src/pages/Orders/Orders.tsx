import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../Context/AuthContext/AuthContext';
import './Orders.css';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  // Mock orders data
  const orders = [
    { id: '123', date: '2025-05-01', total: 150.99, status: t('orders.status.pending') },
    { id: '124', date: '2025-04-15', total: 299.50, status: t('orders.status.shipped') },
  ];

  return (
    <div className="orders-page max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">{t('orders.title')}</h1>
      {user ? (
        orders.length > 0 ? (
          <div className="orders-list flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="order-item bg-white p-4 rounded-md shadow">
                <h3 className="text-lg font-medium">{t('orders.order')} #{order.id}</h3>
                <p>{t('orders.date')}: {order.date}</p>
                <p>{t('orders.total')}: ${order.total.toFixed(2)}</p>
                <p>{t('orders.status')}: {order.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">{t('orders.noOrders')}</p>
        )
      ) : (
        <p className="text-gray-600">{t('orders.noUser')}</p>
      )}
    </div>
  );
};

export default Orders;