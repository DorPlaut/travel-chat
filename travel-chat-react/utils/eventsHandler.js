import axios from 'axios';
const serveUrl = import.meta.env.VITE_SERVER_URL;

// Get all events for a trip
export const fetchEvents = async (tripId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/events/${tripId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return null;
  }
};

// Get user events
export const fetchUserEvents = async (userId) => {
  try {
    const response = await axios.get(
      `${serveUrl}/api/events/user-events/${userId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    return null;
  }
};

// Add a new event to a trip
export const addEvent = async (tripId, eventData) => {
  try {
    const response = await axios.post(
      `${serveUrl}/api/events/${tripId}`,
      eventData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error);
    return null;
  }
};

// Update an event
export const updateEvent = async (tripId, eventId, updateData) => {
  try {
    const response = await axios.put(
      `${serveUrl}/api/events/${tripId}/${eventId}`,
      updateData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
};

// Delete an event
export const deleteEvent = async (tripId, eventId) => {
  try {
    const response = await axios.delete(
      `${serveUrl}/api/events/${tripId}/${eventId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    return null;
  }
};
