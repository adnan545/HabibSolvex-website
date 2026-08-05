import React, { useState } from 'react';
import { FaIndustry, FaBuilding, FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'General Inquiry'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/contact/submit', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          inquiryType: 'General Inquiry'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* ===== CONTACT HERO - SHOW DETAILS AT FIRST LOOK ===== */}
      <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-6 md:p-10 lg:p-14 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text Content */}
          <div>
            <span className="badge"><i className="fas fa-comment-dots"></i> Get in Touch</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a3d3a] mt-3">
              Contact <span className="text-[#c49a2c]">Habib Solvex</span>
            </h1>
            <p className="text-[#3a4a48] text-sm md:text-base mt-2 max-w-lg">
              Sales inquiries, distribution partnerships, export queries — we're here to help.
            </p>
            
            {/* Quick Contact Info - Visible Immediately */}
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="tel:+919731314007" className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm">
                <FaPhone className="text-[#c49a2c]" /> +91 9731314007
              </a>
              <a href="mailto:habibsolvex@gmail.com" className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm">
                <FaEnvelope className="text-[#c49a2c]" /> habibsolvex@gmail.com
              </a>
              <a href="https://wa.me/919731314007" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366]/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm">
                <FaWhatsapp className="text-[#25D366]" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Right Side - Quick Location/Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center shadow-sm">
              <FaIndustry className="text-2xl text-[#c49a2c] mx-auto" />
              <p className="text-xs text-[#3a4a48] mt-1">Manufacturing</p>
              <p className="text-sm font-semibold text-[#0a3d3a]">Hiriyur</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center shadow-sm">
              <FaBuilding className="text-2xl text-[#c49a2c] mx-auto" />
              <p className="text-xs text-[#3a4a48] mt-1">Head Office</p>
              <p className="text-sm font-semibold text-[#0a3d3a]">Bangalore</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center shadow-sm col-span-2">
              <FaMapMarkerAlt className="text-2xl text-[#c49a2c] mx-auto" />
              {/* Google Map - Full Width */}
      <div className="w-full rounded-xl overflow-hidden shadow-md">
              <div className="relative w-full" style={{ paddingBottom: '40%' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.123456789!2d76.634567!3d13.945678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb152d123456789%3A0x123456789abcdef!2sNH4%20Service%20Road%2C%20Hiriyur%2C%20Karnataka%20577599!5e0!3m2!1sen!2sin!4v1700000000000"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Habib Solvex - Hiriyur Manufacturing Unit"
                ></iframe>
              </div>
            </div>
              <p className="text-xs text-[#3a4a48] mt-1">Main Manufacturing Unit</p>
              <p className="text-sm font-semibold text-[#0a3d3a]">NH4 Service Road, Hiriyur, Karnataka 577599</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Banner */}
      {/* <div className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-2xl p-4 md:p-6 my-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#0a3d3a]">Habib Solvex Pvt. Ltd.</h3>
          <p className="text-[#3a4a48] text-sm">N-44, Nilam Interlink Village, Hyderabad-500 004, India</p>
          <p className="text-[#3a4a48] text-xs md:text-sm">
            <FaEnvelope className="inline text-[#c49a2c] mr-1" /> habibsolvex@gmail.com &nbsp;|&nbsp;
            <span className="text-[#c49a2c]">www.habibsolvex.com</span>
          </p>
        </div>
        <span className="badge"><FaPhone className="inline mr-1" /> +91 9731314007</span>
      </div> */}

      

      {/* Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
        {/* Contact Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#0a3d3a]/10">
          <h2 className="text-2xl font-bold text-[#0a3d3a]">Contact Information</h2>
          <p className="text-[#3a4a48] mb-6">Reach out through any of these channels</p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start border-b border-[#0a3d3a]/10 pb-4">
              <div className="w-12 h-12 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-lg flex-shrink-0">
                <FaIndustry />
              </div>
              <div>
                <h4 className="font-semibold text-[#0a3d3a]">Main Manufacturing Unit</h4>
                <p className="text-[#3a4a48] text-sm">NH4 Service Road, Hiriyur, Karnataka 577599</p>
              </div>
            </div>

            <div className="flex gap-4 items-start border-b border-[#0a3d3a]/10 pb-4">
              <div className="w-12 h-12 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-lg flex-shrink-0">
                <FaBuilding />
              </div>
              <div>
                <h4 className="font-semibold text-[#0a3d3a]">Bangalore Head Office</h4>
                <p className="text-[#3a4a48] text-sm">36, 1, Kenchappa Rd, Frazer Town, Bengaluru, Karnataka 560005</p>
              </div>
            </div>

            <div className="flex gap-4 items-start border-b border-[#0a3d3a]/10 pb-4">
              <div className="w-12 h-12 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-lg flex-shrink-0">
                <FaPhone />
              </div>
              <div>
                <h4 className="font-semibold text-[#0a3d3a]">Phone</h4>
                <a href="tel:+919731314007" className="text-[#0a3d3a] font-medium hover:text-[#c49a2c]">+91 9731314007</a>
                <p className="text-[#3a4a48] text-xs">Mon-Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-[#c49a2c]/20 rounded-xl flex items-center justify-center text-[#c49a2c] text-lg flex-shrink-0">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-semibold text-[#0a3d3a]">Email</h4>
                <a href="mailto:habibsolvex@gmail.com" className="text-[#0a3d3a] hover:text-[#c49a2c]">habibsolvex@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <a href="https://wa.me/919731314007" target="_blank" rel="noopener noreferrer" 
               className="bg-[#25D366] text-white py-3 rounded-full text-center font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
              <FaWhatsapp /> WhatsApp
            </a>
            <a href="tel:+919731314007" 
               className="bg-[#0a3d3a] text-white py-3 rounded-full text-center font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
              <FaPhone /> Call Us
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#0a3d3a]/10">
          <h2 className="text-2xl font-bold text-[#0a3d3a]">Send a Message</h2>
          <p className="text-[#3a4a48] mb-6">Fill in the form and we'll get back to you within 24 hours.</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-sm text-[#0a3d3a] mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                       placeholder="John Doe" required />
              </div>
              <div>
                <label className="block font-semibold text-sm text-[#0a3d3a] mb-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                       placeholder="john@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-semibold text-sm text-[#0a3d3a] mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                       placeholder="+91 98765 43210" required />
              </div>
              <div>
                <label className="block font-semibold text-sm text-[#0a3d3a] mb-1">Company Name</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange}
                       className="w-full px-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                       placeholder="Your Company" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-sm text-[#0a3d3a] mb-1">Subject <span className="text-red-500">*</span></label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                     className="w-full px-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                     placeholder="What is this regarding?" required />
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-sm text-[#0a3d3a] mb-1">Inquiry Type</label>
              <select name="inquiryType" value={formData.inquiryType} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]">
                <option value="General Inquiry">General Inquiry</option>
                <option value="Sales Inquiry">Sales Inquiry</option>
                <option value="Export Inquiry">Export Inquiry</option>
                <option value="Distributor Program">Distributor Program</option>
                <option value="Bulk Order">Bulk Order</option>
                <option value="Become Dealer">Become Dealer</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-sm text-[#0a3d3a] mb-1">Message <span className="text-red-500">*</span></label>
              <textarea name="message" value={formData.message} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2] h-32 resize-y"
                        placeholder="Tell us about your requirements..." required></textarea>
            </div>

            <button type="submit" disabled={loading}
                    className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? 'Sending...' : <><i className="fas fa-paper-plane"></i> Send Message</>}
            </button>
          </form>
        </div>
      </div>


      
    </div>
  );
};

export default Contact;