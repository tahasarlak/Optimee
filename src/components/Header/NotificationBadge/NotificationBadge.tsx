import React from 'react';
import { Bell } from 'react-feather';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './NotificationBadge.css';

const NotificationBadge: React.FC = () => {
  const { t } = useTranslation();
  const notificationCount = 3; // Replace with actual logic

  return (
    <motion.button
      className="notification-button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={t('notifications.badge', { count: notificationCount })}
    >
      <Bell className="notification-icon" />
      {notificationCount > 0 && (
        <span className="notification-badge">
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
    </motion.button>
  );
};

export default NotificationBadge;