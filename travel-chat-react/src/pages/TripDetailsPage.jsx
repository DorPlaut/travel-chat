// TripDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EventCard from './EventCard';
import EventCardEnhanced from './EventCardEnhanced';
import { fetchTripById, fetchEvents } from '../utils/tripsApi';
import EditEventDialog from './EditEventDialog';

const TripDetailsPage = ({ userId }) => {
  const { triplid } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [trip, setTrip] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const loadData = async () => {
    const tripData = await fetchTripById(triplid);
    const eventsData = await fetchEvents(triplid);
    if (tripData) setTrip(tripData);
    if (eventsData) setEvents(eventsData);
  };

  useEffect(() => {
    loadData();
  }, [triplid]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="600">
            {trip?.trip_name}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setEditOpen(true)}
          >
            Add Event
          </Button>
        </Box>

        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.event_id}>
              <EventCardEnhanced
                event={event}
                onClick={() => {
                  setSelectedEvent(event);
                  setEditOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>

        <EditEventDialog
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          tripId={triplid}
          onSave={() => {
            loadData();
            enqueueSnackbar(selectedEvent ? 'Event updated' : 'Event created', {
              variant: 'success',
            });
          }}
        />
      </Container>
    </motion.div>
  );
};

export default TripDetailsPage;
