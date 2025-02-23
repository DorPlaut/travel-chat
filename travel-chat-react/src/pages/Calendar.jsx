import { useState } from 'react';
import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import CalendarComponent from '../components/calendar/CalendarComponent';
import { useDataStore } from '../../store/dataStore';
import { useChatsStore } from '../../store/chatsStore';

const Calendar = () => {
  // global state
  const { userData } = useUserStore();
  const { getTrips, getEvents, setTrips, setEvents } = useDataStore();
  const { getUserConversations } = useChatsStore();
  //   use effect
  const handleData = async () => {
    if (userData?.user_id) {
      await getTrips(userData.user_id);
      await getEvents(userData.user_id);
      await getUserConversations(userData.user_id);
    } else {
      setTrips([]);
      setEvents([]);
    }
  };
  //   use effect
  useEffect(() => {
    handleData();
  }, [userData]);
  useEffect(() => {
    handleData();
  }, []);

  return <CalendarComponent />;
};
export default Calendar;
