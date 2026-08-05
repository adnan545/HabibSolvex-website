import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sunflowerImg from '../../assets/images/products/sunflower-oil.jpg';
import soybeanImg from '../../assets/images/products/soybean-oil.jpg';
import palmImg from '../../assets/images/products/palm-oil.jpg';
import groundnutImg from '../../assets/images/products/groundnut-oil.jpg';

const OilFoodShowcase = () => {
  const [activeOil, setActiveOil] = useState('sunflower');
  const [hoveredFood, setHoveredFood] = useState(null);

  const oils = {
    sunflower: {
      name: 'Sunflower Oil',
      description: 'Heart-healthy, rich in Vitamin E. Perfect for frying, baking, and dressings.',
      image: sunflowerImg,
      foods: [
        { name: 'Crispy Fries', icon: '🍟', description: 'Golden, crispy fries made with pure sunflower oil.', bg: 'bg-yellow-50' },
        { name: 'Baked Goods', icon: '🥖', description: 'Light, fluffy cakes and pastries.', bg: 'bg-amber-50' },
        { name: 'Salad Dressing', icon: '🥗', description: 'Healthy vinaigrettes and dressings.', bg: 'bg-green-50' }
      ]
    },
    soybean: {
      name: 'Soybean Oil',
      description: 'Rich in Omega-3 fatty acids. Ideal for sautéing, stir-frying, and cooking.',
      image: soybeanImg,
      foods: [
        { name: 'Stir Fry', icon: '🍜', description: 'Quick, healthy stir-fried vegetables.', bg: 'bg-red-50' },
        { name: 'Tofu Dishes', icon: '🥢', description: 'Crispy tofu with rich flavor.', bg: 'bg-orange-50' },
        { name: 'Marinades', icon: '🥩', description: 'Flavorful marinades for meats.', bg: 'bg-rose-50' }
      ]
    },
    palm: {
      name: 'Palm Oil',
      description: 'Stable, high-heat cooking oil. Perfect for deep-frying and commercial cooking.',
      image: palmImg,
      foods: [
        { name: 'Dosa', icon: '🥞', description: 'Crispy South Indian dosas.', bg: 'bg-yellow-50' },
        { name: 'Samosa', icon: '🥟', description: 'Golden, flaky samosas.', bg: 'bg-amber-50' },
        { name: 'Biryani', icon: '🍛', description: 'Aromatic, rich biryani.', bg: 'bg-orange-50' }
      ]
    },
    groundnut: {
      name: 'Groundnut Oil',
      description: 'Premium aromatic oil with a nutty flavor. Great for traditional cooking.',
      image: groundnutImg,
      foods: [
        { name: 'Puran Poli', icon: '🍰', description: 'Sweet, nutty Maharashtrian delicacy.', bg: 'bg-pink-50' },
        { name: 'Traditional Curries', icon: '🍲', description: 'Rich, flavorful curries.', bg: 'bg-red-50' },
        { name: 'Pickles', icon: '🥒', description: 'Authentic, long-lasting pickles.', bg: 'bg-green-50' }
      ]
    }
  };

  const currentOil = oils[activeOil];

  return (
    <section className="section py-8 md:py-16 bg-gradient-to-b from-[#f5efe4] to-[#e8dfce]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-6 md:mb-10">
          <span className="badge text-xs md:text-sm">Oil & Food Pairing</span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#0a3d3a] mt-2">
            When Oil Changes, <br />
            <span className="text-[#c49a2c]">Food Changes</span>
          </h2>
          <p className="text-[#3a4a48] text-sm md:text-lg max-w-2xl mx-auto mt-2">
            Discover how different oils transform your cooking experience.
            Select an oil to see the perfect food pairings.
          </p>
        </div>

        {/* Oil Selection Tabs - Scrollable on mobile */}
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-2 md:gap-3 mb-6 md:mb-10 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 justify-start md:justify-center">
          {Object.keys(oils).map((key) => (
            <button
              key={key}
              onClick={() => setActiveOil(key)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeOil === key
                  ? 'bg-[#0a3d3a] text-white shadow-lg scale-105'
                  : 'bg-white text-[#0a3d3a] hover:bg-[#e8d5a3] hover:scale-105'
              }`}
            >
              {oils[key].name}
            </button>
          ))}
        </div>

        {/* Showcase Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 items-start">
          {/* Oil Info - Left */}
          <motion.div
            key={`oil-${activeOil}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-[#0a3d3a]/10"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <img 
                src={currentOil.image} 
                alt={currentOil.name}
                className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover border-4 border-[#c49a2c] flex-shrink-0"
              />
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-[#0a3d3a]">{currentOil.name}</h3>
                <p className="text-xs md:text-sm text-[#3a4a48]">{currentOil.description}</p>
              </div>
            </div>

            <div className="mt-3 md:mt-4 bg-[#fcf9f2] rounded-xl p-3 md:p-4 border border-[#0a3d3a]/5">
              <p className="text-xs text-[#3a4a48] font-medium">💡 Try it with:</p>
              <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                {currentOil.foods.map((food, idx) => (
                  <span key={idx} className="bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs shadow-sm border border-[#0a3d3a]/10">
                    {food.icon} {food.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Food Cards - Right Side */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <AnimatePresence mode="wait">
                {currentOil.foods.map((food, index) => (
                  <motion.div
                    key={`${activeOil}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredFood(index)}
                    onMouseLeave={() => setHoveredFood(null)}
                    className={`${food.bg} rounded-xl p-4 md:p-6 text-center transition-all duration-300 ${
                      hoveredFood === index ? 'shadow-2xl scale-105 -translate-y-2' : 'shadow-md'
                    } border border-[#0a3d3a]/5 cursor-pointer`}
                  >
                    <div className="text-3xl md:text-5xl mb-2 md:mb-3">{food.icon}</div>
                    <h4 className="font-bold text-[#0a3d3a] text-sm md:text-lg">{food.name}</h4>
                    <p className={`text-[10px] md:text-xs text-[#3a4a48] mt-1 transition-opacity duration-300 ${
                      hoveredFood === index ? 'opacity-100' : 'opacity-70'
                    }`}>
                      {food.description}
                    </p>
                    <div className={`mt-2 md:mt-3 text-[#c49a2c] text-[10px] md:text-sm font-semibold transition-opacity duration-300 ${
                      hoveredFood === index ? 'opacity-100' : 'opacity-0'
                    }`}>
                      ← Cook with {currentOil.name}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OilFoodShowcase;