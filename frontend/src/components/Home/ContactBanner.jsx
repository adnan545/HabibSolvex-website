import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactBanner = () => {
  return (
    <section className="section bg-gradient-to-r from-[#0a3d3a] to-[#1a5c57]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Have any questions? <span className="text-[#c49a2c]">Contact us</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Our team is here to help with your inquiries, orders, and partnership opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-gold text-lg px-10 py-4">
              Get in Touch →
            </Link>
            <a href="tel:+919731314007" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2">
              <FaPhone /> +91 9731314007
            </a>
            <a href="mailto:habibsolvex@gmail.com" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2">
              <FaEnvelope /> Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactBanner;