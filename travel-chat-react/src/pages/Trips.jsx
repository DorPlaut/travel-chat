import { useState } from 'react';
import React, { useEffect } from 'react';
import { useDataStore } from '../../store/dataStore';
import { useUserStore } from '../../store/userStore';
import TripList from '../components/trips/TripList';
import { closeSnackbar, useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TripCard from '../components/trips/TripCard';
import EditTripDialog from '../components/trips/EditTripDialog';
import { deleteTrip } from '../../utils/tripsHandler';
import { useChatsStore } from '../../store/chatsStore';
import { deleteConversation } from '../../utils/chatHandler';

const Trips = () => {
  // global state
  const { userData } = useUserStore();
  const { conversations, getUserConversations } = useChatsStore();
  const { trips, getTrips, events, getEvents, setTrips, setEvents } =
    useDataStore();

  const theme = useTheme();

  const handleData = async () => {
    if (userData?.user_id) {
      await getTrips(userData.user_id);
      await getEvents(userData.user_id);
      await getUserConversations(userData.user_id);
    } else {
      setTrips([]);
      setEvents([]);
    }
  };
  //   use effect
  useEffect(() => {
    handleData();
  }, [userData]);
  useEffect(() => {
    handleData();
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

  // delete trip and conversation
  const handleDelete = (tripId) => {
    const conversationId = conversations.find(
      (conversation) => conversation.trip_id === tripId
    )?.conversation_id;

    if (!conversationId) {
      console.error('Conversation not found for trip:', tripId);
      return;
    }
    enqueueSnackbar(
      'This will remove the chat, trip, and all related events. Are you sure you want to proceed?',
      {
        variant: 'warning',
        persist: true,
        action: (snackbarId) => (
          <>
            <Button
              onClick={async () => {
                try {
                  await deleteConversation(conversationId);
                  closeSnackbar(snackbarId);
                  await handleData();
                  enqueueSnackbar('Trip deleted successfully', {
                    variant: 'success',
                  });
                } catch (error) {
                  console.error('Error deleting Trip:', error);
                  enqueueSnackbar('Error deleting conversation', {
                    variant: 'error',
                  });
                }
              }}
              color="inherit"
            >
              Confirm
            </Button>
            <Button onClick={() => closeSnackbar(snackbarId)} color="inherit">
              Cancel
            </Button>
          </>
        ),
      }
    );
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
          {trips.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                You did not plan any trips yet
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, color: theme.palette.text.secondary }}
              >
                Create a new trip here or by starting a chat with travlai
              </Typography>
            </Box>
          )}
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
                    handleDelete(trip.trip_id);
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
