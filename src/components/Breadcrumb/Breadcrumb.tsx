import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  productTitle?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ productTitle }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-400">
          /
        </li>
        <li>
          <Link to="/products" className="hover:text-blue-600 transition-colors">
            Products
          </Link>
        </li>
        {productTitle && (
          <>
            <li aria-hidden="true" className="text-gray-400">
              /
            </li>
            <li className="text-gray-800" aria-current="page">
              {productTitle}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;