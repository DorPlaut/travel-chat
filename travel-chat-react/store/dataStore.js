// import { create } from 'zustand';
// import { fetchTrips } from '../utils/tripsHandler';
// import { fetchUserEvents } from '../utils/eventsHandler';

// export const useDataStore = create((set) => ({
//   // Trips
//   trips: [],
//   setTrips: (products) => set({ products }),

//   getTrips: async (userId) => {
//     try {
//       const trips = await fetchTrips(userId);
//       set({ trips: trips });
//     } catch (error) {
//       console.error('Error fetching trips:', error);
//     }
//   },
//   // Events
//   events: [],
//   setEvents: (events) => set({ events }),
//   getEvents: async (userId) => {
//     try {
//       const events = await fetchUserEvents(userId);
//       set({ events: events });
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   },
// }));

import { create } from 'zustand';
import { fetchTrips } from '../utils/tripsHandler';
import { fetchUserEvents } from '../utils/eventsHandler';

/**
 * Data store for managing trips and events state and actions.
 */
export const useDataStore = create((set) => ({
  // State
  trips: [],
  events: [],

  // Actions
  /**
   * Sets the trips state directly.
   * @param {Array} trips - The list of trips to set.
   */
  setTrips: (trips) => set({ trips }),

  /**
   * Fetches and updates the trips for a user.
   * @param {string} userId - The ID of the user.
   */
  getTrips: async (userId) => {
    try {
      const trips = await fetchTrips(userId);
      set({ trips });
    } catch (error) {
      console.error('Error fetching trips:', error.message);
    }
  },

  /**
   * Sets the events state directly.
   * @param {Array} events - The list of events to set.
   */
  setEvents: (events) => set({ events }),

  /**
   * Fetches and updates the events for a user.
   * @param {string} userId - The ID of the user.
   */
  getEvents: async (userId) => {
    try {
      const events = await fetchUserEvents(userId);
      set({ events });
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  },
}));
