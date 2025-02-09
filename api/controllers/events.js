import {
  addEvent,
  deleteEvent,
  getTripEvents,
  getUserEvents,
  updateEvent,
} from '../utils.js';

//  GET controller to fetch events for a trip
export const getEvents = async (req, res) => {
  const { tripId } = req.params;

  try {
    // Fetch events for the specified trip
    const tripEvents = await getTripEvents(tripId);
    return res.status(200).json(tripEvents);
  } catch (error) {
    console.error('Error in getEvents:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//  GET controller to fetch all events of a user
export const getEventsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch events for the specified user
    const userEvents = await getUserEvents(userId);
    return res.status(200).json(userEvents);
  } catch (error) {
    console.error('Error in getUserEvents:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST controller to add event to a trip
export const addEventToTrip = async (req, res) => {
  const { tripId } = req.params;
  const eventData = req.body;

  try {
    // Add event to the specified trip
    const newEvent = await addEvent(tripId, eventData);
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error in addEvent:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT controller to update an event
export const updateTripEvent = async (req, res) => {
  const { tripId, eventId } = req.params;
  const eventData = req.body;

  try {
    // Update the event
    const updatedEvent = await updateEvent(tripId, eventId, eventData);
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error in updateEvent:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE controller to delete an event
export const deleteTripEvent = async (req, res) => {
  const { tripId, eventId } = req.params;

  try {
    // Delete the event
    await deleteEvent(tripId, eventId);
    return res.status(204).end();
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
