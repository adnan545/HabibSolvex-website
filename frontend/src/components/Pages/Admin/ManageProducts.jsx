import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, 
  FaUpload, FaEye, FaArrowLeft, FaArrowRight, FaSeedling,
  FaOilCan, FaCheck, FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const ManageProducts = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const productCategories = [
    { id: 'sunflower', label: 'Sunflower Oil', icon: FaSeedling },
    { id: 'soybean', label: 'Soybean Oil', icon: FaSeedling },
    { id: 'palm', label: 'Palm Oil', icon: FaSeedling },
    { id: 'ricebran', label: 'Rice Bran Oil', icon: FaSeedling },
    { id: 'groundnut', label: 'Groundnut Oil', icon: FaSeedling },
    { id: 'industrial', label: 'Industrial Oils', icon: FaOilCan }
  ];

  const badges = ['Best Seller', 'Popular', 'Industrial', 'Premium', 'Traditional', 'B2B', ''];

  // Default product template
  const defaultProduct = {
    id: '',
    name: '',
    tagline: '',
    description: '',
    category: 'sunflower',
    image: '',
    gallery: [],
    specs: [{ label: '', value: '' }],
    applications: '',
    benefits: [''],
    packaging: [''],
    nutritionalInfo: {},
    badge: '',
    isActive: true,
    order: 0
  };

  const [formData, setFormData] = useState(defaultProduct);
  const [selectedImages, setSelectedImages] = useState({ image: null, gallery: [] });

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/admin/all');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      ...defaultProduct,
      id: `product-${Date.now()}`,
      specs: [{ label: '', value: '' }],
      benefits: [''],
      packaging: ['']
    });
    setSelectedImages({ image: null, gallery: [] });
    setImagePreview(null);
    setGalleryPreviews([]);
    setIsEditing(true);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      specs: product.specs?.length ? product.specs : [{ label: '', value: '' }],
      benefits: product.benefits?.length ? product.benefits : [''],
      packaging: product.packaging?.length ? product.packaging : ['']
    });
    setEditingProduct(product);
    setIsEditing(true);
    setImagePreview(product.image);
    setGalleryPreviews(product.gallery || []);
    setSelectedImages({ image: null, gallery: [] });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setFormData(defaultProduct);
    setImagePreview(null);
    setGalleryPreviews([]);
    setSelectedImages({ image: null, gallery: [] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleAddArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleRemoveArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const handleAddSpec = () => {
    setFormData(prev => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }));
  };

  const handleRemoveSpec = (index) => {
    const newSpecs = formData.specs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const handleNutritionalChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: { ...prev.nutritionalInfo, [key]: value }
    }));
  };

  const handleAddNutritional = () => {
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: { ...prev.nutritionalInfo, '': '' }
    }));
  };

  const handleRemoveNutritional = (key) => {
    const newInfo = { ...formData.nutritionalInfo };
    delete newInfo[key];
    setFormData(prev => ({ ...prev, nutritionalInfo: newInfo }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImages(prev => ({ ...prev, [type]: file }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'image') {
          setImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }));
    
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formDataObj = new FormData();
    formDataObj.append('productData', JSON.stringify(formData));

    if (selectedImages.image) {
      formDataObj.append('image', selectedImages.image);
    }

    if (selectedImages.gallery.length > 0) {
      selectedImages.gallery.forEach(file => {
        formDataObj.append('gallery', file);
      });
    }

    try {
      const response = await api.post('/products/admin/update', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsEditing(false);
        setEditingProduct(null);
        fetchProducts();
        setFormData(defaultProduct);
        setImagePreview(null);
        setGalleryPreviews([]);
        setSelectedImages({ image: null, gallery: [] });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await api.delete(`/products/admin/${id}`);
      if (response.data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-2xl text-[#1a4d46]">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1a4d46]">📦 Manage Products</h1>
          <p className="text-[#5a6b7a]">Add, edit, or remove products and their images</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add New Product
          </button>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-2xl shadow-lg border border-[#e0f0ed] p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1a4d46]">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-[#5a6b7a] hover:text-red-500 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {/* Product ID */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Product ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none bg-[#f8f6f2]"
                    required
                    disabled={!!editingProduct}
                  />
                </div>

                {/* Name */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                    required
                  />
                </div>

                {/* Tagline */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                    placeholder="e.g., Heart-Healthy · Rich in Vitamin E"
                  />
                </div>

                {/* Category */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                    required
                  >
                    {productCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Badge */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Badge</label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  >
                    {badges.map(badge => (
                      <option key={badge} value={badge}>{badge || 'None'}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none h-24 resize-y"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Main Image */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Main Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#e0f0ed] bg-[#f8f6f2] flex items-center justify-center">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaImage className="text-4xl text-[#5a6b7a]" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'image')}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="btn-outline cursor-pointer inline-block px-4 py-2 text-sm"
                      >
                        Choose Image
                      </label>
                      <p className="text-xs text-[#5a6b7a] mt-1">PNG, JPG, WebP (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Gallery Images (Detail Page)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none bg-white"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#e0f0ed]">
                        <img src={preview} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order */}
                <div className="form-group mb-4">
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  />
                </div>

                {/* Active Status */}
                <div className="form-group mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-[#2d7d6b]"
                    />
                    <span className="font-semibold text-sm text-[#1a4d46]">Active (visible on website)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-6 border-t border-[#e0f0ed] pt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-[#1a4d46]">Specifications</h3>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-sm text-[#2d7d6b] hover:underline flex items-center gap-1"
                >
                  <FaPlus /> Add Spec
                </button>
              </div>
              {formData.specs.map((spec, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                    placeholder="Label (e.g., Oleic Acid)"
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g., ≥75%)"
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  />
                  {formData.specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="mt-6 border-t border-[#e0f0ed] pt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-[#1a4d46]">Benefits</h3>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('benefits')}
                  className="text-sm text-[#2d7d6b] hover:underline flex items-center gap-1"
                >
                  <FaPlus /> Add Benefit
                </button>
              </div>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    placeholder="Benefit (e.g., Heart-healthy with zero trans fat)"
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('benefits', index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Packaging */}
            <div className="mt-6 border-t border-[#e0f0ed] pt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-[#1a4d46]">Packaging Options</h3>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('packaging')}
                  className="text-sm text-[#2d7d6b] hover:underline flex items-center gap-1"
                >
                  <FaPlus /> Add Packaging
                </button>
              </div>
              {formData.packaging.map((pkg, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    value={pkg}
                    onChange={(e) => handleArrayChange('packaging', index, e.target.value)}
                    placeholder="e.g., 1L PET"
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  />
                  {formData.packaging.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('packaging', index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Applications */}
            <div className="mt-6 border-t border-[#e0f0ed] pt-6">
              <div className="form-group mb-4">
                <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Applications</label>
                <textarea
                  name="applications"
                  value={formData.applications}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none h-20 resize-y"
                  placeholder="e.g., Frying, baking, salad dressings..."
                />
              </div>
            </div>

            {/* Nutritional Info */}
            <div className="mt-6 border-t border-[#e0f0ed] pt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-[#1a4d46]">Nutritional Information</h3>
                <button
                  type="button"
                  onClick={handleAddNutritional}
                  className="text-sm text-[#2d7d6b] hover:underline flex items-center gap-1"
                >
                  <FaPlus /> Add Nutrition
                </button>
              </div>
              {Object.entries(formData.nutritionalInfo).map(([key, value]) => (
                <div key={key} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newInfo = { ...formData.nutritionalInfo };
                      const oldKey = key;
                      const newKey = e.target.value;
                      if (newKey !== oldKey) {
                        newInfo[newKey] = value;
                        delete newInfo[oldKey];
                        setFormData(prev => ({ ...prev, nutritionalInfo: newInfo }));
                      }
                    }}
                    placeholder="e.g., servingSize"
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleNutritionalChange(key, e.target.value)}
                    placeholder="e.g., 100ml"
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNutritional(key)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-[#e0f0ed]">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {saving ? 'Saving...' : 'Save Product'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-outline px-8 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {!isEditing && (
        <div className="bg-white rounded-2xl shadow-lg border border-[#e0f0ed] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a4d46] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Image</th>
                  <th className="px-4 py-3 text-left text-sm">Name</th>
                  <th className="px-4 py-3 text-left text-sm">Category</th>
                  <th className="px-4 py-3 text-left text-sm">Badge</th>
                  <th className="px-4 py-3 text-left text-sm">Status</th>
                  <th className="px-4 py-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-[#5a6b7a]">
                      No products found. Click "Add New Product" to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-[#e0f0ed] hover:bg-[#f8f6f2]">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#e0f0ed] bg-[#f8f6f2]">
                          {product.image ? (
                            <img 
                              src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = ''; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#5a6b7a]">
                              <FaImage />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1a4d46]">{product.name}</div>
                        <div className="text-xs text-[#5a6b7a]">{product.id}</div>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{product.category}</td>
                      <td className="px-4 py-3">
                        {product.badge && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#e0f0ed] text-[#1a4d46]">
                            {product.badge}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-500 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <a
                            href={`/products/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2d7d6b] hover:text-[#1a4d46] p-1.5 rounded hover:bg-[#e0f0ed]"
                            title="View on site"
                          >
                            <FaEye />
                          </a>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;