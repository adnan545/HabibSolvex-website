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
import Manufacturing from './components/Pages/Manufacturing';
import Quality from './components/Pages/Quality';
import Industries from './components/Pages/Industries';
import Export from './components/Pages/Export';
import Contact from './components/Pages/Contact';
import Events from './components/Pages/Events';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Admin
import Dashboard from './components/Pages/Admin/Dashboard';
import UploadEvent from './components/Pages/Admin/UploadEvent';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
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
        <main className="pt-0"> {/* Changed from pt-16 to pt-0 */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/manufacturing" element={<Manufacturing />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/export" element={<Export />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/upload" element={<UploadEvent />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;