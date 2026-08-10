import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSeedling, FaFilter, FaTint, FaSun, FaBox, FaFlask, 
  FaIndustry, FaRobot, FaWarehouse, FaCertificate, FaCheckDouble,
  FaPlayCircle, FaTimes, FaPause
} from 'react-icons/fa';

const ManufacturingQuality = () => {
  const [activeTab, setActiveTab] = useState('process');
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  // Auto-play video when user scrolls to the section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !showVideo) {
            setTimeout(() => {
              setShowVideo(true);
              setIsPlaying(true);
            }, 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [showVideo]);

  const steps = [
    { icon: FaSeedling, title: '1. Sourcing', desc: 'Premium oils from trusted farms' },
    { icon: FaFilter, title: '2. Degumming', desc: 'Removal of phospholipids' },
    { icon: FaTint, title: '3. Neutralization', desc: 'Removal of free fatty acids' },
    { icon: FaSun, title: '4. Bleaching', desc: 'Color removal and purification' },
    { icon: FaBox, title: '5. Packaging', desc: 'Automated food-grade filling' },
    { icon: FaFlask, title: '6. Quality Checks', desc: 'NABL-accredited lab testing' },
  ];

  const certifications = [
    { icon: FaCertificate, title: 'ISO 22000:2018', desc: 'Food Safety Management System' },
    { icon: FaCertificate, title: 'FSSAI', desc: 'Food Safety Standards Authority' },
    { icon: FaCertificate, title: 'NABL Lab', desc: 'Accredited in-house testing' },
  ];

  const droneVideoUrl = 'https://www.youtube.com/embed/cJ9NvaajUNM?autoplay=1&rel=0&modestbranding=1&playsinline=1';

  const toggleVideo = () => {
    if (showVideo) {
      setShowVideo(false);
      setIsPlaying(false);
    } else {
      setShowVideo(true);
      setIsPlaying(true);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      {/* Compact Hero */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-4 pt-8 border-b border-[#e0f0ed]">
        <div>
          {/* <span className="text-sm font-semibold text-[#2d7d6b] uppercase tracking-wider">Manufacturing & Quality</span> */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a4d46]">From Seed to <span className="text-[#2d7d6b]">Bottle</span></h1>
        </div>
      </div>
      <p className="text-[#5a6b7a] text-sm mt-2 max-w-2xl">
        Our state-of-the-art facility combines automation, precision, and food-safe processes to produce 500+ MT of premium edible oils every day.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f0f3f2] rounded-xl p-1 mt-4 max-w-xs">
        <button
          onClick={() => setActiveTab('process')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'process'
              ? 'bg-white text-[#1a4d46] shadow-sm'
              : 'text-[#5a6b7a] hover:text-[#1a4d46]'
          }`}
        >
          Process
        </button>
        <button
          onClick={() => setActiveTab('quality')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'quality'
              ? 'bg-white text-[#1a4d46] shadow-sm'
              : 'text-[#5a6b7a] hover:text-[#1a4d46]'
          }`}
        >
          Quality
        </button>
      </div>

      {/* Process Tab */}
      {activeTab === 'process' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-5 rounded-xl text-center shadow-sm border border-[#e0f0ed]/50 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 mx-auto bg-[#e0f0ed] rounded-xl flex items-center justify-center text-[#2d7d6b] text-xl mb-3">
                  <step.icon />
                </div>
                <h4 className="font-bold text-[#1a4d46] text-sm">{step.title}</h4>
                <p className="text-xs text-[#5a6b7a]">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Capacity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-[#e0f0ed]/50">
              <div className="w-14 h-14 mx-auto bg-[#e0f0ed] rounded-full flex items-center justify-center text-[#2d7d6b] text-2xl">
                <FaIndustry />
              </div>
              <h4 className="font-bold text-[#1a4d46] mt-3">Production Capacity</h4>
              <p className="text-2xl font-bold text-[#2d7d6b]">500+ MT/day</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-[#e0f0ed]/50">
              <div className="w-14 h-14 mx-auto bg-[#e0f0ed] rounded-full flex items-center justify-center text-[#2d7d6b] text-2xl">
                <FaRobot />
              </div>
              <h4 className="font-bold text-[#1a4d46] mt-3">Automation</h4>
              <p className="text-xl font-bold text-[#2d7d6b]">Fully Automated</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-[#e0f0ed]/50">
              <div className="w-14 h-14 mx-auto bg-[#e0f0ed] rounded-full flex items-center justify-center text-[#2d7d6b] text-2xl">
                <FaWarehouse />
              </div>
              <h4 className="font-bold text-[#1a4d46] mt-3">Storage Capacity</h4>
              <p className="text-xl font-bold text-[#2d7d6b]">50,000+ sq.ft</p>
            </div>
          </div>
        </>
      )}

      {/* Quality Tab */}
      {activeTab === 'quality' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-5 rounded-xl shadow-sm border border-[#e0f0ed]/50 flex items-center gap-4"
              >
                <cert.icon className="text-3xl text-[#2d7d6b] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#1a4d46] text-sm">{cert.title}</h4>
                  <p className="text-xs text-[#5a6b7a]">{cert.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testing Process */}
          <div className="bg-gradient-to-br from-[#f0f3f2] to-[#e4eae8] rounded-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-[#1a4d46] text-center">Our Testing Process</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                <FaCheckDouble className="text-2xl text-[#2d7d6b] mx-auto mb-2" />
                <h4 className="font-bold text-[#1a4d46] text-sm">Raw Material Testing</h4>
                <p className="text-xs text-[#5a6b7a]">Testing for purity and contaminants</p>
              </div>
              <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                <FaCheckDouble className="text-2xl text-[#2d7d6b] mx-auto mb-2" />
                <h4 className="font-bold text-[#1a4d46] text-sm">In-Process Testing</h4>
                <p className="text-xs text-[#5a6b7a]">Continuous monitoring during refining</p>
              </div>
              <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                <FaCheckDouble className="text-2xl text-[#2d7d6b] mx-auto mb-2" />
                <h4 className="font-bold text-[#1a4d46] text-sm">Final Product Testing</h4>
                <p className="text-xs text-[#5a6b7a]">Full spectrum analysis before release</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== VIDEO SECTION - MOVED TO BOTTOM ===== */}
      <div ref={sectionRef} className="mt-10 pt-6 border-t border-[#e0f0ed]">
        <div className="flex items-center justify-between mb-3">
          <span className="badge"><i className="fas fa-video"></i> Drone Tour</span>
          <span className="text-xs text-[#5a6b7a]">Watch our facility from above</span>
        </div>

        <div className="relative bg-[#1a4d46] rounded-xl overflow-hidden shadow-lg">
          {!showVideo ? (
            <div 
              className="relative cursor-pointer group"
              onClick={toggleVideo}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d46]/80 to-[#2a7a6e]/70 z-10"></div>
              <div className="w-full h-64 md:h-80 lg:h-96 bg-[url('https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&h=600&fit=crop&auto=format')] bg-cover bg-center"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    transition: { repeat: Infinity, duration: 2 }
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 bg-[#2d7d6b] rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-[#2d7d6b]/50 transition-shadow duration-300"
                >
                  <FaPlayCircle className="text-4xl md:text-5xl text-white ml-1" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-4">Watch Our Facility from Above</h3>
                <p className="text-white/70 text-sm md:text-base">Click to view drone footage</p>
                <span className="badge bg-[#e0f0ed] text-[#1a4d46] mt-3 inline-block animate-pulse">
                  <i className="fas fa-play mr-1"></i> Watch Now
                </span>
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              <div className="absolute top-3 right-3 z-30 flex gap-2">
                <button
                  onClick={toggleVideo}
                  className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                  aria-label="Close video"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <div className="w-full h-64 md:h-80 lg:h-[500px] relative">
                <iframe
                  ref={videoRef}
                  src={droneVideoUrl}
                  className="w-full h-full"
                  title="Drone Tour - Oil Manufacturing Facility"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                <div className="absolute bottom-4 left-4 z-30 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Playing</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${showVideo ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className="text-xs text-[#5a6b7a]">{showVideo ? 'Video is playing' : 'Auto-plays when you scroll here'}</span>
          </div>
          <div className="flex gap-2">
            <span className="badge text-[10px]">Drone Footage</span>
            <span className="badge text-[10px]">4K Quality</span>
            <span className="badge text-[10px]">Aerial View</span>
            {showVideo && (
              <span className="badge text-[10px] bg-[#2d7d6b] text-white animate-pulse">
                <i className="fas fa-circle text-[6px] mr-1 inline-block"></i> LIVE
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingQuality;