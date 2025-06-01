
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../../Context/BlogContext/BlogContext';
import { useCart } from '../../Context/CartContext/CartContext';
import { useUser } from '../../Context/UserContext/UserContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Share2 } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const { posts, categories, filterByCategory, selectedCategory } = useBlog();
  const { addToCart } = useCart();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedCategory !== 'All') {
      result = result.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleAddToCart = (post: { id: string; title: string; image?: string }) => {
    try {
      addToCart({
        id: post.id,
        name: post.title,
        price: 10.00,
        quantity: 1,
        image: post.image,
      });
    } catch (err) {
      setError(t('blog.error.addToCart'));
    }
  };

  const handleShare = (post: { title: string; id: string }) => {
    const shareUrl = `${window.location.origin}/blog/${post.id}`;
    navigator.share?.({
      title: post.title,
      url: shareUrl,
    }).catch(() => {
      navigator.clipboard.writeText(shareUrl);
      alert(t('blog.share.copied'));
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{t('blog.title')}</title>
        <meta name="description" content={t('blog.description')} />
        <meta name="keywords" content={categories.join(', ')} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: t('blog.title'),
            description: t('blog.description'),
            blogPost: paginatedPosts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              image: post.image,
            })),
          })}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('blog.title')}</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full sm:w-auto max-w-md"
            aria-label={t('blog.search')}
          >
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label={t('blog.searchPlaceholder')}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700"
              aria-label={t('blog.searchButton')}
            >
              <Search size={20} />
            </button>
          </form>
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label={t('blog.sortBy')}
            >
              <option value="date">{t('blog.sortByDate')}</option>
              <option value="title">{t('blog.sortByTitle')}</option>
            </select>
          </div>
        </div>

        {user && user.preferredCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('blog.recommendedFor', { name: user.name })}
            </h2>
            <p className="text-gray-600">
              {t('blog.basedOnPreferences', { categories: user.preferredCategories.join(', ') })}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={t('blog.filterByCategory', { category })}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded" role="alert">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p>{t('blog.loading')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.length === 0 ? (
                <p className="text-center col-span-full">{t('blog.noPosts')}</p>
              ) : (
                paginatedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {post.image && (
                      <Suspense fallback={<div className="w-full h-48 bg-gray-200"></div>}>
                        <LazyLoadImage
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                          effect="blur"
                        />
                      </Suspense>
                    )}
                    <div className="p-6">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-blue-600 hover:underline"
                          aria-label={t('blog.readMore', { title: post.title })}
                        >
                          {t('blog.readMore')}
                        </Link>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(post)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            aria-label={t('blog.addToCart', { title: post.title })}
                          >
                            {t('blog.addToCart')}
                          </button>
                          <button
                            onClick={() => handleShare(post)}
                            className="p-2 text-gray-600 hover:text-blue-600"
                            aria-label={t('blog.share', { title: post.title })}
                          >
                            <Share2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-full ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    aria-label={t('blog.page', { page })}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

class BlogErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center p-8 text-red-600">Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

export default () => (
  <BlogErrorBoundary>
    <Blog />
  </BlogErrorBoundary>
);
