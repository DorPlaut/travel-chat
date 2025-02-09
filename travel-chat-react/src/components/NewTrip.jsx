import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { addTrip } from '../../utils/tripsHandler';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';

const NewTrip = () => {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  const [tripDestination, setTripDestination] = useState('');
  const [tripStartDate, setTripStartDate] = useState(new Date());
  const [tripEndDate, setTripEndDate] = useState(new Date());

  const handleSubmit = async () => {
    if (userData?.user_id) {
      const newTripData = {
        trip_name: tripName,
        trip_destination: tripDestination,
        trip_start_date: tripStartDate,
        trip_end_date: tripEndDate,
        user_id: userData.user_id,
      };
      const newTrip = await addTrip(userData.user_id, newTripData);
      if (newTrip) {
        navigate(`/trips/${newTrip.trip_id}`);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <TextField
        label="Trip Name"
        value={tripName}
        onChange={(e) => setTripName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Trip Destination"
        value={tripDestination}
        onChange={(e) => setTripDestination(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Start Date"
        type="date"
        value={tripStartDate.toISOString().slice(0, 10)}
        onChange={(e) => setTripStartDate(new Date(e.target.value))}
        margin="normal"
      />
      <TextField
        label="End Date"
        type="date"
        value={tripEndDate.toISOString().slice(0, 10)}
        onChange={(e) => setTripEndDate(new Date(e.target.value))}
        margin="normal"
      />
      <Button variant="contained" onClick={handleSubmit}>
        Create Trip
      </Button>
    </Box>
  );
};

export default NewTrip;
