import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaUpload, FaTrash, FaEdit, FaEye, FaFilePdf, 
  FaCheck, FaTimes, FaDownload, FaExternalLinkAlt 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const CompanyProfileManager = () => {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: 'Company Profile',
    description: 'Download our complete company profile to learn more about our journey, achievements, and yearly performance.',
    year: new Date().getFullYear()
  });
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
    }
  }, [isAdmin]);

  const fetchProfiles = async () => {
    try {
      const response = await api.get('/company-profile/admin');
      if (response.data.success) {
        setProfiles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid PDF file');
      e.target.value = null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('pdf', selectedFile);
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('year', formData.year);

    try {
      const response = await api.post('/company-profile/upload', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success('Company profile uploaded successfully!');
        setShowUploadForm(false);
        setSelectedFile(null);
        setFormData({
          title: 'Company Profile',
          description: 'Download our complete company profile to learn more about our journey, achievements, and yearly performance.',
          year: new Date().getFullYear()
        });
        fetchProfiles();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    
    try {
      await api.delete(`/company-profile/${id}`);
      toast.success('Profile deleted successfully');
      fetchProfiles();
    } catch (error) {
      toast.error('Failed to delete profile');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await api.put(`/company-profile/${id}`, { isPublished: !currentStatus });
      toast.success(`Profile ${!currentStatus ? 'published' : 'unpublished'}`);
      fetchProfiles();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // ===== VIEW PDF IN BROWSER =====
  const handleViewPDF = async (id) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const pdfUrl = `${baseUrl}/company-profile/${id}/pdf`;
      
      // Open in new tab (browser will show PDF viewer)
      window.open(pdfUrl, '_blank');
    } catch (error) {
      toast.error('Failed to view PDF');
    }
  };

  // ===== DOWNLOAD PDF =====
  const handleDownloadPDF = async (id, fileName) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const pdfUrl = `${baseUrl}/company-profile/${id}/pdf`;
      
      // Fetch the PDF as blob
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'company-profile.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleUpdateTitle = async (id, currentTitle) => {
    const newTitle = prompt('Enter new title:', currentTitle);
    if (newTitle && newTitle !== currentTitle) {
      try {
        await api.put(`/company-profile/${id}`, { title: newTitle });
        toast.success('Title updated successfully');
        fetchProfiles();
      } catch (error) {
        toast.error('Failed to update title');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-[#1a4d46]">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#e0f0ed] p-6 mt-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#1a4d46]">📄 Company Profile Manager</h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn-primary flex items-center gap-2 text-sm md:text-base px-4 py-2.5"
        >
          <FaUpload /> Upload New Profile
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-[#f8f6f2] rounded-xl p-6 mb-6 border border-[#e0f0ed]">
          <h3 className="text-lg font-semibold text-[#1a4d46] mb-4">Upload New Company Profile (PDF)</h3>
          <p className="text-sm text-[#5a6b7a] mb-4">📌 PDF will be stored directly in MongoDB as Base64</p>
          <form onSubmit={handleUpload}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a4d46] mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a4d46] mb-1">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none bg-white"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1a4d46] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none bg-white h-20 resize-y"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1a4d46] mb-1">PDF File (Max 10MB)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#e0f0ed] focus:border-[#2d7d6b] focus:outline-none bg-white"
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-[#2d7d6b] mt-1">✅ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary px-6 py-2 disabled:opacity-70"
              >
                {uploading ? 'Uploading...' : 'Upload Profile'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFile(null);
                }}
                className="btn-outline px-6 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profiles List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a4d46] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Title</th>
              <th className="px-4 py-3 text-left text-sm">Year</th>
              <th className="px-4 py-3 text-left text-sm">Size</th>
              <th className="px-4 py-3 text-left text-sm">Views</th>
              <th className="px-4 py-3 text-left text-sm">Status</th>
              <th className="px-4 py-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-[#5a6b7a]">
                  No company profiles uploaded yet.
                </td>
              </tr>
            ) : (
              profiles.map((profile) => (
                <tr key={profile._id} className="border-b border-[#e0f0ed] hover:bg-[#f8f6f2]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaFilePdf className="text-red-500" />
                      <span className="font-medium text-[#1a4d46]">{profile.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{profile.year}</td>
                  <td className="px-4 py-3 text-sm">
                    {(profile.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-4 py-3 text-sm">{profile.downloadCount || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      profile.isPublished 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {profile.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleTogglePublish(profile._id, profile.isPublished)}
                        className={`p-1.5 rounded transition-colors ${
                          profile.isPublished 
                            ? 'text-green-600 hover:text-green-800' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title={profile.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {profile.isPublished ? <FaCheck /> : <FaTimes />}
                      </button>
                      <button
                        onClick={() => handleUpdateTitle(profile._id, profile.title)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50"
                        title="Edit Title"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleViewPDF(profile._id)}
                        className="text-[#2d7d6b] hover:text-[#1a4d46] p-1.5 rounded hover:bg-[#e0f0ed]"
                        title="View PDF"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(profile._id, profile.fileName)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50"
                        title="Download PDF"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleDelete(profile._id)}
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
      
      <div className="mt-4 text-xs text-[#5a6b7a] bg-[#f8f6f2] p-3 rounded-lg">
        <p>📌 PDFs are stored directly in MongoDB as Base64. Click <FaEye className="inline text-[#2d7d6b]" /> to view in browser or <FaDownload className="inline text-blue-500" /> to download.</p>
      </div>
    </div>
  );
};

export default CompanyProfileManager;