import { useState } from 'react';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleGoToTripPage = () => {
    const tripId = trip.trip_id;
    navigate(`/trips/${tripId}`);
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card sx={{ position: 'relative' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{trip.trip_name}</Typography>

            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Button
              variant="outlined"
              onClick={handleGoToTripPage}
              sx={{ position: 'absolute', right: '1rem', bottom: '1rem' }}
            >
              See More
            </Button>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {trip.trip_destination}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {format(new Date(trip.trip_start_date), 'MMM dd')} -
              {format(new Date(trip.trip_end_date), 'MMM dd yyyy')}
            </Typography>
          </Box>
        </CardContent>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              onEdit();
              handleClose();
            }}
          >
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(trip.trip_id);
              handleClose();
            }}
          >
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default TripCard;
