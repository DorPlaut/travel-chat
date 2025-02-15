import express from 'express';
import bodyParser from 'body-parser';
import {
  deleteConversation,
  getConversations,
  getCurrentConversation,
  getMessages,
  handleMessage,
} from '../controllers/chat.js';
import {
  addEventToTrip,
  deleteTripEvent,
  getEvents,
  getEventsForUser,
  updateTripEvent,
} from '../controllers/events.js';
import {
  addTrip,
  deleteTripFromDb,
  getTrip,
  getTrips,
  updateTripData,
} from '../controllers/trips.js';
import {
  getCurrentUser,
  googleCallback,
  initiateGoogleLogin,
  logoutUser,
} from '../controllers/auth.js';
import { authenticateToken } from '../middlewares.js';
import { fetchUserById } from '../controllers/user.js';

const router = express.Router();
const jsonParser = bodyParser.json();

// chat routes
router.route('/chat').post(jsonParser, handleMessage); // handle message - this route is used when user sends a message and handle DB data sync. all other routes that manipulate db data. are for manual use by the user.
router.route('/chat/:userId').get(getConversations); // get all conversations for a user
router.route('/messages/:conversationId').get(getMessages); // get all messages for a conversation
router.route('/conversation/:conversationId').get(getCurrentConversation); // get all messages for a conversation
router.route('/conversation/:conversationId').delete(deleteConversation); // Delete conversation, trip and events
// trip routes
router
  .route('/trips/:userId')
  .get(getTrips) // get all trips for a user
  .post(jsonParser, addTrip); // add a new trip
router
  .route('/trips/:tripId')
  .get(getTrip) // get a single trip
  .put(updateTripData) // update trip data
  .delete(deleteTripFromDb); // delete a trip

// events routes
router
  .route('/events/:tripId')
  .get(getEvents) // get all events for a trip
  .post(jsonParser, addEventToTrip); // add a new event to a trip
router.route('/events/user-events/:userId').get(getEventsForUser); // get all events for a trip
router
  .route('/events/:tripId/:eventId') // get a single event
  .put(updateTripEvent) // update event data
  .delete(deleteTripEvent); // delete an event

// user routes
router.route('/users/:userId').get(authenticateToken, fetchUserById); // get a single user by id

//   auth routes
router.route('/auth/google/callback').get(googleCallback); // google oauth callback
router.route('/auth/google').get(initiateGoogleLogin); // initiate google oauth login
router.route('/auth/me').get(authenticateToken, getCurrentUser); // get current user using token
router.route('/auth/logout').post(logoutUser); // logout user

export default router;
