import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';


import sunflowerImg from '../../assets/images/products/sunflower-oil.jpg';
import soybeanImg from '../../assets/images/products/soybean-oil.jpg';
import palmImg from '../../assets/images/products/palm-oil.jpg';
import ricebranImg from '../../assets/images/products/ricebran-oil.jpg';
import groundnutImg from '../../assets/images/products/groundnut-oil.jpg';
import industrialImg from '../../assets/images/products/industrial-oil.jpg';

const Products = () => {
  const products = [
    { 
      id: 'sunflower',
      name: 'Sunflower Oil', 
      desc: 'High oleic, refined, heart-healthy',
      image: sunflowerImg,
      features: ['Rich in Vitamin E', 'High smoke point', 'Zero trans fat'],
      badge: 'Best Seller'
    },
    { 
      id: 'soybean',
      name: 'Soybean Oil', 
      desc: 'Food grade, rich in omega-3',
      image: soybeanImg,
      features: ['Omega-3 rich', 'Versatile cooking', 'Economical'],
      badge: 'Popular'
    },
    { 
      id: 'palm',
      name: 'Palm Oil', 
      desc: 'RBD, stable for frying',
      image: palmImg,
      features: ['High stability', 'Long shelf life', 'Commercial grade'],
      badge: 'Industrial'
    },
    { 
      id: 'ricebran',
      name: 'Rice Bran Oil', 
      desc: 'Heart-healthy, oryzanol-rich',
      image: ricebranImg,
      features: ['Heart healthy', 'High ORYZA', 'Premium quality'],
      badge: 'Premium'
    },
    { 
      id: 'groundnut',
      name: 'Groundnut Oil', 
      desc: 'Premium aromatic, cold-pressed',
      image: groundnutImg,
      features: ['Rich flavor', 'Cold-pressed', 'Traditional'],
      badge: 'Traditional'
    },
    { 
      id: 'industrial',
      name: 'Industrial Oils', 
      desc: 'Bulk, specialty, custom blends',
      image: industrialImg,
      features: ['Custom blends', 'Bulk supply', 'Industrial grade'],
      badge: 'B2B'
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Hero */}
      {/* <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-8 md:p-16 mt-4">
        <span className="badge">Our Range</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#0a3d3a] mt-3">
          Premium <span className="text-[#c49a2c]">Edible Oils</span>
        </h1>
        <p className="text-[#3a4a48] max-w-2xl mt-3">
          Every oil is refined to the highest standards, ensuring purity, nutrition, and consistent quality 
          for food service, retail, and industrial applications.
        </p>
      </section> */}

      {/* Products Grid */}
      <section className="my-12">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[#0a3d3a]">Product Categories</h2>
          <button className="btn-gold flex items-center gap-2">
            <FaDownload /> Download Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-[#0a3d3a]/10"
            >
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#c49a2c] text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {product.badge}
                </span>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0a3d3a]">{product.name}</h3>
                <p className="text-[#3a4a48] text-sm">{product.desc}</p>
                <ul className="text-xs text-[#3a4a48] space-y-1 mt-3 mb-4">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#c49a2c]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to={`/products/${product.id}`} 
                  className="btn-primary w-full text-center text-sm py-2.5 block"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;