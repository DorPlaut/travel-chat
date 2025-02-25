// CalendarComponent.jsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  useMediaQuery,
  Tooltip,
  Chip,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Today } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import YearView from './YearView';
import { useUserStore } from '../../../store/userStore';
import { useDataStore } from '../../../store/dataStore';
import { useSearchParams } from 'react-router-dom';

const CalendarComponent = () => {
  // global state
  const { userData } = useUserStore();
  const { trips, setTrips, getTrips, events, setEvents, getEvents } =
    useDataStore();
  // local state
  const [touchPosition, setTouchPosition] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // searchg params
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const date = searchParams.get('date');
    if (date) {
      setCurrentDate(new Date(date));
      setViewMode('day');
    }
  }, [searchParams]);

  // Memoized header date formatter
  const formatHeaderDate = useCallback(() => {
    const options = {
      month: 'long',
      year: 'numeric',
      ...(viewMode === 'day' && { day: 'numeric' }),
    };
    return currentDate.toLocaleDateString(undefined, options);
  }, [currentDate, viewMode]);

  // Date navigation handler
  const handleDateChange = useCallback(
    (direction) => {
      const newDate = new Date(currentDate);
      const incrementMap = {
        day: () => newDate.setDate(currentDate.getDate() + direction),
        week: () => newDate.setDate(currentDate.getDate() + direction * 7),
        month: () => newDate.setMonth(currentDate.getMonth() + direction),
        year: () => newDate.setFullYear(currentDate.getFullYear() + direction),
      };
      incrementMap[viewMode]();
      setCurrentDate(new Date(newDate));
    },
    [currentDate, viewMode]
  );

  const onDayClick = (date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  // View mode toggle handler
  const handleViewChange = useCallback((event, newViewMode) => {
    if (newViewMode) setViewMode(newViewMode);
  }, []);

  // Handle swipe on mobile
  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchEnd = (e) => {
    if (!touchPosition) {
      return;
    }

    const touchUp = e.changedTouches[0].clientX;
    const difference = touchPosition - touchUp;

    // Minimum swipe distance threshold (in pixels)
    const minSwipeDistance = 50;

    if (Math.abs(difference) < minSwipeDistance) {
      return;
    }

    // Positive difference means swipe left (next)
    // Negative difference means swipe right (previous)
    const direction = difference > 0 ? 1 : -1;
    handleDateChange(direction);

    // Reset touch position
    setTouchPosition(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', overflow: 'hidden' }}>
      {/* Header Section */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
        alignItems="center"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Navigation Controls */}
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Previous">
            <IconButton onClick={() => handleDateChange(-1)}>
              <ArrowBackIos fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Tooltip>

          <Typography variant="h6" sx={{ minWidth: 180, textAlign: 'center' }}>
            {formatHeaderDate()}
          </Typography>

          <Tooltip title="Next">
            <IconButton onClick={() => handleDateChange(1)}>
              <ArrowForwardIos fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* View Controls */}
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Today">
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={() => setCurrentDate(new Date())}
              size={isMobile ? 'small' : 'medium'}
            >
              Today
            </Button>
          </Tooltip>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size={isMobile ? 'small' : 'medium'}
          >
            {['day', 'week', 'month', 'year'].map((mode) => (
              <ToggleButton key={mode} value={mode}>
                {mode.charAt(0).toUpperCase()}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Calendar Body */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          mt: 2,
          position: 'relative',
          height: '100%',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${currentDate}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'relative',
              height: 'calc(100% - 4rem)',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {viewMode === 'month' && (
              <MonthView
                currentDate={currentDate}
                trips={trips}
                events={events}
                onDayClick={onDayClick}
              />
            )}
            {viewMode === 'week' && (
              <WeekView
                currentDate={currentDate}
                trips={trips}
                events={events}
                onDayClick={onDayClick}
              />
            )}
            {viewMode === 'day' && (
              <DayView
                currentDate={currentDate}
                trips={trips}
                events={events}
              />
            )}
            {viewMode === 'year' && (
              <YearView
                currentDate={currentDate}
                trips={trips}
                events={events}
                onMonthSelect={(date) => {
                  setCurrentDate(date);
                  setViewMode('month');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default CalendarComponent;
