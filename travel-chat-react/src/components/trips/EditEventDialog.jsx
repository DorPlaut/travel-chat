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

  const handleSubmit = async () => {
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
            select
            label="Event Type"
            value={formData.event_type}
            onChange={(e) =>
              setFormData({ ...formData, event_type: e.target.value })
            }
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
            label="Event Name"
            value={formData.event_name}
            onChange={(e) =>
              setFormData({ ...formData, event_name: e.target.value })
            }
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.event_start_date}
            onChange={(e) =>
              setFormData({ ...formData, event_start_date: e.target.value })
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Start Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.event_start_time}
            onChange={(e) =>
              setFormData({ ...formData, event_start_time: e.target.value })
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Cost"
            type="number"
            value={formData.event_cost}
            onChange={(e) =>
              setFormData({ ...formData, event_cost: e.target.value })
            }
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />

          <TextField
            label="Location"
            value={formData.event_location}
            onChange={(e) =>
              setFormData({ ...formData, event_location: e.target.value })
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Description"
            value={formData.event_description}
            onChange={(e) =>
              setFormData({ ...formData, event_description: e.target.value })
            }
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
