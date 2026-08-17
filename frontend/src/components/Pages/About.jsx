import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEye, FaBullseye, FaHandshake, FaIndustry, FaMapMarkerAlt, FaWarehouse,
  FaFilePdf, FaCalendarAlt, FaDownload
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const About = () => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const timeline = [
    { year: '2014', title: 'Founded', desc: 'Started operations in Hiriyur, Karnataka' },
    { year: '2016', title: 'First Export', desc: 'Expanded to international markets' },
    { year: '2020', title: 'ISO 22000', desc: 'Achieved food safety certification' },
    { year: '2024', title: 'New Facility', desc: 'State-of-the-art manufacturing plant' }
  ];

  const leaders = [
    { initials: 'MK', name: 'Mehmood Khan', role: 'Director' },
    { initials: 'NK', name: 'Nasir Khan', role: 'Director' },
    { initials: 'MK', name: 'Mudassir Khan', role: 'Director' }
  ];

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await api.get('/company-profile');
      if (response.data.success) {
        setCompanyProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // ===== VIEW PDF IN BROWSER - FIXED URL =====
  const handleViewPDF = async () => {
    if (!companyProfile) return;
    
    try {
      // Increment download count
      await api.post(`/company-profile/${companyProfile._id}/download`);
      
      // Fix: Use the full URL with /api prefix
      // Get the base URL from api config or environment
      const baseUrl = api.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Construct the full URL - baseUrl already includes /api
      const pdfUrl = `${baseUrl}/company-profile/${companyProfile._id}/view`;
      
      console.log('📄 Opening PDF URL:', pdfUrl); // Debug: check the URL
      
      // Open in new tab
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('View PDF error:', error);
      toast.error('Failed to open PDF');
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* ===== HERO SECTION - CLEAN DESIGN ===== */}
      <section className="bg-gradient-to-br from-[#f0f3f2] to-[#e4eae8] rounded-[32px] p-8 md:p-16 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Side - Content */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1a4d46]">
              About <span className="text-[#2d7d6b]">Habib Solvex</span>
            </h1>
            
            <p className="text-[#5a6b7a] mt-3 leading-relaxed">
              Habib Solvex is committed to delivering reliable, high-quality solutions with a strong focus on innovation, 
              integrity, and customer satisfaction. We believe in building lasting relationships by providing dependable 
              services tailored to the unique needs of every client.
            </p>

            {/* ===== COMPANY PROFILE - COMPACT PILL STYLE ===== */}
            {!loadingProfile && companyProfile ? (
              <div className="mt-4 inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-[#e0f0ed] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-[#1a4d46] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                  <FaFilePdf />
                </div>
                <span className="text-sm font-semibold text-[#1a4d46]">
                  {companyProfile.title}
                </span>
                <span className="text-xs text-[#5a6b7a] flex items-center gap-1">
                  <FaCalendarAlt className="text-[10px]" />
                  {companyProfile.year || new Date().getFullYear()}
                </span>
                <button
                  onClick={handleViewPDF}
                  className="text-[#2d7d6b] hover:text-[#1a4d46] text-sm font-medium flex items-center gap-1.5 transition-colors ml-1"
                >
                  <FaDownload className="text-xs" /> View PDF
                </button>
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-[#e0f0ed]">
                <div className="w-8 h-8 bg-[#e0f0ed] rounded-full flex items-center justify-center text-[#5a6b7a] text-xs">
                  <FaFilePdf />
                </div>
                <span className="text-sm text-[#5a6b7a]">No profile uploaded</span>
              </div>
            )}
          </div>
          
          {/* Right Side - Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop&auto=format" 
              alt="Habib Solvex Manufacturing"
              className="w-full rounded-2xl shadow-xl object-cover h-64 lg:h-72"
            />
            <div className="absolute -bottom-4 -right-4 bg-[#1a4d46] text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[#2d7d6b] rounded-full animate-pulse"></span>
              Manufacturing Excellence
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPANY BANNER ===== */}
      <div className="bg-gradient-to-br from-[#f0f3f2] to-[#e4eae8] rounded-2xl p-6 md:p-8 my-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#1a4d46]">Habib Solvex Pvt. Ltd.</h3>
          <p className="text-[#5a6b7a]">N-44, Nilam Interlink Village, Hyderabad-500 004, India</p>
          <p className="text-[#5a6b7a] text-sm">
            ✉️ habibsolvex@gmail.com &nbsp;|&nbsp; 🌐 www.habibsolvex.com
          </p>
        </div>
        <span className="badge"><i className="fas fa-calendar"></i> Since 2014</span>
      </div>

      {/* ===== COMPANY DESCRIPTION ===== */}
      <div className="my-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a4d46] mb-3">Our Journey</h2>
        <p className="text-[#5a6b7a] leading-relaxed">
          Habib Solvex is a premier edible oil manufacturing company dedicated to delivering pure, healthy, and high-quality 
          oils to customers worldwide. With a strong focus on innovation and sustainability, we have established ourselves 
          as a trusted name in the industry. Our state-of-the-art manufacturing facility in Hiriyur, Karnataka, produces 
          over 500 metric tons of premium edible oils daily, serving clients across 40+ countries.
        </p>
        <p className="text-[#5a6b7a] leading-relaxed mt-3">
          We are committed to maintaining the highest standards of quality and food safety, backed by ISO 22000 and FSSAI 
          certifications. Our journey, which began in 2014, is driven by a passion for excellence and a dedication to 
          nourishing lives with pure, natural edible oils.
        </p>
      </div>

      {/* ===== VISION & MISSION ===== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#e0f0ed]"
        >
          <div className="w-14 h-14 bg-[#e0f0ed] rounded-xl flex items-center justify-center text-[#2d7d6b] text-2xl mb-4">
            <FaEye />
          </div>
          <h3 className="text-xl font-bold text-[#1a4d46] mb-2">Our Vision</h3>
          <p className="text-[#5a6b7a]">To be the most trusted edible oil brand globally, known for purity, innovation, and sustainable practices.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#e0f0ed]"
        >
          <div className="w-14 h-14 bg-[#e0f0ed] rounded-xl flex items-center justify-center text-[#2d7d6b] text-2xl mb-4">
            <FaBullseye />
          </div>
          <h3 className="text-xl font-bold text-[#1a4d46] mb-2">Our Mission</h3>
          <p className="text-[#5a6b7a]">Deliver food-safe oils through responsible sourcing, advanced refining, and customer-centric service.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#e0f0ed]"
        >
          <div className="w-14 h-14 bg-[#e0f0ed] rounded-xl flex items-center justify-center text-[#2d7d6b] text-2xl mb-4">
            <FaHandshake />
          </div>
          <h3 className="text-xl font-bold text-[#1a4d46] mb-2">Our Values</h3>
          <p className="text-[#5a6b7a]">Integrity, Quality, Innovation, Sustainability, and Customer First.</p>
        </motion.div>
      </section>

      {/* ===== LEADERSHIP ===== */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Leadership</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a4d46]">
            Our <span className="text-[#2d7d6b]">Team</span>
          </h2>
          <p className="text-[#5a6b7a]">Experienced leaders driving excellence in the edible oil industry.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#e0f0ed]"
            >
              <div className="w-20 h-20 mx-auto bg-[#e0f0ed] rounded-full flex items-center justify-center text-2xl font-bold text-[#1a4d46]">
                {leader.initials}
              </div>
              <h4 className="text-lg font-bold text-[#1a4d46] mt-3">{leader.name}</h4>
              <p className="text-[#5a6b7a] text-sm">{leader.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Journey</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a4d46]">
            Company <span className="text-[#2d7d6b]">Timeline</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border-l-4 border-[#2d7d6b] shadow-md"
            >
              <h3 className="text-2xl font-bold text-[#2d7d6b]">{item.year}</h3>
              <p className="font-semibold text-[#1a4d46]">{item.title}</p>
              <p className="text-sm text-[#5a6b7a]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== INFRASTRUCTURE ===== */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Infrastructure</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a4d46]">
            Our <span className="text-[#2d7d6b]">Facilities</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#e0f0ed]">
            <div className="w-16 h-16 mx-auto bg-[#e0f0ed] rounded-full flex items-center justify-center text-[#2d7d6b] text-3xl">
              <FaIndustry />
            </div>
            <h4 className="text-lg font-bold text-[#1a4d46] mt-3">Production Capacity</h4>
            <p className="text-2xl font-bold text-[#2d7d6b]">500+ MT/day</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#e0f0ed]">
            <div className="w-16 h-16 mx-auto bg-[#e0f0ed] rounded-full flex items-center justify-center text-[#2d7d6b] text-3xl">
              <FaMapMarkerAlt />
            </div>
            <h4 className="text-lg font-bold text-[#1a4d46] mt-3">Locations</h4>
            <p className="text-xl font-bold text-[#2d7d6b]">2 Facilities</p>
            <p className="text-sm text-[#5a6b7a]">Hiriyur · Bangalore</p>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#e0f0ed]">
            <div className="w-16 h-16 mx-auto bg-[#e0f0ed] rounded-full flex items-center justify-center text-[#2d7d6b] text-3xl">
              <FaWarehouse />
            </div>
            <h4 className="text-lg font-bold text-[#1a4d46] mt-3">Warehousing</h4>
            <p className="text-xl font-bold text-[#2d7d6b]">50,000+ sq.ft</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;