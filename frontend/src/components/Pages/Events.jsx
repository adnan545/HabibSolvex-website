import React, { useState, useEffect } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaFile, FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../../api/axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
          _id: 1,
          title: 'Annual Oil Expo 2026',
          description: 'Habib Solvex showcased its premium range at the Annual Oil Expo in Mumbai. The event was a huge success with over 500 visitors.',
          date: '2026-03-15T10:00:00Z',
          location: 'Mumbai, India',
          category: 'Event',
          images: [
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=500&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop&auto=format'
          ],
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
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEvent(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setActiveImageIndex((prev) => (prev + 1) % selectedEvent.images.length);
    }
  };

  const prevImage = () => {
    if (selectedEvent && selectedEvent.images) {
      setActiveImageIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 text-center">
        <div className="text-2xl text-[#1a4d46]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      {/* Compact Hero */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-4 pt-8 border-b border-[#e0f0ed]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a4d46] mt-1">
            Events & <span className="text-[#2d7d6b]">Publications</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge text-xs">{events.length} Events</span>
        </div>
      </div>

      <p className="text-[#5a6b7a] text-sm mt-2 max-w-2xl">
        Stay updated with our latest events, news, and publications from around the world.
      </p>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#5a6b7a] text-lg">No events or publications yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#e0f0ed] cursor-pointer group">
              {event.images && event.images.length > 0 && (
                <div className="relative h-56 overflow-hidden" onClick={() => openModal(event)}>
                  <img 
                    src={event.images[0]} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FaExternalLinkAlt className="text-[10px]" /> {event.images.length} images
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-[#1a4d46] px-4 py-2 rounded-full text-sm font-semibold">
                      View Details
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-[#5a6b7a] mb-2">
                  <FaCalendar className="text-[#2d7d6b]" />
                  <span>{format(new Date(event.date), 'dd MMM yyyy')}</span>
                  {event.category && (
                    <span className="badge text-[10px] ml-1">{event.category}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#1a4d46] mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-[#5a6b7a] text-sm line-clamp-3">{event.description}</p>

                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-[#5a6b7a] mt-2">
                    <FaMapMarkerAlt className="text-[#2d7d6b]" />
                    <span className="text-xs">{event.location}</span>
                  </div>
                )}

                <button 
                  onClick={() => openModal(event)}
                  className="mt-3 text-[#2d7d6b] text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  Read More <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Full Event Details with Image Carousel */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Full Size Images Carousel */}
            {selectedEvent.images && selectedEvent.images.length > 0 && (
              <div className="relative bg-black/5">
                <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-[#0a3d3a]">
                  <img 
                    src={selectedEvent.images[activeImageIndex]} 
                    alt={`${selectedEvent.title} - Image ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-1.5 rounded-full">
                    {activeImageIndex + 1} / {selectedEvent.images.length}
                  </div>

                  {/* Navigation Buttons */}
                  {selectedEvent.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors"
                      >
                        <FaChevronLeft className="text-xl" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors"
                      >
                        <FaChevronRight className="text-xl" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedEvent.images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto bg-white">
                    {selectedEvent.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImageIndex === index ? 'border-[#2d7d6b]' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Event Details */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-[#5a6b7a] mb-2">
                <FaCalendar className="text-[#2d7d6b]" />
                <span>{format(new Date(selectedEvent.date), 'dd MMM yyyy')}</span>
                {selectedEvent.category && (
                  <span className="badge text-[10px] ml-1">{selectedEvent.category}</span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a4d46]">{selectedEvent.title}</h2>
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm text-[#5a6b7a] mt-1">
                  <FaMapMarkerAlt className="text-[#2d7d6b]" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-[#1a4d46] mb-2">About this Event</h3>
                <p className="text-[#5a6b7a] leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.files && selectedEvent.files.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#e0f0ed]">
                  <h4 className="text-sm font-semibold text-[#1a4d46] mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.files.map((file, index) => (
                      <a 
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-[#f0f3f2] px-4 py-2 rounded-full hover:bg-[#e0f0ed] transition-colors"
                      >
                        <FaFile /> {file.split('/').pop()}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#e0f0ed] flex flex-wrap gap-3">
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