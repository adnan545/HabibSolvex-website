import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';


// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Products from './components/Pages/Products';
import ProductDetail from './components/Pages/ProductDetail';
import ManufacturingQuality from './components/Pages/ManufacturingQuality';
import Events from './components/Pages/Events';
import Contact from './components/Pages/Contact';
import CompanyProfileManager from './components/Pages/Admin/CompanyProfileManager';
import ManageProducts from './components/Pages/Admin/ManageProducts';



// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Admin
import Dashboard from './components/Pages/Admin/Dashboard';
import UploadEvent from './components/Pages/Admin/UploadEvent';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/manufacturing-quality" element={<ManufacturingQuality />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/upload" element={<UploadEvent />} />
            <Route path="/admin/company-profile" element={<CompanyProfileManager />} />
            <Route path="/admin/products" element={<ManageProducts />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;