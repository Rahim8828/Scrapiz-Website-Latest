import { useEffect, useState } from "react"

export default function Navbar() {
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false)
      } else {
        setShow(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 
                    transition-all duration-500 ease-in-out
                    ${show ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"}`}
      >
        <div className="bg-white shadow-md rounded-full px-6 lg:px-10 py-3 lg:py-4 flex items-center gap-4 lg:gap-10">
          <div className="flex gap-3 lg:gap-5 text-gray-700 text-sm lg:text-lg font-medium">
            <button 
              onClick={() => handleNavClick('services')}
              className="hover:text-green-600 transition whitespace-nowrap"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-green-600 transition whitespace-nowrap"
            >
              How it works
            </button>
          </div>

          <button 
            onClick={() => handleNavClick('scrapiz')}
            className="text-2xl lg:text-4xl font-extrabold text-green-600 tracking-tight hover:scale-105 transition-transform"
          >
            Scrapiz
          </button>

          <div className="flex gap-3 lg:gap-5 text-gray-700 text-sm lg:text-lg font-medium">
            <button 
              onClick={() => handleNavClick('faqs')}
              className="hover:text-green-600 transition whitespace-nowrap"
            >
              FAQs
            </button>
            <button 
              onClick={() => handleNavClick('contact-us')}
              className="hover:text-green-600 transition whitespace-nowrap"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex justify-between items-center px-4 py-4">
          <button 
            onClick={() => handleNavClick('scrapiz')}
            className="text-2xl font-extrabold text-green-600"
          >
            Scrapiz
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleNavClick('services')}
                className="text-left text-gray-700 hover:text-green-600 transition py-2"
              >
                Services
              </button>
              <button 
                onClick={() => handleNavClick('how-it-works')}
                className="text-left text-gray-700 hover:text-green-600 transition py-2"
              >
                How it works
              </button>
              <button 
                onClick={() => handleNavClick('faqs')}
                className="text-left text-gray-700 hover:text-green-600 transition py-2"
              >
                FAQs
              </button>
              <button 
                onClick={() => handleNavClick('contact-us')}
                className="text-left text-gray-700 hover:text-green-600 transition py-2"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
