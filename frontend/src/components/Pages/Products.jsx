import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaIndustry, FaShip, FaTruck, FaHotel, FaStore, FaCogs, 
  FaArrowRight 
} from 'react-icons/fa';

// Import actual product images from assets
import sunflowerImg from '../../assets/images/products/sunflower-oil.jpg';
import soybeanImg from '../../assets/images/products/soybean-oil.jpg';
import palmImg from '../../assets/images/products/palm-oil.jpg';
import ricebranImg from '../../assets/images/products/ricebran-oil.jpg';
import groundnutImg from '../../assets/images/products/groundnut-oil.jpg';
import industrialImg from '../../assets/images/products/industrial-oil.jpg';

const Products = () => {
  const [activeTab, setActiveTab] = useState('oils');

  const products = [
    { 
      id: 'sunflower', 
      name: 'Sunflower Oil', 
      desc: 'Heart-healthy, rich in Vitamin E', 
      image: sunflowerImg,
      badge: 'Best Seller',
      features: ['High smoke point', 'Zero trans fat', 'Rich in Vitamin E']
    },
    { 
      id: 'soybean', 
      name: 'Soybean Oil', 
      desc: 'Rich in Omega-3, versatile cooking', 
      image: soybeanImg,
      badge: 'Popular',
      features: ['Omega-3 rich', 'Versatile', 'Economical']
    },
    { 
      id: 'palm', 
      name: 'Palm Oil', 
      desc: 'Stable, high-heat cooking oil', 
      image: palmImg,
      badge: 'Industrial',
      features: ['High stability', 'Long shelf life', 'Commercial grade']
    },
    { 
      id: 'ricebran', 
      name: 'Rice Bran Oil', 
      desc: 'Heart-healthy, ORYZA-rich', 
      image: ricebranImg,
      badge: 'Premium',
      features: ['Heart healthy', 'High ORYZA', 'Antioxidant-rich']
    },
    { 
      id: 'groundnut', 
      name: 'Groundnut Oil', 
      desc: 'Premium aromatic, cold-pressed', 
      image: groundnutImg,
      badge: 'Traditional',
      features: ['Rich flavor', 'Cold-pressed', 'Traditional']
    },
    { 
      id: 'industrial', 
      name: 'Industrial Oils', 
      desc: 'Custom blends, bulk supply', 
      image: industrialImg,
      badge: 'B2B',
      features: ['Custom blends', 'Bulk supply', 'Industrial grade']
    },
  ];

  const industries = [
    { icon: FaHotel, name: 'Hotels & Restaurants', desc: 'Premium cooking oils for fine dining' },
    { icon: FaStore, name: 'Retail', desc: 'Consumer-packaged oils for supermarkets' },
    { icon: FaIndustry, name: 'Food Manufacturing', desc: 'Bulk oils for processed food production' },
    { icon: FaShip, name: 'Export', desc: 'Global supply to 40+ countries' },
    { icon: FaTruck, name: 'Wholesale', desc: 'Distributor partnerships' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      {/* Compact Hero */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-[#e0f0ed]">
        <div>
          <span className="text-sm font-semibold text-[#2d7d6b] uppercase tracking-wider">Our Range</span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a4d46]">Premium <span className="text-[#2d7d6b]">Edible Oils</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline text-sm px-4 py-2">Download Catalog</button>
        </div>
      </div>

      {/* Quick description */}
      <p className="text-[#5a6b7a] text-sm mt-2 max-w-2xl">
        Every oil is refined to the highest standards, ensuring purity, nutrition, and consistent quality.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f0f3f2] rounded-xl p-1 mt-4 max-w-xs">
        <button
          onClick={() => setActiveTab('oils')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'oils'
              ? 'bg-white text-[#1a4d46] shadow-sm'
              : 'text-[#5a6b7a] hover:text-[#1a4d46]'
          }`}
        >
          Our Oils
        </button>
        <button
          onClick={() => setActiveTab('industries')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'industries'
              ? 'bg-white text-[#1a4d46] shadow-sm'
              : 'text-[#5a6b7a] hover:text-[#1a4d46]'
          }`}
        >
          Industries
        </button>
      </div>

      {/* Oils Grid - With Actual Images */}
      {activeTab === 'oils' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#e0f0ed]/50 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-3 right-3 text-[10px] font-semibold text-white bg-[#2d7d6b] px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#1a4d46]">{product.name}</h3>
                <p className="text-[#5a6b7a] text-sm">{product.desc}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="text-[10px] text-[#5a6b7a] bg-[#f0f3f2] px-2 py-0.5 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                <Link 
                  to={`/products/${product.id}`} 
                  className="inline-flex items-center gap-1 text-[#2d7d6b] text-sm font-medium mt-3 hover:underline"
                >
                  View Details <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Industries Grid */}
      {activeTab === 'industries' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-all border border-[#e0f0ed]/50"
            >
              <div className="w-12 h-12 rounded-full bg-[#e0f0ed] flex items-center justify-center mb-3">
                <industry.icon className="text-xl text-[#2d7d6b]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a4d46]">{industry.name}</h3>
              <p className="text-[#5a6b7a] text-sm">{industry.desc}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;