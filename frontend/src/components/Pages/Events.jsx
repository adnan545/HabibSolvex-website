import React, { useState, useEffect } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaFile, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../../api/axios';

import event1Img from '../../assets/images/events/event1.jpg';
import event2Img from '../../assets/images/events/event2.jpg';
import event3Img from '../../assets/images/events/event3.jpg';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([
        {
          id: 1,
          title: 'Annual Oil Expo 2026',
          description: 'Habib Solvex showcased its premium range at the Annual Oil Expo in Mumbai. The event was a huge success with over 500 visitors. Our team demonstrated the quality and purity of our edible oils to industry leaders and potential partners.',
          date: '2026-03-15T10:00:00Z',
          location: 'Mumbai, India',
          category: 'Event',
          images: [event1Img],
          files: ['/uploads/brochure.pdf'],
          isPublished: true
        },
        {
          id: 2,
          title: 'New Packaging Launch',
          description: 'Introducing our new eco-friendly packaging for all edible oils. Made with 100% recyclable materials, this initiative is part of our commitment to sustainability and reducing plastic waste.',
          date: '2026-02-20T14:00:00Z',
          location: 'Bangalore, India',
          category: 'Publication',
          images: [event2Img],
          files: [],
          isPublished: true
        },
        {
          id: 3,
          title: 'Export Achievement: 50 Countries',
          description: 'Habib Solvex celebrates exporting premium edible oils to 50+ countries worldwide. This milestone reflects our commitment to quality and global reach in the edible oil industry.',
          date: '2026-01-10T09:00:00Z',
          location: 'Hiriyur, India',
          category: 'News',
          images: [event3Img],
          files: [],
          isPublished: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEvent(null);
    document.body.style.overflow = 'auto';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 text-center">
        <div className="text-2xl text-[#0a3d3a]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <section className="bg-gradient-to-br from-[#f5efe4] to-[#e8dfce] rounded-[32px] p-8 md:p-16 mt-4">
        <span className="badge"><i className="fas fa-calendar-alt"></i> Events & Publications</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[#0a3d3a] mt-3">
          Events & <span className="text-[#c49a2c]">Publications</span>
        </h1>
        <p className="text-[#3a4a48] max-w-xl mt-3">
          Stay updated with our latest events, news, and publications.
        </p>
      </section>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#3a4a48] text-lg">No events or publications yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-[#0a3d3a]/10 cursor-pointer group">
              {event.images && event.images.length > 0 && (
                <div className="relative h-48 overflow-hidden" onClick={() => openModal(event)}>
                  <img 
                    src={event.images[0]} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.images.length > 1 && (
                    <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      +{event.images.length - 1} more
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-[#0a3d3a] px-4 py-2 rounded-full text-sm font-semibold">
                      View Details
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-[#3a4a48] mb-2">
                  <FaCalendar className="text-[#c49a2c]" />
                  <span>{format(new Date(event.date), 'dd MMM yyyy')}</span>
                  {event.category && (
                    <span className="badge text-xs ml-2">{event.category}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#0a3d3a] mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-[#3a4a48] text-sm line-clamp-3">{event.description}</p>

                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-[#3a4a48] mt-2">
                    <FaMapMarkerAlt className="text-[#c49a2c]" />
                    <span>{event.location}</span>
                  </div>
                )}

                <button 
                  onClick={() => openModal(event)}
                  className="mt-4 text-[#c49a2c] text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  Read More <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-[#0a3d3a]/10 rounded-t-2xl">
              <div className="flex items-center gap-2 text-xs text-[#3a4a48] mb-2">
                <FaCalendar className="text-[#c49a2c]" />
                <span>{format(new Date(selectedEvent.date), 'dd MMM yyyy')}</span>
                {selectedEvent.category && (
                  <span className="badge text-xs ml-2">{selectedEvent.category}</span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a3d3a]">{selectedEvent.title}</h2>
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm text-[#3a4a48] mt-1">
                  <FaMapMarkerAlt className="text-[#c49a2c]" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
            </div>

            {selectedEvent.images && selectedEvent.images.length > 0 && (
              <div className="p-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedEvent.images.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`${selectedEvent.title} - Image ${index + 1}`}
                      className={`w-full rounded-xl object-cover ${
                        index === 0 ? 'md:col-span-2 h-64' : 'h-40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 pt-2">
              <h3 className="text-lg font-semibold text-[#0a3d3a] mb-2">About this Event</h3>
              <p className="text-[#3a4a48] leading-relaxed whitespace-pre-line">
                {selectedEvent.description}
              </p>

              {selectedEvent.files && selectedEvent.files.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#0a3d3a]/10">
                  <h4 className="text-sm font-semibold text-[#0a3d3a] mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.files.map((file, index) => (
                      <a 
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-[#fcf9f2] px-4 py-2 rounded-full hover:bg-[#e8d5a3] transition-colors"
                      >
                        <FaFile /> {file.split('/').pop()}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#0a3d3a]/10 flex flex-wrap gap-3">
                <button 
                  onClick={() => window.open(`mailto:?subject=Check out this event: ${selectedEvent.title}&body=${selectedEvent.description}`)}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Share via Email
                </button>
                <button 
                  onClick={closeModal}
                  className="btn-primary text-sm py-2 px-6"
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

export default Events;