import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTripById,
  updateTrip,
  deleteTrip,
} from '../../utils/tripsHandler';
import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from '../../utils/eventsHandler';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventStartDate, setNewEventStartDate] = useState(new Date());
  const [newEventEndDate, setNewEventEndDate] = useState(new Date());

  useEffect(() => {
    const fetchTripData = async () => {
      const fetchedTrip = await fetchTripById(tripId);
      setTrip(fetchedTrip);

      const fetchedEvents = await fetchEvents(tripId);
      setEvents(fetchedEvents);
    };
    fetchTripData();
  }, [tripId]);

  const handleUpdateTrip = async () => {
    // Update trip data
    await updateTrip(tripId, {
      trip_name: trip.trip_name,
      trip_destination: trip.trip_destination,
      trip_start_date: trip.trip_start_date,
      trip_end_date: trip.trip_end_date,
    });
  };

  const handleDeleteTrip = async () => {
    // Delete the trip
    await deleteTrip(tripId);
    navigate('/');
  };

  const handleAddEvent = async () => {
    // Add a new event
    await addEvent(tripId, {
      event_name: newEventName,
      event_description: newEventDescription,
      event_start_date: newEventStartDate,
      event_end_date: newEventEndDate,
    });
    setNewEventName('');
    setNewEventDescription('');
    setNewEventStartDate(new Date());
    setNewEventEndDate(new Date());
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h4">{trip.trip_name}</Typography>
      <Typography variant="subtitle1">{trip.trip_destination}</Typography>
      <Typography variant="body1">
        {trip.trip_start_date.toLocaleDateString()} -{' '}
        {trip.trip_end_date.toLocaleDateString()}
      </Typography>
      <Button variant="contained" onClick={handleUpdateTrip}>
        Update Trip
      </Button>
      <Button variant="contained" color="error" onClick={handleDeleteTrip}>
        Delete Trip
      </Button>

      <Typography variant="h5" sx={{ marginTop: 2 }}>
        Events
      </Typography>
      <List>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText
              primary={event.event_name}
              secondary={`${event.event_start_date.toLocaleDateString()} - ${event.event_end_date.toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ marginTop: 2 }}>
        <TextField
          label="Event Name"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
        />
        <TextField
          label="Event Description"
          value={newEventDescription}
          onChange={(e) => setNewEventDescription(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          value={newEventStartDate.toISOString().slice(0, 10)}
          onChange={(e) => setNewEventStartDate(new Date(e.target.value))}
        />
        <TextField
          label="End Date"
          type="date"
          value={newEventEndDate.toISOString().slice(0, 10)}
          onChange={(e) => setNewEventEndDate(new Date(e.target.value))}
        />
        <Button variant="contained" onClick={handleAddEvent}>
          Add Event
        </Button>
      </Box>
    </Box>
  );
};

export default TripDetails;
