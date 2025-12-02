
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion } from "framer-motion";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from "react-share";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

const postImports = import.meta.glob("../posts/*.md", { eager: true });

const postsBySlug = Object.entries(postImports).reduce((acc, [filepath, module]) => {
  const slug = filepath.split('/').pop().replace('.md', '');
  const { attributes, html } = module;
  acc[slug] = {
    slug,
    title: attributes.title || 'Untitled Post',
    description: attributes.description || 'No description available.',
    date: attributes.date ? new Date(attributes.date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No Date',
    author: attributes.author || 'Scrapiz Team',
    featuredImage: attributes.featuredImage || null,
    readTime: attributes.readTime || '5 min read',
    category: attributes.category || 'General',
    content: html,
  };
  return acc;
}, {});

const BlogPost = () => {
  const { slug } = useParams();
  const post = postsBySlug[slug];
  const blogUrl = `https://www.scrapiz.in/blog/${slug}`;

  if (!post) {
    return <Navigate to="/404" />;
  }

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "name": post.title,
    "description": post.description,
    "image": post.featuredImage,
    "url": blogUrl,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
    },
     "publisher": {
      "@type": "Organization",
      "name": "Scrapiz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.scrapiz.in/logo.png"
      }
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.6,
  };

  return (
    <HelmetProvider>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="bg-white min-h-screen"
      >
        <Helmet>
          <title>{`${post.title} | Scrapiz Blog`}</title>
          <meta name="description" content={post.description} />
          <link rel="canonical" href={blogUrl} />
          <script type="application/ld+json">
            {JSON.stringify(blogPostSchema)}
          </script>
        </Helmet>
        
        <div className="pt-24">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                  <Link 
                    to="/blog" 
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Link>
                </div>
            </div>

          <main className="max-w-4xl mx-auto pb-16 px-4">
             <header className="mb-8 text-center">
                <span className="text-green-600 font-semibold">{post.category}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight my-3">{post.title}</h1>
                <div className="flex flex-wrap items-center justify-center text-gray-500 space-x-4 text-sm font-medium">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>{post.date}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{post.readTime}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-1.5" />
                        <span>{post.author}</span>
                    </div>
                </div>
            </header>

            {post.featuredImage && (
                <motion.div 
                    className="my-10 rounded-lg shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20}}
                    animate={{ opacity: 1, y: 0}}
                    transition={{delay: 0.2, duration: 0.5}}
                >
                    <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    width="800"
                    height="500"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    style={{ aspectRatio: '8/5' }}
                    />
                </motion.div>
            )}
            
            <article>
              <div 
                className="prose prose-lg lg:prose-xl max-w-none text-gray-700 prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </article>
          </main>

          <footer className="max-w-4xl mx-auto pb-16 px-4">
             <div className="border-t border-gray-200 mt-12 pt-8">
                <p className="text-center text-xl font-semibold mb-6 text-gray-700">Share This Post</p>
                <div className="flex justify-center items-center space-x-4">
                    <TwitterShareButton url={blogUrl} title={post.title} className="transform hover:scale-110 transition-transform duration-200">
                        <TwitterIcon size={44} round />
                    </TwitterShareButton>
                    <FacebookShareButton url={blogUrl} quote={post.title} className="transform hover:scale-110 transition-transform duration-200">
                        <FacebookIcon size={44} round />
                    </FacebookShareButton>
                    <LinkedinShareButton url={blogUrl} title={post.title} summary={post.description} className="transform hover:scale-110 transition-transform duration-200">
                        <LinkedinIcon size={44} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={blogUrl} title={post.title} className="transform hover:scale-110 transition-transform duration-200">
                        <WhatsappIcon size={44} round />
                    </WhatsappShareButton>
                </div>
             </div>
            </footer>
        </div>
      </motion.div>
    </HelmetProvider>
  );
};

export default BlogPost;
