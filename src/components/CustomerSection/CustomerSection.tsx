import React, { useState, useEffect, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import './CustomerSection.css';

interface Customer {
  id: number;
  name: string;
  logo: string;
  url?: string;
}

interface CustomerSectionProps {
  maxCustomers?: number; // Optional prop to limit displayed customers
}

const staticCustomers: Customer[] = [
  { id: 1, name: 'TechCorp Russia', logo: '/assets/customers/techcorp.jpg', url: 'https://techcorp.example.com' },
  { id: 2, name: 'Textile Solutions Iran', logo: '/assets/customers/textile-solutions.jpg', url: 'https://textile-solutions.example.com' },
  { id: 3, name: 'Global Industries', logo: '/assets/customers/global-industries.jpg', url: 'https://global-industries.example.com' },
  { id: 4, name: 'Mega Supplies', logo: '/assets/customers/mega-supplies.jpg', url: 'https://mega-supplies.example.com' },
];

const CustomerSection: React.FC<CustomerSectionProps> = ({ maxCustomers = 4 }) => {
  const { t, i18n } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>(staticCustomers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Simulate API call (replace with real API endpoint)
        // const response = await fetch('/api/customers');
        // const data = await response.json();
        // setCustomers(data.slice(0, maxCustomers));
        setCustomers(staticCustomers.slice(0, maxCustomers));
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError(t('customerSection.error'));
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, [t, maxCustomers]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], staggerChildren: 0.2 },
    },
    card: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const isRtl = i18n.language === 'fa';

  const handleLogoClick = useMemo(
    () => (customerName: string, customerUrl?: string) => {
      // Example: Track click event with analytics
      // gtag('event', 'customer_logo_click', { customer: customerName });
      if (customerUrl) {
        window.open(customerUrl, '_blank', 'noopener,noreferrer');
      }
    },
    []
  );

  if (isLoading) {
    return (
      <section className="customer-section">
        <div className="customer-container">
          <div className="animate-pulse customer-grid">
            {[...Array(maxCustomers)].map((_, i) => (
              <div key={i} className="customer-loading-card"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="customer-section">
        <div className="customer-container">
          <p className="customer-error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="customer-section" dir={isRtl ? 'rtl' : 'ltr'} itemScope itemType="http://schema.org/Organization" ref={ref}>
      <div className="customer-overlay" />
      <div className="customer-container">
        <motion.h2
          initial="hidden"
          animate={controls}
          variants={variants}
          className="customer-title"
        >
          {t('customerSection.title')}
        </motion.h2>
        <motion.p
          initial="hidden"
          animate={controls}
          variants={{ hidden: variants.hidden, visible: variants.card }}
          className="customer-description"
        >
          {t('customerSection.description')}
        </motion.p>
        <motion.div
          className="customer-grid"
          initial="hidden"
          animate={controls}
          variants={variants}
          role="list"
        >
          {customers.map((customer) => (
            <motion.div
              key={customer.id}
              className="customer-card"
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: variants.card }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 24px var(--shadow-color)' }}
            >
              <a
                href={customer.url || '#'}
                onClick={(e) => {
                  if (!customer.url) e.preventDefault();
                  handleLogoClick(customer.name, customer.url);
                }}
                className="customer-link"
                aria-label={`Visit ${customer.name} website`}
                itemProp="affiliation"
              >
                <LazyLoadImage
                  src={customer.logo}
                  alt={`${customer.name} logo`}
                  effect="blur"
                  placeholderSrc="/assets/customers/placeholder.jpg"
                  className="customer-logo"
                  onError={(e) => (e.currentTarget.src = '/assets/customers/fallback.jpg')}
                  itemProp="logo"
                />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerSection;