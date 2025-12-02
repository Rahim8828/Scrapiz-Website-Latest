
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

const postImports = import.meta.glob("../posts/*.md", { eager: true });

const posts = Object.entries(postImports).map(([filepath, module]) => {
  const slug = filepath.split('/').pop().replace('.md', '');
  const { attributes } = module;
  return {
    slug,
    title: attributes.title || 'Untitled Post',
    date: attributes.date ? new Date(attributes.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Date',
    description: attributes.description || 'No description available.',
    rawDate: attributes.date ? new Date(attributes.date) : new Date(0),
    featuredImage: attributes.featuredImage || 'https://via.placeholder.com/400x250?text=Scrapiz+Blog',
    author: attributes.author || 'Scrapiz Team',
    readTime: attributes.readTime || '5 min read',
    category: attributes.category || 'General',
  };
})
.sort((a, b) => b.rawDate - a.rawDate);

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-white min-h-screen"
    >
      <Helmet>
        <title>Blog - Scrapiz</title>
        <meta name="description" content="Expert advice on scrap management, recycling best practices, and industry insights from the Scrapiz team." />
        <link rel="canonical" href="https://www.scrapiz.in/blog" />
        <script type="application/ld+json">
          {`
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Scrapiz Blog",
            "description": "Expert advice on scrap management, recycling best practices, and industry insights",
            "url": "https://www.scrapiz.in/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Scrapiz",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.scrapiz.in/Scrapiz-logo.webp"
              }
            }
          `}
        </script>
      </Helmet>
      
      <header className="bg-gray-50 hero-pattern pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16 text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-3 sm:mb-4"
          >
            Our <span className="text-gradient">Blog</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4"
          >
            Expert advice on scrap management, recycling best practices, and industry insights from the Scrapiz team.
          </motion.p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Coming Soon!</h2>
            <p className="text-gray-500">Our blog is under construction. Check back for insightful articles.
            To add a post, create a `.md` file in `src/posts`.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
              {currentPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        width="400"
                        height="250"
                        className="w-full h-44 sm:h-48 md:h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        style={{ aspectRatio: '8/5' }}
                      />
                       <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </Link>
                     <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 sm:px-3 rounded-full">{post.category}</span>
                  </div>
                  
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800 leading-tight">
                      <Link to={`/blog/${post.slug}`} className="hover:text-green-600 transition-colors duration-200">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 sm:mb-4 flex-grow line-clamp-3">{post.description}</p>
                    <div className="mt-auto border-t border-gray-100 pt-3 sm:pt-4 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <Calendar size={13} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[11px] sm:text-xs">{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <Clock size={13} className="sm:w-3.5 sm:h-3.5" />
                        <span className="text-[11px] sm:text-xs">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 sm:mt-12 lg:mt-16 space-x-1.5 sm:space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {[...Array(totalPages).keys()].map(number => {
                   const pageNumber = number + 1;
                  if (pageNumber > currentPage + 2 || pageNumber < currentPage - 2) {
                     if (pageNumber === 1 || pageNumber === totalPages) {
                       // always show first and last page
                     } else if (pageNumber === currentPage + 3 || pageNumber === currentPage - 3){
                        return <span key={pageNumber} className="p-2 text-gray-500">...</span>
                     }
                     else {
                       return null;
                     }
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === pageNumber 
                          ? 'bg-green-600 text-white shadow-sm' 
                          : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </motion.div>
  );
};

export default Blog;
