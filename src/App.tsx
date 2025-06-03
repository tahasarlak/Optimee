import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ProductProvider } from './Context/ProductContext/ProductContext';
import { ContactProvider } from './Context/ContactContext/ContactContext';
import { CartProvider } from './Context/CartContext/CartContext';
import { UserProvider } from './Context/UserContext/UserContext';
import { BlogProvider } from './Context/BlogContext/BlogContext';
import { AuthProvider } from './Context/AuthContext/AuthContext';
import { CompareProvider } from './Context/CompareContext/CompareContext';
import { CurrencyProvider } from './Context/CurrencyContext/CurrencyContext';
import { WishlistProvider } from './Context/WishlistContext/WishlistContext'; // افزودن WishlistProvider
import Layout from './Layout';
import Home from './pages/page';
import Contact from './pages/Contact/Contact';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Products from './pages/Products/Products';
import Blog from './pages/Blog/Blog';
import Profile from './pages/Profile/Profile';
import Orders from './pages/Orders/Orders';
import Wishlist from './pages/Wishlist/Wishlist';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import * as Sentry from '@sentry/react';
import './styles/global.css';
import './i18n/i18n';
import { ReviewProvider } from './Context/ReviewContext/ReviewContext';

// Initialize Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <ContactProvider>
              <UserProvider>
                <BlogProvider>
                  <CompareProvider>
                    <CurrencyProvider>
                      <WishlistProvider>
                        <ReviewProvider> {/* افزودن WishlistProvider */}
                        <Router>
                          <Layout>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/products" element={<Products />} />
                              <Route path="/products/:id" element={<ProductDetails />} />
                              <Route path="/contact" element={<Contact />} />
                              <Route path="/blog" element={<Blog />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/orders" element={<Orders />} />
                              <Route path="/wishlist" element={<Wishlist />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/signup" element={<Signup />} />
                            </Routes>
                          </Layout>
                        </Router>
                        </ReviewProvider>
                      </WishlistProvider>
                    </CurrencyProvider>
                  </CompareProvider>
                </BlogProvider>
              </UserProvider>
            </ContactProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;