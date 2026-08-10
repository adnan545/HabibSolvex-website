import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const StatCounter = ({ target, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const step = target / (duration / 16);
          
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-4xl lg:text-5xl font-bold text-white"
      >
        {count}{suffix}
      </motion.div>
      <p className="text-white font-medium mt-1 text-xs md:text-sm">{label}</p>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { target: 120, label: 'Countries', suffix: '+' },
    { target: 2800, label: 'Happy Clients', suffix: '+' },
    { target: 50000, label: 'MT Capacity', suffix: '+' },
    { target: 10, label: 'Years of Trust', suffix: '+' }
  ];

  return (
    <section className="section py-10 md:py-16 bg-[#1a4d46] text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCounter key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;