import React from 'react';
import heroVideo from '../../assets/videos/hero-video.mp4';

const HeroVideoSimple = () => {
  return (
    <div className="relative w-full bg-[#0a3d3a] flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[478px]">
      {/* Video Container - Full width, maintains aspect ratio without cutting */}
      <div className="relative w-full h-full max-h-[478px]">
        <video
          className="w-full h-full object-contain"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default HeroVideoSimple;