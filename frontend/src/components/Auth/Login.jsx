import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.success) navigate('/');
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
          <h2 className="text-3xl font-bold text-[#0a3d3a]">Welcome Back</h2>
          <p className="text-[#3a4a48] mt-2">Sign in to your Habib Solvex account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#0a3d3a]/10 focus:border-[#c49a2c] focus:outline-none bg-[#fcf9f2]"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Signing in...' : <>Sign In <FaArrowRight /></>}
          </button>
        </form>

        <p className="text-center text-sm text-[#3a4a48] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#c49a2c] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;