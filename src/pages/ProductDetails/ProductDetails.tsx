import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowBack } from '@mui/icons-material';
import { Product, useProductContext } from '../../Context/ProductContext/ProductContext';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ProductImage from '../../components/ProductImage/ProductImage';
import ProductInfo from '../../components/ProductInfo/ProductInfo';
import RelatedProducts from '../../components/RelatedProducts/RelatedProducts';


const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductContext();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const foundProduct = products.find((p) => p.id === parseInt(id || ''));
    setProduct(foundProduct || null);
    setIsLoading(false);
  }, [id, products]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Link to="/products" className="text-blue-600 flex items-center hover:text-blue-700">
          <ArrowBack className="mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.title} | B2B Bulk Sales</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.title}, ${product.category}, bulk sales, B2B`} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb productTitle={product.title} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImage src={product.image} alt={product.title} />
          <ProductInfo product={product} />
        </div>
        <RelatedProducts products={products} currentProductId={product.id} category={product.category} />
      </div>
    </>
  );
};

export default ProductDetails;