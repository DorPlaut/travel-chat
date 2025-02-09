import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  Chip,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  format,
  startOfYear,
  eachMonthOfInterval,
  isSameYear,
  parseISO,
  isWithinInterval,
} from 'date-fns';

const YearView = ({ currentDate, trips, events, onMonthSelect }) => {
  const theme = useTheme();

  // Generate months for the year
  const months = useMemo(() => {
    const start = startOfYear(currentDate);
    return eachMonthOfInterval({
      start,
      end: new Date(start.getFullYear(), 11),
    });
  }, [currentDate]);

  // Count events/trips per month
  const monthData = useMemo(() => {
    return months.map((month) => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const tripCount = trips.filter((trip) => {
        const tripStart = parseISO(trip.trip_start_date);
        const tripEnd = parseISO(trip.trip_end_date);
        return (
          isWithinInterval(monthStart, { start: tripStart, end: tripEnd }) ||
          isWithinInterval(monthEnd, { start: tripStart, end: tripEnd })
        );
      }).length;

      const eventCount = events.filter((event) => {
        const eventDate = parseISO(event.event_start_date);
        return isWithinInterval(eventDate, {
          start: monthStart,
          end: monthEnd,
        });
      }).length;

      return { tripCount, eventCount };
    });
  }, [trips, events, months]);

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
        {format(currentDate, 'yyyy')}
      </Typography>

      <Grid container spacing={2}>
        {months.map((month, index) => (
          <Grid item xs={4} key={index}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onMonthSelect(month)}
              sx={{
                height: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography variant="subtitle1">
                {format(month, 'MMM')}
              </Typography>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                {monthData[index].tripCount > 0 && (
                  <Chip
                    label={monthData[index].tripCount}
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.6rem' }}
                  />
                )}
                {monthData[index].eventCount > 0 && (
                  <Chip
                    label={monthData[index].eventCount}
                    size="small"
                    color="secondary"
                    sx={{ height: 20, fontSize: '0.6rem' }}
                  />
                )}
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YearView;
