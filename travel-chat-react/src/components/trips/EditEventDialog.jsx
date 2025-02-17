import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';

import { useDataStore } from '../../../store/dataStore';

import { eventTypeIcons, eventTypeColors } from '../calendar/EventCard';
import { addEvent, updateEvent } from '../../../utils/eventsHandler';

const eventTypes = Object.keys(eventTypeIcons);

const EditEventDialog = ({
  open,
  onClose,
  event: currentEvent,
  tripId,
  onSave,
  currentTrip,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { getEvents } = useDataStore();
  const [formData, setFormData] = useState({
    event_name: '',
    event_type: 'other',
    event_description: '',
    event_start_date: '',
    event_start_time: '',
    event_end_date: '',
    event_end_time: '',
    event_location: '',
    event_cost: '',
    event_currency: 'USD',
  });

  useEffect(() => {
    if (currentEvent) {
      setFormData({
        ...currentEvent,
        event_start_date: currentEvent.event_start_date,
        event_end_date: currentEvent.event_end_date,
      });
    }
  }, [currentEvent]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };
      if (field === 'event_start_date') {
        updated.event_end_date = value;
      }
      if (field === 'event_start_time') {
        const [hours, minutes] = value.split(':').map(Number);
        updated.event_end_time = `${String((hours + 1) % 24).padStart(
          2,
          '0'
        )}:${String(minutes).padStart(2, '0')}`;
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    const { event_start_date, event_end_date } = formData;
    if (
      event_start_date < currentTrip.trip_start_date ||
      event_end_date > currentTrip.trip_end_date
    ) {
      enqueueSnackbar('Event must be within the trip dates', {
        variant: 'error',
      });
      return;
    }
    try {
      if (currentEvent) {
        await updateEvent(tripId, currentEvent.event_id, formData);
      } else {
        await addEvent(tripId, formData);
      }
      await getEvents(tripId);
      onClose();
      enqueueSnackbar(`Event ${currentEvent ? 'updated' : 'created'}!`, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Error saving event', { variant: 'error' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      component={motion.div}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      maxWidth="md"
    >
      <DialogTitle>
        {currentEvent ? 'Edit Event' : 'Create New Event'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Event Name"
            value={formData.event_name}
            onChange={(e) => handleChange('event_name', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!formData.event_name}
          />
          <TextField
            select
            label="Event Type"
            value={formData.event_type}
            onChange={(e) => handleChange('event_type', e.target.value)}
            fullWidth
            margin="normal"
          >
            {eventTypes.map((type) => (
              <MenuItem
                key={type}
                value={type}
                sx={{ color: eventTypeColors[type] }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.event_start_date}
            onChange={(e) => handleChange('event_start_date', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!formData.event_start_date}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.event_end_date}
            onChange={(e) => handleChange('event_end_date', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!formData.event_end_date}
          />
          <TextField
            label="Start Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.event_start_time}
            onChange={(e) => handleChange('event_start_time', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!formData.event_start_time}
          />
          <TextField
            label="End Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.event_end_time}
            onChange={(e) => handleChange('event_end_time', e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!formData.event_end_time}
          />
          <TextField
            label="Cost"
            type="number"
            value={formData.event_cost}
            onChange={(e) => handleChange('event_cost', e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <TextField
            label="Currency"
            value={formData.event_currency}
            onChange={(e) => handleChange('event_currency', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            value={formData.event_location}
            onChange={(e) => handleChange('event_location', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={formData.event_description}
            onChange={(e) => handleChange('event_description', e.target.value)}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            className="col-span-2"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {currentEvent ? 'Save Changes' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventDialog;
