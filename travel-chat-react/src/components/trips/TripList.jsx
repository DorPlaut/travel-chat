import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../../store/userStore';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../../store/dataStore';

const TripList = ({}) => {
  // global state
  const { userData } = useUserStore();
  const { trips, setTrips, getTrips, events, setEvents, getEvents } =
    useDataStore();
  // nav
  const navigate = useNavigate();

  const handleTripClick = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  return (
    <List>
      {trips?.map((trip) => (
        <ListItem
          key={trip.trip_id}
          onClick={() => handleTripClick(trip.trip_id)}
        >
          <ListItemText
            primary={trip.trip_name}
            secondary={trip.trip_destination}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TripList;
