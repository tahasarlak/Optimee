import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProductContext } from '../Context/ProductContext/ProductContext';
import HeroSection from '../components/HeroSection/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts';
import AboutSection from '../components/AboutSection/AboutSection';
import CustomerSection from '../components/CustomerSection/CustomerSection';
import BuyerSection from '../components/BuyerSection/BuyerSection';
import Testimonials from '../components/Testimonials/Testimonials';
import CallToAction from '../components/CallToAction/CallToAction';
import StickyCTABar from '../components/StickyCTABar/StickyCTABar';

const Home: React.FC = () => {
  const { products } = useProductContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async product loading (replace with real API call if needed)
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>B2B Bulk Sales | High-Quality Industrial Supplies</title>
        <meta
          name="description"
          content="Your trusted partner for bulk industrial supplies in Russia, Iran, and globally. Streamline your supply chain with reliable, cost-effective solutions."
        />
        <meta name="keywords" content="B2B, bulk sales, industrial supplies, Russia, Iran, wholesale" />
      </Helmet>
      <div className="bg-gray-100">
<HeroSection
  backgroundImage="/to/hero-image.jpg"
  fallbackImage="/path/to/fallback-image.jpg"
  ctaLink="/shop"
/>        <FeaturedProducts products={products} />
        <AboutSection />
        <CustomerSection />
        <BuyerSection />
        <Testimonials />
        <CallToAction />
        {/* <StickyCTABar /> */}
      </div>
    </>
  );
};

export default Home;