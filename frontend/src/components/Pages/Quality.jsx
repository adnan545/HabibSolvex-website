import React from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaFlask, FaVial, FaMicroscope, FaCheckDouble, FaLeaf } from 'react-icons/fa';
const Quality = () => {
  const certifications = [
    { icon: FaCertificate, title: 'ISO 22000:2018', desc: 'Food Safety Management System' },
    { icon: FaCertificate, title: 'FSSAI', desc: 'Food Safety and Standards Authority of India' },
    { icon: FaFlask, title: 'NABL Accredited Lab', desc: 'In-house testing for quality parameters' }
  ];

  const testingSteps = [
    { icon: FaVial, title: 'Raw Material Testing', desc: 'Testing for purity and contaminants before processing' },
    { icon: FaMicroscope, title: 'In-Process Testing', desc: 'Continuous monitoring during the refining process' },
    { icon: FaCheckDouble, title: 'Final Product Testing', desc: 'Full spectrum analysis before release to customers' }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-8 md:p-16 mt-4">
        <span className="badge"><i className="fas fa-check-circle"></i> Quality Assurance</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#0a3d3a] mt-3">
          Uncompromising <span className="text-[#c49a2c]">Quality</span>
        </h1>
        <p className="text-[#3a4a48] max-w-2xl mt-3">
          Every drop of oil is tested for purity, stability, and nutritional integrity. Our commitment to quality is backed by global certifications and a NABL-accredited lab.
        </p>
      </section>

      {/* Certifications */}
      <section className="my-12">
        <div className="text-center mb-8">
          <span className="badge">Certifications</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a] mt-2">
            Our <span className="text-[#c49a2c]">Accreditations</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-[#0a3d3a]/10 flex items-center gap-4"
            >
              <cert.icon className="text-4xl text-[#c49a2c] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#0a3d3a]">{cert.title}</h4>
                <p className="text-sm text-[#3a4a48]">{cert.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testing Process */}
      <section className="my-12">
        <div className="section-header">
          <span className="badge">Testing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a]">
            Our Testing <span className="text-[#c49a2c]">Process</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl text-center shadow-lg border border-[#0a3d3a]/10"
            >
              <div className="w-16 h-16 mx-auto bg-[#c49a2c]/20 rounded-full flex items-center justify-center text-[#c49a2c] text-3xl">
                <step.icon />
              </div>
              <h4 className="text-lg font-bold text-[#0a3d3a] mt-3">{step.title}</h4>
              <p className="text-sm text-[#3a4a48]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="my-12">
        <div className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a3d3a] text-center">
            Our <span className="text-[#c49a2c]">Commitment</span> to Quality
          </h2>
          <p className="text-[#3a4a48] text-center max-w-2xl mx-auto mt-3">
            Every batch undergoes rigorous testing for purity, stability, and nutritional integrity. 
            We are committed to delivering the highest quality edible oils to our customers worldwide.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <span className="badge"><FaLeaf className="inline mr-1" /> 100% Pure</span>
            <span className="badge"><FaLeaf className="inline mr-1" /> Zero Trans Fat</span>
            <span className="badge"><FaLeaf className="inline mr-1" /> Lab Tested</span>
            <span className="badge"><FaLeaf className="inline mr-1" /> Traceable Sourcing</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quality;