import { useState } from 'react';
import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import CalendarComponent from '../components/calendar/CalendarComponent';
import { useDataStore } from '../../store/dataStore';

const Calendar = () => {
  // global state
  const { userData } = useUserStore();
  const { getTrips, getEvents } = useDataStore();

  //   use effect
  useEffect(() => {
    if (userData?.user_id) {
      getTrips(userData.user_id);
      getEvents(userData.user_id);
    }
  }, [userData]);
  useEffect(() => {
    if (userData?.user_id) {
      getTrips(userData.user_id);
      getEvents(userData.user_id);
    }
  }, []);

  return <CalendarComponent />;
};
export default Calendar;
