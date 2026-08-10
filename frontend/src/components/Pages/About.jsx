import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaBullseye, FaHandshake, FaIndustry, FaMapMarkerAlt, FaWarehouse } from 'react-icons/fa';

const About = () => {
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

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f0f3f2] to-[#e4eae8] rounded-[32px] p-8 md:p-16 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          {/* <span className="badge"><i className="fas fa-info-circle"></i> About Us</span> */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#1a4d46] mt-3">
            About <span className="text-[#2d7d6b]">Habib Solvex</span>
          </h1>
          <p className="text-[#5a6b7a] mt-3">
            Habib Solvex is committed to delivering reliable, high-quality solutions with a strong focus on innovation, 
            integrity, and customer satisfaction. We believe in building lasting relationships by providing dependable 
            services tailored to the unique needs of every client.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="badge">Since 2014</span>
            <span className="badge">ISO 22000</span>
            <span className="badge">FSSAI</span>
            <span className="badge">Export 40+ Countries</span>
          </div>
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
      </section>

      {/* Company Banner */}
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

      {/* Vision & Mission */}
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

      {/* Leadership */}
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

      {/* Timeline */}
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

      {/* Infrastructure */}
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