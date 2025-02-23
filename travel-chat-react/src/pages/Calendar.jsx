import { useState } from 'react';
import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import CalendarComponent from '../components/calendar/CalendarComponent';
import { useDataStore } from '../../store/dataStore';

const Calendar = () => {
  // global state
  const { userData } = useUserStore();
  const { getTrips, getEvents, setTrips, setEvents } = useDataStore();

  //   use effect
  const handleData = () => {
    if (userData?.user_id) {
      getTrips(userData.user_id);
      getEvents(userData.user_id);
    } else {
      setTrips([]);
      setEvents([]);
    }
  };
  //   use effect
  useEffect(() => {
    handleData;
  }, [userData]);
  useEffect(() => {
    handleData;
  }, []);

  return <CalendarComponent />;
};
export default Calendar;
