import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TripList = ({ trips, fatchUserTrips }) => {
  const { userData } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (userData?.user_id) {
        await fatchUserTrips(userData.user_id);
      }
    };
    fetchUserTrips();
  }, [userData]);

  const handleTripClick = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  return (
    <div>
      <h2>Your Trips</h2>
      <List>
        {trips.map((trip) => (
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
      <Button variant="contained" onClick={() => navigate('/trips/new')}>
        Add New Trip
      </Button>
    </div>
  );
};

export default TripList;
