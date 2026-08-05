import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaGlobe, FaTimes, FaBars } from 'react-icons/fa';
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

  // Close mobile menu on route change
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
    { name: 'Manufacturing', path: '/manufacturing' },
    { name: 'Quality', path: '/quality' },
    { name: 'Industries', path: '/industries' },
    { name: 'Export', path: '/export' },
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
      isScrolled ? 'bg-[#fcf9f2]/95 backdrop-blur-md shadow-md py-3' : 'bg-[#fcf9f2] py-3 md:py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-bold text-[#0a3d3a] flex-shrink-0"
          onClick={scrollToTop}
        >
          <span className="inline-block w-2.5 h-3.5 md:w-3 md:h-4 bg-[#c49a2c] rounded-full mr-1 transform -rotate-15"></span>
          Habib<span className="text-[#c49a2c]">Solvex</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-8">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={scrollToTop}
                className={`relative text-sm font-medium transition-colors hover:text-[#0a3d3a] ${
                  location.pathname === link.path ? 'text-[#0a3d3a]' : 'text-[#1e2b2a]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#c49a2c]"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          {user && isAdmin && (
            <Link 
              to="/admin" 
              onClick={scrollToTop}
              className="text-sm text-[#c49a2c] font-medium hover:text-[#a67c1e] transition-colors px-3 py-1.5 rounded-full border border-[#c49a2c] hover:bg-[#c49a2c]/10"
            >
              Dashboard
            </Link>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#0a3d3a] font-medium truncate max-w-[100px]">
                {user.name}
                {isAdmin && <span className="ml-1 text-xs text-[#c49a2c]">(Admin)</span>}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-[#0a3d3a] hover:text-[#c49a2c] transition-colors px-3 py-1.5 rounded-full border border-[#0a3d3a]/20 hover:border-[#c49a2c]"
              >
                Logout
              </button>
            </div>
          )}
          <button className="text-[#1e2b2a] hover:text-[#c49a2c] transition-colors p-2">
            <FaSearch />
          </button>
          <button className="text-[#1e2b2a] hover:text-[#c49a2c] transition-colors p-2">
            <FaGlobe />
          </button>
          <span className="bg-[#e8d5a3] text-[#0a3d3a] px-4 py-1 rounded-full text-xs font-semibold uppercase">
            EN
          </span>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg border-2 border-[#0a3d3a] hover:bg-[#e8d5a3]/20 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes className="text-[#0a3d3a] text-xl" />
          ) : (
            <FaBars className="text-[#0a3d3a] text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <div className={`lg:hidden fixed inset-x-0 top-[60px] md:top-[68px] bg-[#fcf9f2] transition-all duration-300 ${
        isMenuOpen ? 'max-h-[calc(100vh-60px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      } overflow-y-auto border-t border-[#0a3d3a]/10`}>
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
                  ? 'bg-[#e8d5a3] text-[#0a3d3a]'
                  : 'hover:bg-[#e8d5a3]/50 text-[#1e2b2a]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Admin & User Actions */}
          <div className="pt-3 mt-3 border-t border-[#0a3d3a]/10 space-y-2">
            {user && isAdmin && (
              <Link
                to="/admin"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                  document.body.style.overflow = 'auto';
                }}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-[#c49a2c] hover:bg-[#e8d5a3]/50 transition-colors"
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-[#0a3d3a] truncate">
                  {user.name}
                  {isAdmin && <span className="ml-1 text-xs text-[#c49a2c]">(Admin)</span>}
                </span>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); document.body.style.overflow = 'auto'; }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;