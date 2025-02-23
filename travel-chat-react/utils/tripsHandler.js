// import axios from 'axios';
// const serveUrl = import.meta.env.VITE_SERVER_URL;

// // Get all trips for a user
// export const fetchTrips = async (userId) => {
//   try {
//     const response = await axios.get(`${serveUrl}/api/trips/${userId}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching trips:', error);
//     return null;
//   }
// };

// // Add a new trip
// export const addTrip = async (userId, tripData) => {
//   try {
//     const response = await axios.post(
//       `${serveUrl}/api/trips/${userId}`,
//       tripData,
//       {
//         withCredentials: true,
//       }
//     );
//     return true;
//   } catch (error) {
//     console.error('Error adding trip:', error);
//     return null;
//   }
// };

// // Get a single trip by ID
// export const fetchTripById = async (tripId) => {
//   try {
//     const response = await axios.get(`${serveUrl}/api/trips/${tripId}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching trip:', error);
//     return null;
//   }
// };

// // Update trip data
// export const updateTrip = async (tripId, updateData) => {
//   try {
//     console.log(tripId, updateData);

//     const response = await axios.put(
//       `${serveUrl}/api/trips/${tripId}`,
//       updateData,
//       {
//         withCredentials: true,
//       }
//     );
//     return true;
//   } catch (error) {
//     console.error('Error updating trip:', error);
//     return null;
//   }
// };

// // Delete a trip
// export const deleteTrip = async (tripId) => {
//   try {
//     const response = await axios.delete(`${serveUrl}/api/trips/${tripId}`, {
//       withCredentials: true,
//     });
//     return true;
//   } catch (error) {
//     console.error('Error deleting trip:', error);
//     return null;
//   }
// };

import axios from 'axios';

// Server URL from environment variables
const serveUrl = import.meta.env.VITE_SERVER_URL;

/**
 * Fetches all trips for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Array|null} - The list of trips or null if an error occurs.
 */
export const fetchTrips = async (userId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/trips/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error.message);
    return null;
  }
};

/**
 * Adds a new trip.
 * @param {string} userId - The ID of the user.
 * @param {Object} tripData - The trip data to add.
 * @returns {boolean} - True if successful, null if an error occurs.
 */
export const addTrip = async (userId, tripData) => {
  try {
    await axios.post(`${serveUrl}/api/trips/${userId}`, tripData, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error('Error adding trip:', error.message);
    return null;
  }
};

/**
 * Fetches a single trip by ID.
 * @param {string} tripId - The ID of the trip.
 * @returns {Object|null} - The trip data or null if an error occurs.
 */
export const fetchTripById = async (tripId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/trips/${tripId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trip:', error.message);
    return null;
  }
};

/**
 * Updates trip data.
 * @param {string} tripId - The ID of the trip.
 * @param {Object} updateData - The updated trip data.
 * @returns {boolean} - True if successful, null if an error occurs.
 */
export const updateTrip = async (tripId, updateData) => {
  try {
    await axios.put(`${serveUrl}/api/trips/${tripId}`, updateData, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error('Error updating trip:', error.message);
    return null;
  }
};

/**
 * Deletes a trip.
 * @param {string} tripId - The ID of the trip.
 * @returns {boolean} - True if successful, null if an error occurs.
 */
export const deleteTrip = async (tripId) => {
  try {
    await axios.delete(`${serveUrl}/api/trips/${tripId}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error.message);
    return null;
  }
};
