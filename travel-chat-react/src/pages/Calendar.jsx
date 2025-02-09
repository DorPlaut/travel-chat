import { useState } from 'react';
import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { fetchTrips } from '../../utils/tripsHandler';
import { fetchUserEvents } from '../../utils/eventsHandler';
import CalendarComponent from '../components/calendar/CalendarComponent';

const Calendar = () => {
  // global state
  const { userData } = useUserStore();
  //  local state
  const [trips, setTrips] = useState([]);
  const [events, setEvents] = useState([]);
  //   fetch data
  // trips
  const fatchUserTrips = async () => {
    try {
      const userTrips = await fetchTrips(userData?.user_id);
      console.log('userTrips', userTrips);
      setTrips(userTrips);
    } catch (error) {
      console.log('error fatching trips', error);
    }
  };
  //   events
  const fatchUserEvents = async () => {
    try {
      const userEvents = await fetchUserEvents(userData?.user_id);
      console.log('userEvents', userEvents);

      setEvents(userEvents);
    } catch (error) {
      console.log('error fatching events', error);
    }
  };

  //   use effect
  useEffect(() => {
    if (userData?.user_id) {
      fatchUserTrips();
      fatchUserEvents();
    }
  }, [userData]);
  useEffect(() => {
    if (userData?.user_id) {
      fatchUserTrips();
      fatchUserEvents();
    }
  }, []);

  return (
    <CalendarComponent
      trips={trips}
      events={events}
      fetchUserTrips={fatchUserTrips}
      fetchUserEvents={fatchUserEvents}
    />
  );
};
export default Calendar;
