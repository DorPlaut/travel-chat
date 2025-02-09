import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DayCell from './DayCell';

const MonthView = ({ currentDate, trips, events, onDayClick }) => {
  const theme = useTheme();

  const calendarDays = useMemo(() => {
    const start = new Date(
      Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1)
    );
    const end = new Date(
      Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    );

    // Previous month days (UTC)
    const prevMonthDays = Array.from(
      { length: start.getUTCDay() },
      (_, i) =>
        new Date(
          Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            i - start.getUTCDay() + 1
          )
        )
    );

    // Current month days (UTC)
    const currentMonthDays = Array.from(
      { length: end.getUTCDate() },
      (_, i) =>
        new Date(
          Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            i + 1
          )
        )
    );

    // Next month days (UTC)
    const totalCells =
      Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7;
    const nextMonthDays = Array.from(
      { length: totalCells - (prevMonthDays.length + currentMonthDays.length) },
      (_, i) =>
        new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, i + 1))
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
