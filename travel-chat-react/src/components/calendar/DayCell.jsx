import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  useTheme,
  Chip,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { isSameDay, parseISO, isWithinInterval } from 'date-fns';
import EventCard from './EventCard';

const DayCell = ({ date, currentDate, trips, events, onDayClick }) => {
  const theme = useTheme();
  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
  const isToday = isSameDay(date, new Date());

  // Filter trips occurring on this date (using SQL date format)
  const dayTrips = useMemo(
    () =>
      trips.filter((trip) => {
        const tripStart = parseISO(trip.trip_start_date);
        const tripEnd = parseISO(trip.trip_end_date);
        return isWithinInterval(date, { start: tripStart, end: tripEnd });
      }),
    [trips, date]
  );

  // Filter events occurring on this date (using SQL date format)
  const dayEvents = useMemo(
    () =>
      events.filter((event) => {
        if (!event.event_start_date) return false;
        const eventDate = parseISO(event?.event_start_date);
        return isSameDay(date, eventDate);
      }),
    [events, date]
  );

  return (
    <ListItemButton
      component={motion.div}
      whileHover={{ scale: 0.98 }}
      onClick={() => onDayClick && onDayClick(date)}
      sx={{
        height: '100%',
        // minHeight: 140,
        position: 'relative',
        p: 1,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: isToday
          ? 'lightyellow'
          : isCurrentMonth
          ? 'background.paper'
          : 'action.hover',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {/* Date Header */}
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: isToday ? 'bold' : 'normal',
            color: isToday
              ? 'primary.main'
              : isCurrentMonth
              ? 'text.primary'
              : 'text.secondary',
            p: 0.5,
            borderRadius: '4px',
            ...(isToday && { bgcolor: 'primary.lighter' }),
          }}
        >
          {date.getDate()}
        </Typography>
        <div>
          {dayTrips.length > 0 && (
            <Chip
              size="small"
              label={`${dayTrips.length} trip${dayTrips.length > 1 ? 's' : ''}`}
              sx={{
                ml: 1,
                bgcolor: 'success.light',
                color: 'white',
                fontSize: '0.6rem',
                height: 20,
              }}
            />
          )}
          {dayEvents.length > 0 && (
            <Chip
              size="small"
              label={`${dayEvents.length} event${
                dayEvents.length > 1 ? 's' : ''
              }`}
              sx={{
                ml: 1,
                bgcolor: 'error.light',
                color: 'white',
                fontSize: '0.6rem',
                height: 20,
              }}
            />
          )}
        </div>
      </Box>

      {/* Trips List */}
      <Box sx={{ width: '100%', mt: 0.5 }}>
        {dayTrips.map((trip) => (
          <Chip
            key={trip.trip_id}
            label={trip.trip_name}
            size="small"
            sx={{
              bgcolor: 'primary.light',
              color: 'white',
              fontSize: '0.65rem',
              height: 20,
              mb: 0.5,
              width: '100%',
              justifyContent: 'flex-start',
            }}
          />
        ))}
      </Box>

      {/* Events List */}
      <List
        sx={{
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          height: 'calc(100% - 1.4rem)',
          p: 0,
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',

          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {dayEvents.map((event) => (
          <ListItem
            key={event.event_id}
            disablePadding
            sx={{ width: '100%', gap: 1 }}
          >
            <EventCard event={event} />
          </ListItem>
        ))}
      </List>
    </ListItemButton>
  );
};

export default DayCell;
