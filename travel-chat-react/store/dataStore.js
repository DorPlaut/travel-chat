import { create } from 'zustand';
import { fetchTrips } from '../utils/tripsHandler';
import { fetchUserEvents } from '../utils/eventsHandler';

export const useDataStore = create((set) => ({
  // Trips
  trips: [],
  setTrips: (products) => set({ products }),

  getTrips: async (userId) => {
    try {
      const trips = await fetchTrips(userId);
      set({ trips: trips });
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  },
  // Events
  events: [],
  setEvents: (events) => set({ events }),
  getEvents: async (userId) => {
    try {
      const events = await fetchUserEvents(userId);
      set({ events: events });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  },
}));
