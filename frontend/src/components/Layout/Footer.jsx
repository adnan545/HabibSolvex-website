import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a3d3a] text-white/80  mt-8 md:mt-10 py-10">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-6 md:mb-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link to="/" className="text-xl md:text-2xl font-bold text-white" onClick={scrollToTop}>
              <span className="inline-block w-2.5 h-3.5 md:w-3 md:h-4 bg-[#c49a2c] rounded-full mr-1 transform -rotate-15"></span>
              Habib<span className="text-[#e8d5a3]">Solvex</span>
            </Link>
            <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/60">Pure edible oils since 2014</p>
            <div className="flex justify-center sm:justify-start gap-3 mt-3 md:mt-4">
              <a href="#" onClick={(e) => e.preventDefault()} className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#c49a2c] transition-all duration-300">
                <FaLinkedinIn className="text-xs md:text-sm" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#c49a2c] transition-all duration-300">
                <FaYoutube className="text-xs md:text-sm" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#c49a2c] transition-all duration-300">
                <FaTwitter className="text-xs md:text-sm" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#c49a2c] transition-all duration-300">
                <FaInstagram className="text-xs md:text-sm" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Products</h4>
            <Link to="/products/sunflower" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Sunflower Oil</Link>
            <Link to="/products/soybean" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Soybean Oil</Link>
            <Link to="/products/palm" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Palm Oil</Link>
            <Link to="/products/groundnut" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Groundnut Oil</Link>
            <Link to="/products/industrial" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Industrial Oils</Link>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
            <Link to="/about" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>About Us</Link>
            <Link to="/manufacturing" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Manufacturing</Link>
            <Link to="/quality" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Quality</Link>
            <Link to="/events" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Events</Link>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Connect</h4>
            <Link to="/contact" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Get in Touch</Link>
            <Link to="/export" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1" onClick={scrollToTop}>Export</Link>
            <a href="mailto:habibsolvex@gmail.com" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1 break-all">habibsolvex@gmail.com</a>
            <a href="tel:+919731314007" className="block text-xs md:text-sm hover:text-[#e8d5a3] transition-colors py-1">+91 9731314007</a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-white/60 gap-2">
          <span>© 2026 Habib Solvex · All rights reserved</span>
          <div className="flex gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white/80 transition-colors">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white/80 transition-colors">Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white/80 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;