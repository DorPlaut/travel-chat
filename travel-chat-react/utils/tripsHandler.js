import axios from 'axios';
const serveUrl = import.meta.env.VITE_SERVER_URL;

// Get all trips for a user
export const fetchTrips = async (userId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/trips/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    return null;
  }
};

// Add a new trip
export const addTrip = async (userId, tripData) => {
  try {
    const response = await axios.post(
      `${serveUrl}/api/trips/${userId}`,
      tripData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding trip:', error);
    return null;
  }
};

// Get a single trip by ID
export const fetchTripById = async (tripId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/trips/${tripId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
};

// Update trip data
export const updateTrip = async (tripId, updateData) => {
  try {
    const response = await axios.put(
      `${serveUrl}/api/trips/${tripId}`,
      updateData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating trip:', error);
    return null;
  }
};

// Delete a trip
export const deleteTrip = async (tripId) => {
  try {
    const response = await axios.delete(`${serveUrl}/api/trips/${tripId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return null;
  }
};
