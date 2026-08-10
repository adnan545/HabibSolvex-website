import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaGlobe, FaTimes, FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Manufacturing & Quality', path: '/manufacturing-quality' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
    scrollToTop();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 md:py-3' : 'bg-white py-3 md:py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-bold text-[#1a4d46] flex-shrink-0"
          onClick={scrollToTop}
        >
          Habib<span className="text-[#2d7d6b]">Solvex</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={scrollToTop}
                className={`relative text-sm font-medium transition-colors hover:text-[#1a4d46] ${
                  location.pathname === link.path ? 'text-[#1a4d46]' : 'text-[#2d3748]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#2d7d6b]"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side - No Login/Register */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#1a4d46] font-medium truncate max-w-[100px]">
                {user.name}
                {isAdmin && <span className="ml-1 text-xs text-[#2d7d6b]">(Admin)</span>}
              </span>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={scrollToTop}
                  className="text-sm text-[#2d7d6b] font-medium hover:text-[#1a4d46] transition-colors px-3 py-1.5 rounded-full border border-[#2d7d6b] hover:bg-[#e0f0ed]"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-[#2d3748] hover:text-[#1a4d46] transition-colors px-3 py-1.5 rounded-full border border-[#e0f0ed] hover:border-[#2d7d6b]"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            // Only show a simple user icon without Login/Register text
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="text-[#2d3748] hover:text-[#1a4d46] transition-colors p-2"
                aria-label="Login"
              >
                <FaUser />
              </Link>
            </div>
          )}
          <button className="text-[#2d3748] hover:text-[#1a4d46] transition-colors p-2">
            <FaSearch />
          </button>
          <button className="text-[#2d3748] hover:text-[#1a4d46] transition-colors p-2">
            <FaGlobe />
          </button>
          <span className="bg-[#e0f0ed] text-[#1a4d46] px-4 py-1 rounded-full text-xs font-semibold uppercase">
            EN
          </span>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg border-2 border-[#1a4d46] hover:bg-[#e0f0ed] transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes className="text-[#1a4d46] text-xl" />
          ) : (
            <FaBars className="text-[#1a4d46] text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu - No Login/Register */}
      <div className={`lg:hidden fixed inset-x-0 top-[60px] md:top-[68px] bg-white transition-all duration-300 ${
        isMenuOpen ? 'max-h-[calc(100vh-60px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      } overflow-y-auto border-t border-[#e0f0ed]`}>
        <div className="p-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-[#e0f0ed] text-[#1a4d46]'
                  : 'hover:bg-[#e0f0ed]/50 text-[#2d3748]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile User Actions - No Login/Register */}
          <div className="pt-3 mt-3 border-t border-[#e0f0ed] space-y-2">
            {user ? (
              <>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1a4d46] truncate">
                    {user.name}
                    {isAdmin && <span className="ml-1 text-xs text-[#2d7d6b]">(Admin)</span>}
                  </span>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); document.body.style.overflow = 'auto'; }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-[#2d7d6b] hover:bg-[#e0f0ed]/50 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              // Mobile: Only show user icon link to login
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[#2d3748] hover:bg-[#e0f0ed]/50 transition-colors"
              >
                <FaUser /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;