import React from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg">
      <img
        src={src}
        alt={alt}
        className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => (e.currentTarget.src = '/assets/fallback.jpg')} // Fallback image
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
    </div>
  );
};

export default ProductImage;