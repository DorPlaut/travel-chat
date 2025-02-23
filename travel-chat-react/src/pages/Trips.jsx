import { useState } from 'react';
import React, { useEffect } from 'react';
import { useDataStore } from '../../store/dataStore';
import { useUserStore } from '../../store/userStore';
import TripList from '../components/trips/TripList';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TripCard from '../components/trips/TripCard';
import EditTripDialog from '../components/trips/EditTripDialog';
import { deleteTrip } from '../../utils/tripsHandler';
import { useChatsStore } from '../../store/chatsStore';

const Trips = () => {
  // global state
  const { userData } = useUserStore();
  const { trips, getTrips, events, getEvents, setTrips, setEvents } =
    useDataStore();
  const { getUserConversations } = useChatsStore();

  const handleData = () => {
    if (userData?.user_id) {
      getTrips(userData.user_id);
      getEvents(userData.user_id);
      getUserConversations(userData.user_id);
    } else {
      setTrips([]);
      setEvents([]);
    }
  };
  //   use effect
  useEffect(() => {
    handleData;
  }, [userData]);
  useEffect(() => {
    handleData;
  }, []);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteTrip = async (tripId) => {
    const success = await deleteTrip(tripId);
    if (success) {
      // handle delite
      getTrips(userData.user_id);
      enqueueSnackbar('Trip deleted', { variant: 'success' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight="600">
            My Trips
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedTrip(null);
              setEditOpen(true);
            }}
          >
            New Trip
          </Button>
        </Box>

        <Grid container spacing={3}>
          {trips.map((trip) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={trip.trip_id}>
                <TripCard
                  trip={trip}
                  onEdit={() => {
                    setSelectedTrip(trip);
                    setEditOpen(true);
                  }}
                  onDelete={() => {
                    handleDeleteTrip(trip.trip_id);
                  }}
                />
              </Grid>
            );
          })}
        </Grid>

        <EditTripDialog
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedTrip(null);
          }}
          trip={selectedTrip}
          userId={userData?.user_id}
          onSave={() => {
            loadTrips();
            enqueueSnackbar(selectedTrip ? 'Trip updated' : 'Trip created', {
              variant: 'success',
            });
          }}
        />
      </Container>
    </motion.div>
  );
};

export default Trips;
