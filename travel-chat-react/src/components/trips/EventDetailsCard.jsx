// EventDetailsCard.jsx
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { eventTypeIcons, eventTypeColors, formatTime } from './EventCard';
import { useDataStore } from '../store/dataStore';
import { deleteEvent } from '../../../utils/eventsHandler';

const EventDetailsCard = ({ event, tripId, onEdit }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { getEvents } = useDataStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    const success = await deleteEvent(tripId, event.event_id);
    if (success) {
      await getEvents(tripId);
      enqueueSnackbar('Event deleted', { variant: 'success' });
    }
    handleMenuClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card sx={{ position: 'relative', mb: 2 }}>
        <CardContent sx={{ pb: '8px !important' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: eventTypeColors[event.event_type],
                  width: 32,
                  height: 32,
                }}
              >
                {eventTypeIcons[event.event_type]}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="500">
                {event.event_name}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ ml: 4.5, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {event.event_location && `${event.event_location} • `}
              {formatTime(event.event_start_time)} -{' '}
              {formatTime(event.event_end_time)}
            </Typography>

            {event.event_cost > 0 && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Cost: {event.event_currency} {event.event_cost}
              </Typography>
            )}

            {event.event_description && (
              <Typography variant="body2" mt={1} sx={{ opacity: 0.8 }}>
                {event.event_description}
              </Typography>
            )}
          </Box>
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            onClick={() => {
              onEdit();
              handleMenuClose();
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default EventDetailsCard;
