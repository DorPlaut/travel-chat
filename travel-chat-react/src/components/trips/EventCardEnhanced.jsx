import { IconButton, Paper, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EventCard from './EventCard';
import { motion } from 'framer-motion';

const EventCardEnhanced = ({ event, onClick }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Paper elevation={3} sx={{ p: 1, position: 'relative' }}>
        <EventCard event={event} />
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: 4, right: 4 }}
          onClick={onClick}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Paper>
    </motion.div>
  );
};

export default EventCardEnhanced;
