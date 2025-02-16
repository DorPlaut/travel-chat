import {
  createTrip,
  deleteTrip,
  getTripById,
  getUserTrips,
  updateTrip,
} from '../utils.js';

//  GET controler to fetch trips for a user
export const getTrips = async (req, res) => {
  const { userId } = req.params;
  try {
    const trips = await getUserTrips(userId);
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching user trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST controller to add a trip for a user
export const addTrip = async (req, res) => {
  const { userId } = req.params;
  const { tripData } = req.body;
  try {
    const newTrip = await createTrip(userId, tripData);
    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error adding trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//  GET controller to get specific trip
export const getTrip = async (req, res) => {
  const { tripId } = req.params;
  try {
    const trip = await getTripById(tripId);
    res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT controller to update a trip for a user
export const updateTripData = async (req, res) => {
  const { tripId } = req.params;
  const tripData = req.body;

  try {
    const updatedTrip = await updateTrip(tripId, tripData);
    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE controller to delete a trip for a user
export const deleteTripFromDb = async (req, res) => {
  const { tripId } = req.params;
  try {
    await deleteTrip(tripId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
