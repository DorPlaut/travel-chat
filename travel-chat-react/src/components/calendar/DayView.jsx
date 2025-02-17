import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Chip,
  useTheme,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { format, parseISO, isSameDay, isWithinInterval } from 'date-fns';
import { eventTypeColors, eventTypeIcons, formatTime } from './EventCard';
import { useNavigate } from 'react-router-dom';

const DayView = ({ currentDate, trips, events }) => {
  const theme = useTheme();

  // Filter trips occurring on this date (using SQL date format)
  const dayTrips = useMemo(
    () =>
      trips.filter((trip) => {
        const tripStart = parseISO(trip.trip_start_date);
        const tripEnd = parseISO(trip.trip_end_date);
        return isWithinInterval(currentDate, {
          start: tripStart,
          end: tripEnd,
        });
      }),
    [trips, currentDate]
  );

  // Filter events occurring on this date (using SQL date format)
  const dayEvents = useMemo(
    () =>
      events.filter((event) => {
        if (!event.event_start_date) return false;
        const eventDate = parseISO(event?.event_start_date);
        return isSameDay(currentDate, eventDate);
      }),
    [events, currentDate]
  );

  // Filter trips and events for the current day
  const dayData = useMemo(() => {
    const filteredTrips = trips.filter((trip) => {
      const tripStart = parseISO(trip.trip_start_date);
      const tripEnd = parseISO(trip.trip_end_date);

      return isWithinInterval(currentDate, { start: tripStart, end: tripEnd });
    });

    const filteredEvents = events.filter((event) => {
      const eventDate = parseISO(event.event_start_date);
      return isSameDay(eventDate, currentDate);
    });

    return [...filteredTrips, ...filteredEvents].sort((a, b) => {
      const aTime = a.event_start_time || '00:00:00';
      const bTime = b.event_start_time || '00:00:00';
      return aTime.localeCompare(bTime);
    });
  }, [trips, events, currentDate]);

  // Generate time slots for the day
  const timeSlots = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(currentDate);
      hour.setHours(i, 0, 0, 0);
      return hour;
    });
  }, [currentDate]);

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        p: 2,
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',

          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {format(currentDate, 'EEEE, MMMM do')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {dayTrips.length > 0 && (
            <List
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {dayTrips.map((trip, index) => {
                return (
                  <ListItem key={index} sx={{ p: 0 }}>
                    <Chip
                      size="medium"
                      label={`${trip.trip_name}`}
                      sx={{
                        ml: 1,
                        p: 1,
                        bgcolor: 'success.light',
                        color: 'white',
                        fontSize: '1rem',
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          {dayEvents.length > 0 && (
            <Chip
              size="medium"
              label={`${dayEvents.length} event${
                dayEvents.length > 1 ? 's' : ''
              }`}
              sx={{
                ml: 1,
                p: 1,
                bgcolor: 'error.light',
                color: 'white',
                fontSize: '1rem',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 1 }}>
        {/* Time labels column */}
        <Box sx={{ position: 'relative' }}>
          {timeSlots.map((time, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                height: 60,
                textAlign: 'right',
                pr: 1,
                borderRight: `1px solid ${theme.palette.divider}`,
                position: 'absolute',
                top: `${index * 60}px`,
                width: '100%',
              }}
            >
              {format(time, 'HH:mm')}
            </Typography>
          ))}
        </Box>

        {/* Events container */}
        <Box
          sx={{
            position: 'relative',
            height: 1440, // 24*60px
            borderLeft: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Hour borders */}
          {timeSlots.map((time, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: `${index * 60}px`,
                width: '100%',
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            />
          ))}

          {/* Events */}
          {dayEvents.map((event) => {
            const eventStartDate = parseISO(event.event_start_date);
            const eventEndDate = parseISO(event.event_end_date);
            const isMultiDay = !isSameDay(eventStartDate, eventEndDate);

            const startTimeParts = event.event_start_time
              .split(':')
              .map(Number);
            const startMinutesTotal =
              startTimeParts[0] * 60 + (startTimeParts[1] || 0);

            const endTimeParts = event.event_end_time.split(':').map(Number);
            let endMinutesTotal = endTimeParts[0] * 60 + (endTimeParts[1] || 0);

            if (isMultiDay && isSameDay(eventStartDate, currentDate)) {
              endMinutesTotal = 24 * 60; // Clamp to end of day
            }

            let duration = endMinutesTotal - startMinutesTotal;
            if (duration <= 0) {
              duration = 1; // Ensure minimum height
              endMinutesTotal = startMinutesTotal + 1;
            }

            return (
              <Box
                key={event.event_id}
                sx={{
                  position: 'absolute',
                  top: `${startMinutesTotal}px`,
                  height: `${duration}px`,
                  left: '8px',
                  right: '8px',
                }}
              >
                <EventCard event={event} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default DayView;

// specific event card for day view

const EventCard = ({ event }) => {
  const eventType = event.event_type.toLowerCase();
  const backgroundColor = eventTypeColors[eventType] || '#9ca3af';
  const {
    event_start_time,
    event_end_time,
    event_name,
    event_description,
    event_location,
    trip_id,
  } = event;

  const timeString = () => {
    if (event_start_time && event_end_time) {
      return `${formatTime(event_start_time)} - ${formatTime(event_end_time)}`;
    } else if (event_start_time) {
      return formatTime(event_start_time);
    }
    return '';
  };

  const navigate = useNavigate();
  const handleGoToTripPage = () => {
    const tripId = trip_id;
    navigate(`/trips/${tripId}?search=${event_name}`);
  };

  return (
    <Box
      sx={{
        backgroundColor,
        color: 'white',
        borderRadius: 1,
        p: 1,
        pt: 1.5,
        display: 'flex',
        alignItems: 'flex-start',
        cursor: 'pointer',
        opacity: 0.85,
        '&:hover': { opacity: 1 },
        height: '100%',
        width: '100%',
        transition: 'opacity 0.2s ease-in-out',
      }}
      onClick={handleGoToTripPage}
    >
      <Avatar
        sx={{
          width: 24,
          height: 24,
          mr: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        {eventTypeIcons[eventType]}
      </Avatar>
      <Box>
        <Typography
          variant="caption"
          sx={{ fontSize: '1rem', display: 'block', lineHeight: 1 }}
        >
          {timeString()}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: '1.5rem', display: 'block', fontWeight: 'bold' }}
        >
          {event_name}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
          {event_description} - {event_location}
        </Typography>
      </Box>
    </Box>
  );
};
