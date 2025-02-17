import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DayCell from './DayCell';

const MonthView = ({ currentDate, trips, events, onDayClick }) => {
  const theme = useTheme();

  const calendarDays = useMemo(() => {
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Previous month days (local)
    const prevMonthDays = Array.from({ length: start.getDay() }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() - (start.getDay() - i));
      return date;
    });

    // Current month days (local)
    const currentMonthDays = Array.from(
      { length: end.getDate() },
      (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1)
    );

    // Next month days (local)
    const totalCells =
      Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7;
    const nextMonthDaysLength =
      totalCells - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from(
      { length: nextMonthDaysLength },
      (_, i) => {
        const date = new Date(end);
        date.setDate(end.getDate() + i + 1);
        return date;
      }
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentDate]);

  const weekDays = useMemo(
    () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    []
  );

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'none',
        position: 'relative',
      }}
    >
      {/* Weekday Header */}
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

      {/* Calendar Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: '1fr',
          gap: 0.5,
          position: 'relative',
          height: 'calc(100% - 3rem)',
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
          />
        ))}
      </Box>
    </Box>
  );
};

export default MonthView;
