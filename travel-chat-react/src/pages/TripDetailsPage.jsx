import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useDataStore } from '../../store/dataStore';
import EventDetailsCard from '../components/trips/EventDetailsCard';
import EditEventDialog from '../components/trips/EditEventDialog';
import { useUserStore } from '../../store/userStore';
import { format, parse } from 'date-fns';
import SearchFilters from '../components/trips/SearchFilters';
import { useChatsStore } from '../../store/chatsStore';

const TripDetailsPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUserStore();
  const { trips, getTrips, events, getEvents, setTrips, setEvents } =
    useDataStore();
  const { getUserConversations } = useChatsStore();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentTrip, setCurrentTrip] = useState('');
  const [tripEvents, setTripEvents] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({
    search: '',
    type: '',
    date: null,
  });

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

  useEffect(() => {
    if (trips.length > 0) {
      const currentTrip = trips.find((t) => t.trip_id.toString() === tripId);
      setCurrentTrip(currentTrip);
    }
  }, [trips]);

  // Handle search and filter
  const filterEvents = (events, filters) => {
    return events.filter((event) => {
      const matchesSearch =
        !filters.search ||
        event.event_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.event_description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        event.event_location
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesType = !filters.type || event.event_type === filters.type;

      const matchesDate =
        !filters.date ||
        format(
          parse(event.event_start_date, 'yyyy-MM-dd', new Date()),
          'yyyy-MM-dd'
        ) === format(filters.date, 'yyyy-MM-dd');

      return matchesSearch && matchesType && matchesDate;
    });
  };

  // Update  tripEvents state handling
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    if (currentTrip?.trip_id) {
      const tripEvents = events.filter(
        (e) => e.trip_id === currentTrip.trip_id
      );
      tripEvents.sort((a, b) => {
        const dateA = new Date(`${a.event_start_date} ${a.event_start_time}`);
        const dateB = new Date(`${b.event_start_date} ${b.event_start_time}`);
        return dateA - dateB;
      });
      setTripEvents(tripEvents);
      setFilteredEvents(tripEvents);
    }
  }, [currentTrip, events]);

  useEffect(() => {
    setFilteredEvents(filterEvents(tripEvents, currentFilters));
  }, [tripEvents, currentFilters]);

  //  Create section deviders
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const dateKey = format(
      parse(event.event_start_date, 'yyyy-MM-dd', new Date()),
      'EEEE, MMMM d, yyyy'
    );
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  // create date range string
  const tripDates = () => {
    if (currentTrip?.trip_start_date) {
      return `${format(
        new Date(currentTrip?.trip_start_date),
        'MMMM d'
      )} - ${format(new Date(currentTrip?.trip_end_date), 'MMMM d, yyyy')}`;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="600">
              {currentTrip?.trip_name}
            </Typography>
            <Typography variant="caption" fontWeight="600">
              {tripDates()}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {currentTrip?.trip_destination}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Trip Events
          </Typography>
          <SearchFilters
            currentTrip={currentTrip}
            onFilterChange={(filters) => {
              // setFilteredEvents(filterEvents(tripEvents, filters));
              setCurrentFilters(filters);
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedEvent(null);
              setEditOpen(true);
            }}
          >
            Add Event
          </Button>
        </Box>

        {Object.keys(groupedEvents).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No events planned yet. Add your first event!
            </Typography>
          </Box>
        ) : (
          Object.entries(groupedEvents).map(([date, events]) => (
            <Box key={date} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {date}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {events.map((event) => (
                <EventDetailsCard
                  key={event.event_id}
                  event={event}
                  tripId={tripId}
                  onEdit={() => {
                    setSelectedEvent(event);
                    setEditOpen(true);
                  }}
                />
              ))}
            </Box>
          ))
        )}

        <EditEventDialog
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          tripId={tripId}
          onSave={() => {
            getEvents(tripId);
            enqueueSnackbar(selectedEvent ? 'Event updated' : 'Event created', {
              variant: 'success',
              autoHideDuration: 3000,
            });
          }}
          currentTrip={currentTrip}
        />
      </Container>
    </motion.div>
  );
};

export default TripDetailsPage;
