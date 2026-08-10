import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaEye, FaCheck, FaClock, FaArchive, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';

const Dashboard = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState(null);
  const [eventSaving, setEventSaving] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    published: 0,
    drafts: 0,
    totalContacts: 0,
    newContacts: 0,
    repliedContacts: 0
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
      toast.error('Admin access required');
      return;
    }
    if (isAdmin) {
      fetchEvents();
      fetchContacts();
    }
  }, [authLoading, isAdmin, navigate]);

  // ===== FETCH EVENTS =====
  const fetchEvents = async () => {
    try {
      console.log('📋 Fetching events...');
      let response;

      try {
        response = await api.get('/events/admin');
      } catch (adminError) {
        // Fallback for deployments where admin endpoint is broken or not available.
        try {
          response = await api.get('/events/all');
          toast.error('Primary admin endpoint unavailable. Using compatibility endpoint.');
          console.warn('⚠️ Fallback to /events/all due to /events/admin error:', adminError.response?.data || adminError.message);
        } catch (allError) {
          response = await api.get('/events');
          toast.error('Admin events endpoint unavailable. Showing published events only.');
          console.warn('⚠️ Fallback to /events due to admin endpoint errors:', allError.response?.data || allError.message);
        }
      }

      console.log('📥 Events response:', response.data);
      
      if (response.data.success) {
        setEvents(response.data.data || []);
        const published = (response.data.data || []).filter(e => e.isPublished).length;
        setStats(prev => ({
          ...prev,
          totalEvents: response.data.data?.length || 0,
          published: published,
          drafts: (response.data.data?.length || 0) - published
        }));
      } else {
        toast.error(response.data.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('❌ Failed to fetch events:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        toast.error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        toast.error('Cannot connect to server');
      } else {
        toast.error('Failed to fetch events');
      }
    }
  };

  // ===== FETCH CONTACTS =====
  const fetchContacts = async () => {
    try {
      console.log('📋 Fetching contacts...');
      const response = await api.get('/contact/submissions');
      console.log('📥 Contacts response:', response.data);
      
      if (response.data.success) {
        setContacts(response.data.data || []);
        const newContacts = (response.data.data || []).filter(c => c.status === 'New').length;
        const repliedContacts = (response.data.data || []).filter(c => c.status === 'Replied').length;
        setStats(prev => ({
          ...prev,
          totalContacts: response.data.data?.length || 0,
          newContacts: newContacts,
          repliedContacts: repliedContacts
        }));
      }
    } catch (error) {
      console.error('❌ Failed to fetch contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  // ===== DELETE EVENT =====
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      try {
        await api.delete(`/events/delete/${id}`);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (fallbackError) {
        toast.error(fallbackError.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  // ===== TOGGLE PUBLISH STATUS =====
  const handleTogglePublish = async (id) => {
    try {
      await api.patch(`/events/${id}/toggle`);
      toast.success('Status updated');
      fetchEvents();
    } catch (error) {
      try {
        await api.patch(`/events/toggle/${id}`);
        toast.success('Status updated');
        fetchEvents();
      } catch (fallbackError) {
        toast.error(fallbackError.response?.data?.message || 'Failed to update status');
      }
    }
  };

  // ===== UPDATE CONTACT STATUS =====
  const handleContactStatus = async (id, status) => {
    if (!id) {
      toast.error('Contact ID is missing');
      return;
    }
    
    try {
      await api.patch(`/contact/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchContacts();
    } catch (error) {
      try {
        // Backward-compatible fallback for older deployed API shapes.
        await api.patch(`/contact/status/${id}`, { status });
        toast.success(`Status updated to ${status}`);
        fetchContacts();
        return;
      } catch (fallbackError) {
        try {
          await api.put(`/contact/${id}/status`, { status });
          toast.success(`Status updated to ${status}`);
          fetchContacts();
          return;
        } catch (fallbackPutError) {
          console.error('Fallback status update error:', fallbackPutError.response?.data || fallbackPutError.message);
        }
      }

      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // ===== VIEW CONTACT DETAILS =====
  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  // ===== EDIT EVENT =====
  const openEventEditor = (event) => {
    setEventForm({
      _id: event._id,
      title: event.title || '',
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 10) : '',
      location: event.location || '',
      category: event.category || 'Event'
    });
    setShowEventModal(true);
  };

  const handleEventFormChange = (e) => {
    setEventForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    if (!eventForm?._id) {
      toast.error('Event ID is missing');
      return;
    }

    setEventSaving(true);
    try {
      const payload = {
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date || null,
        location: eventForm.location,
        category: eventForm.category
      };

      let response;

      try {
        response = await api.put(`/events/${eventForm._id}`, payload);
      } catch (putError) {
        response = await api.put(`/events/update/${eventForm._id}`, payload);
        console.warn('⚠️ Update fallback to /events/update/:id:', putError.response?.data || putError.message);
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update event');
      }

      toast.success('Event updated successfully');
      setShowEventModal(false);
      setEventForm(null);
      await fetchEvents();
    } catch (error) {
      console.error('❌ Event update error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update event');
    } finally {
      setEventSaving(false);
    }
  };

  // ===== GET STATUS BADGE COLOR =====
  const getStatusBadge = (status) => {
    const styles = {
      'New': 'bg-blue-100 text-blue-700',
      'Read': 'bg-gray-100 text-gray-700',
      'Replied': 'bg-green-100 text-green-700',
      'Archived': 'bg-yellow-100 text-yellow-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 text-center">
        <div className="text-2xl text-[#1a4d46]">Loading...</div>
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
          <h1 className="text-3xl font-bold text-[#1a4d46]">Admin Dashboard</h1>
          <p className="text-[#5a6b7a]">Manage events, content, and contact submissions</p>
        </div>
        <Link to="/admin/upload" className="btn-primary flex items-center gap-2">
          <FaPlus /> Upload New Event
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-[#e0f0ed]">
          <p className="text-sm text-[#5a6b7a]">Total Events</p>
          <p className="text-3xl font-bold text-[#1a4d46]">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-green-100">
          <p className="text-sm text-[#5a6b7a]">Published</p>
          <p className="text-3xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-blue-100">
          <p className="text-sm text-[#5a6b7a]">Contact Submissions</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalContacts}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-yellow-100">
          <p className="text-sm text-[#5a6b7a]">New Contacts</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.newContacts}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f0f3f2] rounded-xl p-1 mb-6 max-w-xs">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'events'
              ? 'bg-white text-[#1a4d46] shadow-sm'
              : 'text-[#5a6b7a] hover:text-[#1a4d46]'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'contacts'
              ? 'bg-white text-[#1a4d46] shadow-sm'
              : 'text-[#5a6b7a] hover:text-[#1a4d46]'
          }`}
        >
          Contacts <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">{stats.newContacts}</span>
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e0f0ed]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a4d46] text-white">
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
                    <td colSpan="5" className="px-6 py-8 text-center text-[#5a6b7a]">
                      No events found. Upload your first event!
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event._id} className="border-b border-[#e0f0ed]/50 hover:bg-[#f8f6f2]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#1a4d46]">{event.title}</div>
                        <div className="text-xs text-[#5a6b7a] truncate max-w-xs">{event.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge text-xs">{event.category || 'Event'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5a6b7a]">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
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
                            onClick={() => handleTogglePublish(event._id)}
                            className="text-[#1a4d46] hover:text-[#2d7d6b] transition-colors"
                            title="Toggle Publish"
                          >
                            {event.isPublished ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                          </button>
                          <button
                            onClick={() => openEventEditor(event)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
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
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e0f0ed]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a4d46] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-[#5a6b7a]">
                      No contact submissions yet.
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id} className="border-b border-[#e0f0ed]/50 hover:bg-[#f8f6f2]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#1a4d46]">{contact.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5a6b7a]">{contact.email}</td>
                      <td className="px-6 py-4 text-sm text-[#5a6b7a]">{contact.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewContactDetails(contact)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleContactStatus(contact._id, 'Read')}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="Mark as Read"
                          >
                            <FaClock />
                          </button>
                          <button
                            onClick={() => handleContactStatus(contact._id, 'Replied')}
                            className="text-green-500 hover:text-green-700 transition-colors"
                            title="Mark as Replied"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleContactStatus(contact._id, 'Archived')}
                            className="text-yellow-500 hover:text-yellow-700 transition-colors"
                            title="Archive"
                          >
                            <FaArchive />
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

      {/* Event Edit Modal */}
      {showEventModal && eventForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEventModal(false)}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#1a4d46]">Edit Event</h2>
              <button onClick={() => setShowEventModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <form onSubmit={handleEventUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={eventForm.title}
                  onChange={handleEventFormChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#1a4d46]/10 focus:border-[#2d7d6b] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Category</label>
                <select
                  name="category"
                  value={eventForm.category}
                  onChange={handleEventFormChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#1a4d46]/10 focus:border-[#2d7d6b] focus:outline-none"
                >
                  <option value="Event">Event</option>
                  <option value="Publication">Publication</option>
                  <option value="News">News</option>
                  <option value="Announcement">Announcement</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventFormChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#1a4d46]/10 focus:border-[#2d7d6b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventFormChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#1a4d46]/10 focus:border-[#2d7d6b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-sm text-[#1a4d46] mb-1">Description</label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleEventFormChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#1a4d46]/10 focus:border-[#2d7d6b] focus:outline-none h-32 resize-y"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={eventSaving} className="btn-primary px-6 py-2.5 disabled:opacity-70">
                  {eventSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setShowEventModal(false)} className="btn-outline px-6 py-2.5">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Details Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)}>
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#1a4d46]">Contact Details</h2>
              <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#5a6b7a]">Name</p>
                  <p className="font-semibold text-[#1a4d46]">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a6b7a]">Email</p>
                  <p className="font-semibold text-[#1a4d46]">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a6b7a]">Phone</p>
                  <p className="font-semibold text-[#1a4d46]">{selectedContact.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-[#5a6b7a]">Company</p>
                  <p className="font-semibold text-[#1a4d46]">{selectedContact.company || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#5a6b7a]">Subject</p>
                  <p className="font-semibold text-[#1a4d46]">{selectedContact.subject}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#5a6b7a]">Inquiry Type</p>
                  <p className="font-semibold text-[#1a4d46]">{selectedContact.inquiryType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#5a6b7a]">Message</p>
                  <div className="bg-[#f8f6f2] p-4 rounded-xl mt-1 whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#5a6b7a]">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusBadge(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#5a6b7a]">Submitted At</p>
                  <p className="font-semibold text-[#1a4d46]">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-[#e0f0ed]">
                <button
                  onClick={() => {
                    handleContactStatus(selectedContact._id, 'Replied');
                    setShowContactModal(false);
                  }}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => {
                    handleContactStatus(selectedContact._id, 'Archived');
                    setShowContactModal(false);
                  }}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Archive
                </button>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;