// In-memory database for development
class InMemoryDB {
  constructor() {
    this.users = [];
    this.contacts = [];
    this.events = [];
    this.idCounter = 1;
  }

  // User methods
  createUser(data) {
    const user = { id: this.idCounter++, ...data, createdAt: new Date() };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  // Contact methods
  createContact(data) {
    const contact = { id: this.idCounter++, ...data, createdAt: new Date() };
    this.contacts.push(contact);
    return contact;
  }

  // Event methods
  createEvent(data) {
    const event = { id: this.idCounter++, ...data, createdAt: new Date() };
    this.events.push(event);
    return event;
  }

  getAllEvents() {
    return this.events;
  }

  getPublishedEvents() {
    return this.events.filter(e => e.isPublished);
  }

  updateEvent(id, data) {
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...data };
      return this.events[index];
    }
    return null;
  }

  deleteEvent(id) {
    this.events = this.events.filter(e => e.id !== id);
  }
}

module.exports = { InMemoryDB };