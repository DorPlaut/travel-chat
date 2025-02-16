// EditTripDialog.jsx
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';

import { useDataStore } from '../../../store/dataStore';
import { addTrip, updateTrip } from '../../../utils/tripsHandler';

const EditTripDialog = ({ open, onClose, trip, userId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { getTrips } = useDataStore();
  const [formData, setFormData] = useState({
    trip_name: '',
    trip_destination: '',
    trip_start_date: '',
    trip_end_date: '',
  });

  useEffect(() => {
    if (trip) {
      setFormData({
        trip_name: trip.trip_name,
        trip_destination: trip.trip_destination,
        trip_start_date: trip.trip_start_date,
        trip_end_date: trip.trip_end_date,
      });
    }
  }, [trip]);

  const handleSubmit = async () => {
    try {
      if (trip) {
        await updateTrip(trip.trip_id, formData);
      } else {
        await addTrip(userId, formData);
      }
      await getTrips(userId);
      onClose();
      enqueueSnackbar(`Trip ${trip ? 'updated' : 'created'}!`, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Error saving trip', { variant: 'error' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      component={motion.div}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
    >
      <DialogTitle>{trip ? 'Edit Trip' : 'Create New Trip'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Trip Name"
          value={formData.trip_name}
          onChange={(e) =>
            setFormData({ ...formData, trip_name: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Destination"
          value={formData.trip_destination}
          onChange={(e) =>
            setFormData({ ...formData, trip_destination: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.trip_start_date}
          onChange={(e) =>
            setFormData({ ...formData, trip_start_date: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.trip_end_date}
          onChange={(e) =>
            setFormData({ ...formData, trip_end_date: e.target.value })
          }
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {trip ? 'Save Changes' : 'Create Trip'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTripDialog;
