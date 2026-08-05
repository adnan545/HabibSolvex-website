import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSeedling, FaFilter, FaTint, FaSun, FaBox, FaFlask, 
  FaIndustry, FaRobot, FaWarehouse, FaPlayCircle, FaTimes,
  FaPause
} from 'react-icons/fa';

const Manufacturing = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const iframeRef = useRef(null);
  const sectionRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-play video when user scrolls to the section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videoLoaded) {
            setVideoLoaded(true);
            // Auto-play the video after a short delay
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
  }, [videoLoaded]);

  const steps = [
    { icon: FaSeedling, title: '1. Sourcing', desc: 'Premium sunflower, soybean, and palm sourced from trusted farms.' },
    { icon: FaFilter, title: '2. Degumming', desc: 'Removal of phospholipids and gums for clarity.' },
    { icon: FaTint, title: '3. Neutralization', desc: 'Free fatty acids removed using caustic soda.' },
    { icon: FaSun, title: '4. Bleaching & Deodorization', desc: 'Color removal and odor neutralization.' },
    { icon: FaBox, title: '5. Packaging', desc: 'Automated filling in food-grade containers.' },
    { icon: FaFlask, title: '6. Quality Checks', desc: 'Every batch tested in our NABL-accredited lab.' }
  ];

  const droneVideoUrl = 'https://www.youtube.com/embed/cJ9NvaajUNM?autoplay=1&rel=0&modestbranding=1&playsinline=1';

  // Toggle video play/pause
  const toggleVideo = () => {
    if (showVideo) {
      setShowVideo(false);
      setIsPlaying(false);
      // Reset video loaded state so it can auto-play again
      setVideoLoaded(false);
    } else {
      setShowVideo(true);
      setIsPlaying(true);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-8 md:p-16 mt-4">
        <span className="badge"><i className="fas fa-industry"></i> Manufacturing</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#0a3d3a] mt-3">
          From Seed to <span className="text-[#c49a2c]">Bottle</span>
        </h1>
        <p className="text-[#3a4a48] max-w-2xl mt-3">
          Our state-of-the-art facility combines automation, precision, and food-safe processes to produce 500+ MT of premium edible oils every day.
        </p>
      </section>

      {/* Video Section with Intersection Observer */}
      <section ref={sectionRef} className="my-12">
        <div className="text-center mb-8">
          <span className="badge"><i className="fas fa-video"></i> Drone Tour</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a] mt-2">
            Explore Our <span className="text-[#c49a2c]">Facility</span>
          </h2>
          <p className="text-[#3a4a48] max-w-xl mx-auto mt-2">
            Watch a stunning aerial view of our state-of-the-art manufacturing facility.
          </p>
        </div>

        <div className="relative bg-[#0a3d3a] rounded-2xl overflow-hidden shadow-2xl">
          {!showVideo ? (
            <div 
              className="relative cursor-pointer group"
              onClick={toggleVideo}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a3d3a]/80 to-[#1a5c57]/70 z-10"></div>
              <div className="w-full h-64 md:h-96 bg-[url('https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&h=600&fit=crop&auto=format')] bg-cover bg-center"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    transition: { repeat: Infinity, duration: 2 }
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 bg-[#c49a2c] rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-[#c49a2c]/50 transition-shadow duration-300"
                >
                  <FaPlayCircle className="text-4xl md:text-5xl text-white ml-1" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-4">Watch Our Facility from Above</h3>
                <p className="text-white/70 text-sm md:text-base">Click the play button to view drone footage</p>
                <span className="badge bg-[#e8d5a3] text-[#0a3d3a] mt-3 inline-block animate-pulse">
                  <i className="fas fa-play mr-1"></i> Watch Now
                </span>
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              {/* Video Controls Overlay */}
              <div className="absolute top-4 right-4 z-30 flex gap-2">
                <button
                  onClick={() => {
                    setShowVideo(false);
                    setIsPlaying(false);
                    setVideoLoaded(false);
                  }}
                  className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                  aria-label="Close video"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* Video Container */}
              <div className="w-full h-64 md:h-[500px] relative">
                <iframe
                  ref={iframeRef}
                  src={droneVideoUrl}
                  className="w-full h-full"
                  title="Drone Tour - Oil Manufacturing Facility"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Video Status Overlay */}
                <div className="absolute bottom-4 left-4 z-30 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Playing</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#3a4a48]">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${showVideo ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span>{showVideo ? 'Video is playing' : 'Click play to watch the drone tour'}</span>
          </div>
          <div className="flex gap-2 md:gap-4 flex-wrap">
            <span className="badge bg-[#0a3d3a] text-white text-[10px] md:text-xs">Drone Footage</span>
            <span className="badge bg-[#0a3d3a] text-white text-[10px] md:text-xs">4K Quality</span>
            <span className="badge bg-[#0a3d3a] text-white text-[10px] md:text-xs">Aerial View</span>
            {showVideo && (
              <span className="badge bg-[#c49a2c] text-white text-[10px] md:text-xs animate-pulse">
                <i className="fas fa-circle text-[6px] mr-1 inline-block"></i> LIVE
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="my-12">
        <div className="section-header">
          <span className="badge">Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Refining <span className="text-[#c49a2c]">Process</span>
          </h2>
          <p className="text-[#3a4a48]">Our multi-step refining process ensures the highest quality and purity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto bg-[#0a3d3a] rounded-xl flex items-center justify-center text-white text-2xl mb-3">
                <step.icon />
              </div>
              <h4 className="font-bold text-[#0a3d3a]">{step.title}</h4>
              <p className="text-sm text-[#3a4a48]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10 hover:shadow-xl transition-all">
            <div className="w-16 h-16 mx-auto bg-[#c49a2c]/20 rounded-full flex items-center justify-center text-[#c49a2c] text-3xl">
              <FaIndustry />
            </div>
            <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">Production Capacity</h4>
            <p className="text-3xl font-bold text-[#c49a2c]">500+ MT/day</p>
            <p className="text-sm text-[#3a4a48]">Continuous production capability</p>
          </div>
          <div className="bg-white p-8 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10 hover:shadow-xl transition-all">
            <div className="w-16 h-16 mx-auto bg-[#c49a2c]/20 rounded-full flex items-center justify-center text-[#c49a2c] text-3xl">
              <FaRobot />
            </div>
            <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">Automation</h4>
            <p className="text-2xl font-bold text-[#c49a2c]">Fully Automated</p>
            <p className="text-sm text-[#3a4a48]">Filling & packaging lines</p>
          </div>
          <div className="bg-white p-8 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10 hover:shadow-xl transition-all">
            <div className="w-16 h-16 mx-auto bg-[#c49a2c]/20 rounded-full flex items-center justify-center text-[#c49a2c] text-3xl">
              <FaWarehouse />
            </div>
            <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">Storage Capacity</h4>
            <p className="text-2xl font-bold text-[#c49a2c]">50,000+ sq.ft</p>
            <p className="text-sm text-[#3a4a48]">Temperature-controlled warehousing</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Manufacturing;