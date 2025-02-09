import { useState } from 'react';
import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { fetchTrips } from '../../utils/tripsHandler';
import TripList from '../components/TripList';

const Trips = () => {
  // global state
  const { userData } = useUserStore();
  //  local state
  const [trips, setTrips] = useState([]);
  const fatchUserTrips = async () => {
    try {
      const userTrips = await fetchTrips(userData?.user_id);
      setTrips(userTrips);
    } catch (error) {
      console.log('error fatching trips', error);
    }
  };

  //   use effect
  useEffect(() => {
    if (userData?.user_id) {
      fatchUserTrips();
    }
  }, [userData]);
  return (
    <div>
      <TripList trips={trips} fatchUserTrips={fatchUserTrips} />
    </div>
  );
};

export default Trips;
