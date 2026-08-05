import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaEdit, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';

const Dashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    published: 0,
    drafts: 0
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
      toast.error('Admin access required');
      return;
    }
    if (isAdmin) {
      fetchEvents();
    }
  }, [authLoading, isAdmin, navigate]);

  const fetchEvents = async () => {
    try {
      // Try to fetch from API, fallback to mock data if fails
      let response;
      try {
        response = await api.get('/events/admin');
      } catch (error) {
        // If API fails, use mock data
        console.log('Using mock data for events');
        response = { data: { success: true, data: getMockEvents() } };
      }
      
      if (response.data.success) {
        setEvents(response.data.data);
        const published = response.data.data.filter(e => e.isPublished).length;
        setStats({
          totalEvents: response.data.data.length,
          published: published,
          drafts: response.data.data.length - published
        });
      }
    } catch (error) {
      toast.error('Failed to fetch events');
      // Use mock data as fallback
      const mockData = getMockEvents();
      setEvents(mockData);
      setStats({
        totalEvents: mockData.length,
        published: mockData.filter(e => e.isPublished).length,
        drafts: mockData.filter(e => !e.isPublished).length
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const getMockEvents = () => {
    return [
      {
        id: 1,
        title: 'Annual Oil Expo 2026',
        description: 'Habib Solvex showcased its premium range at the Annual Oil Expo.',
        date: '2026-03-15T10:00:00Z',
        category: 'Event',
        isPublished: true
      },
      {
        id: 2,
        title: 'New Packaging Launch',
        description: 'Introducing our new eco-friendly packaging for all edible oils.',
        date: '2026-02-20T14:00:00Z',
        category: 'Publication',
        isPublished: true
      },
      {
        id: 3,
        title: 'Export Achievement: 50 Countries',
        description: 'Habib Solvex celebrates exporting to 50+ countries worldwide.',
        date: '2026-01-10T09:00:00Z',
        category: 'News',
        isPublished: false
      }
    ];
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      // If API fails, just remove from local state
      setEvents(events.filter(e => e.id !== id));
      toast.success('Event deleted (mock)');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await api.patch(`/events/${id}/toggle`);
      toast.success('Status updated');
      fetchEvents();
    } catch (error) {
      // If API fails, toggle locally
      setEvents(events.map(e => 
        e.id === id ? { ...e, isPublished: !e.isPublished } : e
      ));
      toast.success('Status toggled (mock)');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 text-center">
        <div className="text-2xl text-[#0a3d3a]">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0a3d3a]">Admin Dashboard</h1>
          <p className="text-[#3a4a48]">Welcome back, {user?.name || 'Admin'}!</p>
        </div>
        <Link to="/admin/upload" className="btn-primary flex items-center gap-2">
          <FaPlus /> Upload New Event
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#0a3d3a]/10">
          <p className="text-sm text-[#3a4a48]">Total Events</p>
          <p className="text-3xl font-bold text-[#0a3d3a]">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
          <p className="text-sm text-[#3a4a48]">Published</p>
          <p className="text-3xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-yellow-100">
          <p className="text-sm text-[#3a4a48]">Drafts</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.drafts}</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#0a3d3a]/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a3d3a] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#3a4a48]">
                    No events found. Upload your first event!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-[#0a3d3a]/10 hover:bg-[#fcf9f2]">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0a3d3a]">{event.title}</div>
                      <div className="text-xs text-[#3a4a48] truncate max-w-xs">{event.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge text-xs">{event.category || 'Event'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3a4a48]">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {event.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleTogglePublish(event.id)}
                          className="text-[#0a3d3a] hover:text-[#c49a2c] transition-colors"
                          title="Toggle Publish"
                        >
                          {event.isPublished ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
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
    </div>
  );
};

export default Dashboard;