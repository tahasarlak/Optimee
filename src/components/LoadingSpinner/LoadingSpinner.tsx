import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <motion.div
      className="loading-spinner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-label="Loading"
    >
      <div className="spinner"></div>
    </motion.div>
  );
};

export default LoadingSpinner;