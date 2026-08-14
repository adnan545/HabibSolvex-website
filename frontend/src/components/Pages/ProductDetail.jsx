import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaStar, FaDownload, FaFilePdf, FaTruck, FaShieldAlt, 
  FaUndo, FaPaperPlane, FaWhatsapp, FaPhone, FaEnvelope 
} from 'react-icons/fa';


// Import images for products
import sunflowerBenifitImg from '../../assets/images/products/sunflower_oil_benifits.jpg';
import sunflowerManufactureImg from '../../assets/images/products/sunflower_oil_manufacture.jpg';
import sunflowerWhyUsImg from '../../assets/images/products/sunflowerWhyUs.webp';

import soyabeanBenifitImg from '../../assets/images/products/soyabean_oil_benifits.jpg';
import soyabeanManufactureImg from '../../assets/images/products/soyabean_oil_manufacture.jpg';
import soyabeanWhyUsImg from '../../assets/images/products/soyabean_why_us.webp';


import palManufactureImg from '../../assets/images/products/palm_oil_manufacture.jpg';
import palmDetailsImg from '../../assets/images/products/palm_oil_details.jpg';
import palBenifitImg from '../../assets/images/products/palm_oil_benifits.webp';



const ProductDetail = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productData = {
    sunflower: {
      id: 'sunflower',
      name: 'Refined Sunflower Oil',
      tagline: 'Heart-Healthy · Rich in Vitamin E',
      description: 'Our refined sunflower oil is extracted from premium sunflower seeds and refined to perfection. Naturally rich in Vitamin E and low in saturated fats, it is the ideal choice for health-conscious consumers.',
      specs: [
        { label: 'Oleic Acid', value: '≥75%' },
        { label: 'Trans Fat', value: 'Zero' },
        { label: 'Cholesterol', value: 'Free' },
        { label: 'Vitamin E', value: 'Rich' },
        { label: 'Smoke Point', value: '232°C' },
        { label: 'Additives', value: 'Free from additives' }
      ],
      applications: 'Frying, baking, salad dressings, margarine, and general cooking.',
      benefits: [
        'Heart-healthy with zero trans fat',
        'Rich in Vitamin E for overall wellness',
        'High smoke point for versatile cooking',
        '100% pure with no additives'
      ],
      images: [
        sunflowerBenifitImg,
        sunflowerManufactureImg,
        sunflowerWhyUsImg
      ],
      nutritionalInfo: {
        servingSize: '100ml',
        calories: '884 kcal',
        totalFat: '100g',
        saturatedFat: '11g',
        monounsaturatedFat: '75g',
        polyunsaturatedFat: '14g',
        vitaminE: '40mg'
      }
    },
    soybean: {
      id: 'soybean',
      name: 'Refined Soybean Oil',
      tagline: 'Omega-3 Rich · Versatile Cooking',
      description: 'Premium soybean oil rich in Omega-3 fatty acids. Ideal for sautéing, stir-frying, and cooking. Its neutral flavor makes it perfect for all types of cuisine.',
      specs: [
        { label: 'Omega-3', value: 'Rich' },
        { label: 'Trans Fat', value: 'Zero' },
        { label: 'Smoke Point', value: '230°C' },
        { label: 'Flavor', value: 'Neutral' }
      ],
      applications: 'Sautéing, stir-frying, baking, and general cooking.',
      benefits: [
        'Rich in heart-healthy Omega-3',
        'Versatile for all cooking styles',
        'Economical and value-packed',
        'Neutral flavor for all cuisines'
      ],
      images: [
        soyabeanBenifitImg,
        soyabeanManufactureImg,
        soyabeanWhyUsImg
      ],
      nutritionalInfo: {
        servingSize: '100ml',
        calories: '884 kcal',
        totalFat: '100g',
        saturatedFat: '15g',
        monounsaturatedFat: '23g',
        polyunsaturatedFat: '62g',
        omega3: '7g'
      }
    },
    palm: {
      id: 'palm',
      name: 'RBD Palm Oil',
      tagline: 'Stable · High-Heat Cooking',
      description: 'Stable, high-heat cooking oil. Perfect for deep-frying and commercial cooking operations. RBD (Refined, Bleached, Deodorized) palm oil offers excellent stability.',
      specs: [
        { label: 'Stability', value: 'Excellent' },
        { label: 'Smoke Point', value: '235°C' },
        { label: 'Shelf Life', value: 'Long' },
        { label: 'Grade', value: 'Commercial' }
      ],
      applications: 'Deep-frying, commercial cooking, bakery, and confectionery.',
      benefits: [
        'High stability for deep-frying',
        'Cost-effective for commercial use',
        'Long shelf life for storage',
        'Versatile for various applications'
      ],
      images: [
        palmDetailsImg,
        palManufactureImg,
        palBenifitImg
      ],
      nutritionalInfo: {
        servingSize: '100ml',
        calories: '884 kcal',
        totalFat: '100g',
        saturatedFat: '49g',
        monounsaturatedFat: '37g',
        polyunsaturatedFat: '14g'
      }
    },
    ricebran: {
      id: 'ricebran',
      name: 'Rice Bran Oil',
      tagline: 'Heart-Healthy · ORYZA-Rich',
      description: 'Heart-healthy oil rich in ORYZA. Perfect for healthy cooking and salad dressings. Contains oryzanol, a powerful antioxidant that helps maintain healthy cholesterol levels.',
      specs: [
        { label: 'ORYZA', value: 'Rich' },
        { label: 'Smoke Point', value: '250°C' },
        { label: 'Antioxidants', value: 'High' },
        { label: 'Cholesterol', value: 'Free' }
      ],
      applications: 'Healthy cooking, salad dressings, and sautéing.',
      benefits: [
        'Rich in ORYZA for heart health',
        'High smoke point for all cooking',
        'Powerful antioxidants',
        'Excellent for healthy lifestyles'
      ],
      images: [
        sunflowerBenifitImg,
        sunflowerManufactureImg,
        sunflowerWhyUsImg
      ],
      nutritionalInfo: {
        servingSize: '100ml',
        calories: '884 kcal',
        totalFat: '100g',
        saturatedFat: '19g',
        monounsaturatedFat: '39g',
        polyunsaturatedFat: '42g',
        oryzanol: '30mg'
      }
    },
    groundnut: {
      id: 'groundnut',
      name: 'Groundnut Oil',
      tagline: 'Premium Aromatic · Cold-Pressed',
      description: 'Premium aromatic oil with a nutty flavor. Great for traditional cooking and deep-frying. Cold-pressed to retain natural aroma and nutrients.',
      specs: [
        { label: 'Flavor', value: 'Rich, Nutty' },
        { label: 'Processing', value: 'Cold-pressed' },
        { label: 'Smoke Point', value: '225°C' },
        { label: 'Traditional', value: 'Yes' }
      ],
      applications: 'Traditional cooking, deep-frying, and pickling.',
      benefits: [
        'Rich, authentic nutty flavor',
        'Cold-pressed for purity',
        'Traditional cooking oil',
        'Excellent for pickling'
      ],
      images: [
        sunflowerBenifitImg,
        sunflowerManufactureImg,
        sunflowerWhyUsImg
      ],
      nutritionalInfo: {
        servingSize: '100ml',
        calories: '884 kcal',
        totalFat: '100g',
        saturatedFat: '17g',
        monounsaturatedFat: '46g',
        polyunsaturatedFat: '37g'
      }
    },
    industrial: {
      id: 'industrial',
      name: 'Industrial Oils',
      tagline: 'Bulk · Specialty · Custom Blends',
      description: 'Specialty oils for industrial applications, biodiesel, and technical uses. Custom formulations available for specific requirements.',
      specs: [
        { label: 'Blends', value: 'Custom' },
        { label: 'Supply', value: 'Bulk' },
        { label: 'Grade', value: 'Industrial' },
        { label: 'Quality', value: 'Assured' }
      ],
      applications: 'Biodiesel, technical applications, and industrial manufacturing.',
      benefits: [
        'Custom blends available',
        'Bulk supply for industry',
        'Industrial-grade quality',
        'Technical specifications met'
      ],
      images: [
        sunflowerBenifitImg,
        sunflowerManufactureImg,
        sunflowerWhyUsImg
      ],
      nutritionalInfo: {
        servingSize: 'N/A',
        calories: 'Varies',
        totalFat: 'Varies',
        saturatedFat: 'Varies',
        monounsaturatedFat: 'Varies',
        polyunsaturatedFat: 'Varies'
      }
    }
  };

  const product = productData[id] || productData.sunflower;

  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 text-center">
        <h1 className="text-2xl text-[#0a3d3a]">Product not found</h1>
        <Link to="/products" className="btn-primary mt-4 inline-block" onClick={scrollToTop}>Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#3a4a48] mb-6 mt-4">
        <Link to="/" className="hover:text-[#c49a2c]" onClick={scrollToTop}>Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#c49a2c]" onClick={scrollToTop}>Products</Link>
        <span>/</span>
        <span className="text-[#0a3d3a] font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <img 
              src={product.images[activeImage]} 
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </motion.div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImage === index ? 'border-[#c49a2c]' : 'border-transparent'
                }`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="badge">Premium Quality</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a3d3a] mt-3">{product.name}</h1>
          <p className="text-[#c49a2c] text-lg font-medium">{product.tagline}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-[#c49a2c]">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <span className="text-sm text-[#3a4a48]">(128 reviews)</span>
          </div>

          <p className="text-[#3a4a48] mt-4">{product.description}</p>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-[#0a3d3a]/10 mt-6">
            {['details', 'nutrition'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 font-semibold text-sm transition-colors ${
                  activeTab === tab 
                    ? 'text-[#0a3d3a] border-b-2 border-[#c49a2c]' 
                    : 'text-[#3a4a48] hover:text-[#0a3d3a]'
                }`}
              >
                {tab === 'details' ? 'Specifications' : 'Nutritional Info'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'details' ? (
              <div>
                <ul className="space-y-2">
                  {product.specs.map((spec, index) => (
                    <li key={index} className="flex justify-between items-center border-b border-[#0a3d3a]/5 py-2">
                      <span className="text-[#3a4a48]">{spec.label}</span>
                      <span className="font-semibold text-[#0a3d3a]">{spec.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <h4 className="font-semibold text-[#0a3d3a]">Applications</h4>
                  <p className="text-sm text-[#3a4a48]">{product.applications}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-[#0a3d3a]">Benefits</h4>
                  <ul className="text-sm text-[#3a4a48] space-y-1 mt-1">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#c49a2c]">✓</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-[#0a3d3a] mb-2">Nutritional Information</h4>
                <div className="grid grid-cols-2 gap-2 bg-[#fcf9f2] p-4 rounded-xl">
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-[#0a3d3a]/5 py-1.5">
                      <span className="text-sm text-[#3a4a48] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-semibold text-[#0a3d3a]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Removed Datasheet, Packaging Options, Quantity, Trust Badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/contact" className="btn-primary flex items-center gap-2" onClick={scrollToTop}>
              <FaPaperPlane /> Get Quote
            </Link>
            <button className="btn-gold flex items-center gap-2">
              <FaFilePdf /> Catalog
            </button>
          </div>

          {/* Quick Contact */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#0a3d3a]/10">
            <a href="https://wa.me/919731314007" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 text-sm text-[#25D366] hover:underline">
              <FaWhatsapp /> WhatsApp
            </a>
            <a href="tel:+919731314007" className="flex items-center gap-2 text-sm text-[#0a3d3a] hover:underline">
              <FaPhone /> Call Now
            </a>
            <a href="mailto:habibsolvex@gmail.com" className="flex items-center gap-2 text-sm text-[#0a3d3a] hover:underline">
              <FaEnvelope /> Email
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-[#0a3d3a]">Related <span className="text-[#c49a2c]">Products</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {Object.keys(productData)
            .filter(key => key !== id)
            .slice(0, 3)
            .map((key) => {
              const p = productData[key];
              return (
                <Link 
                  key={key} 
                  to={`/products/${key}`} 
                  onClick={scrollToTop}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-[#0a3d3a]/10 text-center group"
                >
                  <img 
                    src={p.images[0]} 
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <h4 className="font-semibold text-[#0a3d3a] mt-3">{p.name}</h4>
                  <p className="text-xs text-[#3a4a48]">View Details →</p>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;