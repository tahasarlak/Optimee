import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../Context/ProductContext/ProductContext';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: number;
  category: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, currentProductId, category }) => {
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId && p.category === category)
    .slice(0, 3);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover transition duration-300 hover:brightness-110"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              <p className="text-blue-600 font-bold mt-2">{product.price}</p>
              <Link
                to={`/products/${product.id}`}
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
                aria-label={`View details for ${product.title}`}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;