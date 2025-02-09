import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DayCell from './DayCell'; // Reuse the same DayCell component
import { format, startOfWeek, addDays } from 'date-fns';

const WeekView = ({ currentDate, trips, events, onDayClick }) => {
  const theme = useTheme();

  // Generate dates for the current week (Sunday to Saturday)
  const calendarDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start on Sunday
    return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  }, [currentDate]);

  const weekDays = useMemo(
    () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    []
  );

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        // background: 'red',
      }}
    >
      {/* Weekday Header - Matches month view styling */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.5,
          mb: 1,
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 1,
        }}
      >
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant="subtitle2"
            align="center"
            fontWeight="bold"
            color="text.secondary"
            sx={{
              p: 1,
              borderBottom: `2px solid ${theme.palette.divider}`,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Week Grid - Single row with full-height cells */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.5,
          height: 'calc(100% - 3rem)',
          gridAutoRows: '1fr',
        }}
      >
        {calendarDays.map((date, index) => (
          <DayCell
            key={index}
            date={date}
            currentDate={currentDate}
            trips={trips}
            events={events}
            onDayClick={onDayClick}
            sx={{
              height: '100%',
              minHeight: 180, // Slightly taller than month view cells
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default WeekView;
