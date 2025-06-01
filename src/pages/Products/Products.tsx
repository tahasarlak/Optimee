import React from 'react';
import { Link } from 'react-router-dom';
import { useProductContext } from '../../Context/ProductContext/ProductContext';

const Products: React.FC = () => {
  const { products } = useProductContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden">
            <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-blue-600 font-bold mt-2">{product.price}</p>
              <Link
                to={`/products/${product.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;