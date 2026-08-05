import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#0a3d3a]/10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0a3d3a]">Create Account</h2>
          <p className="text-[#3a4a48] mt-2">Join Habib Solvex family</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0a3d3a] mb-1">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a4a48]" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0a3d3a] mb-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a4a48]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0a3d3a] mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a4a48]" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0a3d3a] mb-1">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a4a48]" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Creating account...' : <>Create Account <FaArrowRight /></>}
          </button>
        </form>

        <p className="text-center text-sm text-[#3a4a48] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#c49a2c] font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <div className="mt-4 p-4 bg-[#e8d5a3]/20 rounded-xl border border-[#e8d5a3]">
          <p className="text-xs text-[#0a3d3a] text-center">
            🔑 <strong>Admin Access:</strong> After registration, an admin can promote your account 
            to 'admin' role in the database to give you admin privileges.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;