// import axios from 'axios';
// const serveUrl = import.meta.env.VITE_SERVER_URL;

// // Get all events for a trip
// export const fetchEvents = async (tripId) => {
//   try {
//     const response = await axios.get(`${serveUrl}/api/events/${tripId}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     return null;
//   }
// };

// // Get user events
// export const fetchUserEvents = async (userId) => {
//   try {
//     const response = await axios.get(
//       `${serveUrl}/api/events/user-events/${userId}`,
//       {
//         withCredentials: true,
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user events:', error);
//     return null;
//   }
// };

// // Add a new event to a trip
// export const addEvent = async (tripId, userId, eventData) => {
//   try {
//     const response = await axios.post(
//       `${serveUrl}/api/events/${tripId}`,
//       { eventData, userId },
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error adding event:', error);
//     return null;
//   }
// };

// // Update an event
// export const updateEvent = async (tripId, eventId, updateData) => {
//   try {
//     const response = await axios.put(
//       `${serveUrl}/api/events/${tripId}/${eventId}`,
//       updateData,
//       {
//         withCredentials: true,
//       }
//     );
//     console.log('Update response:', response);

//     return true;
//   } catch (error) {
//     console.error('Error updating event:', error);
//     return null;
//   }
// };

// // Delete an event
// export const deleteEvent = async (tripId, eventId) => {
//   try {
//     const response = await axios.delete(
//       `${serveUrl}/api/events/${tripId}/${eventId}`,
//       {
//         withCredentials: true,
//       }
//     );
//     return true;
//   } catch (error) {
//     console.error('Error deleting event:', error);
//     return null;
//   }
// };

import axios from 'axios';

// Server URL from environment variables
const serveUrl = import.meta.env.VITE_SERVER_URL;

/**
 * Fetches all events for a trip.
 * @param {string} tripId - The ID of the trip.
 * @returns {Array|null} - The list of events or null if an error occurs.
 */
export const fetchEvents = async (tripId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/events/${tripId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.message);
    return null;
  }
};

/**
 * Fetches all events for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Array|null} - The list of events or null if an error occurs.
 */
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
    console.error('Error fetching user events:', error.message);
    return null;
  }
};

/**
 * Adds a new event to a trip.
 * @param {string} tripId - The ID of the trip.
 * @param {string} userId - The ID of the user.
 * @param {Object} eventData - The event data to add.
 * @returns {Object|null} - The added event data or null if an error occurs.
 */
export const addEvent = async (tripId, userId, eventData) => {
  try {
    const response = await axios.post(
      `${serveUrl}/api/events/${tripId}`,
      { eventData, userId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error.message);
    return null;
  }
};

/**
 * Updates an event.
 * @param {string} tripId - The ID of the trip.
 * @param {string} eventId - The ID of the event.
 * @param {Object} updateData - The updated event data.
 * @returns {boolean} - True if successful, null if an error occurs.
 */
export const updateEvent = async (tripId, eventId, updateData) => {
  try {
    await axios.put(`${serveUrl}/api/events/${tripId}/${eventId}`, updateData, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error('Error updating event:', error.message);
    return null;
  }
};

/**
 * Deletes an event.
 * @param {string} tripId - The ID of the trip.
 * @param {string} eventId - The ID of the event.
 * @returns {boolean} - True if successful, null if an error occurs.
 */
export const deleteEvent = async (tripId, eventId) => {
  try {
    await axios.delete(`${serveUrl}/api/events/${tripId}/${eventId}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error('Error deleting event:', error.message);
    return null;
  }
};
