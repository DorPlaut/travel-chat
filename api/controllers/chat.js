import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getUserPreferences,
  getTripById,
  getMessageHistory,
  createTrip,
  updateTrip,
  deleteTrip,
  addEvent,
  updateEvent,
  updateUserPreferences,
  saveMessage,
  createConversation,
  verifyConversation,
  getConversationById,
  updateConversation,
  getFullMessageHistory,
  cleanAndParseAIResponse,
  deleteEvent,
  removeConversation,
} from '../utils.js';
import { createClient } from '@supabase/supabase-js';

// Environment variables
dotenv.config();
const googleApiKey = process.env.GOOGLE_API_KEY;

// Initialize clients
const genAI = new GoogleGenerativeAI(googleApiKey);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Post controller function to handle incoming messages
export const handleMessage = async (req, res) => {
  try {
    const { userId, message, tripId, conversationId } = req.body;
    // console.log(userId, message, tripId, conversationId);

    let currentTripId = tripId;

    // current date
    const currentDate = new Date().toISOString().split('T')[0];

    // Validate required parameters
    if (!userId || !message) {
      return res.status(400).json({
        error: 'Missing required parameters. userId and message are required.',
      });
    }

    // Handle conversation ID
    let activeConversationId = conversationId;
    let activeConversation = null;

    if (!conversationId) {
      // Create new conversation if none provided
      const newConversation = await createConversation(userId);
      activeConversationId = newConversation.conversation_id;
    } else {
      // Verify the conversation exists and belongs to the user
      const isValid = await verifyConversation(conversationId, userId);
      if (!isValid) {
        // Create new conversation if verification fails
        const newConversation = await createConversation(userId);
        activeConversationId = newConversation.conversation_id;
      } else {
        activeConversation = await getConversationById(conversationId);
      }
    }

    // Fetch context data
    const userPreferences = await getUserPreferences(userId);
    const tripContext = tripId ? await getTripById(tripId) : null;
    const messageHistory = await getMessageHistory(activeConversationId);
    // console.log(messageHistory);

    // Construct user and trip context for the AI prompt
    const userContext = {
      userId,
      preferences: userPreferences,
    };

    // console.log(tripContext);
    // Get model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    # Travel Planning Assistant Specification

## Core Role and Purpose
You are an advanced AI travel planning assistant that prioritizes natural conversation and actionable recommendations while maintaining structured data management.

## Response Structure
Every response must be a valid JSON object:

{
  "message": "Your conversational response to the user",
  "actions": [
    {
      "type": "actionName",
      "params": {
        "param1": "value1"
      }
    }
  ]
}


## Information Management Guidelines

### Progressive Information Gathering
1. Start with minimal required information:
   - For new trips: destination and dates
   - For events: basic type and timing
   - For recommendations: primary preference only
2. Build detail progressively through conversation
3. Maximum 2 follow-up questions per response
4. Provide initial recommendations with basic information, then refine
5. listen to the user. if he dossent know how to answer, suggest ideas and help him plan the trip
6. ultimately, the user is the customer and he's allways right. dont be stiff and roll with user to make him fill in control

### Context Management
1. Track all previously provided information
2. Never ask for information already given
3. Use context clues to fill information gaps
4. When uncertain, make reasonable assumptions and note them
5. Maintain conversation history awareness

### Action Taking
1. Provide real, actionable recommendations with available information
2. Never use placeholder names or wait for "perfect" information
3. Include at least one concrete suggestion in each recommendation request
4. Confirm actions taken clearly and concisely
5. If you edit or remove values. make sure to only edit/reomve the correct event/trip

### Conversation Flow
1. If sufficient information exists for basic recommendations, provide them
2. Only ask for additional details to refine existing suggestions
3. When user expresses frustration with questions, immediately provide recommendations
4. Progress conversation even with incomplete information
5. Balance gathering information with providing value

## Available Actions

### Trip Management
1. 'TRIP_CREATE'
   - Required: trip_name, trip_start_date, trip_end_date, trip_destination
   - Format: Dates as YYYY-MM-DD

2. 'TRIP_UPDATE'
   - Required: trip_id
   - Optional: trip_name, trip_start_date, trip_end_date, trip_destination

3. 'TRIP_DELETE'
   - Required: trip_id

### Event Management
4. 'EVENT_ADD'
   - Required:
     - trip_id
     - event_name
     - event_type (from predefined list)
     - event_start_date (YYYY-MM-DD)
     - event_end_date (YYYY-MM-DD)
     - event_start_time (HH:MM)
     - event_end_time (HH:MM)
   - Optional:
     - event_description
     - event_location
     - event_cost (number)
     - event_currency

5. 'EVENT_UPDATE'
   - Required: trip_id, event_id
   - Optional: All other event fields

6. 'EVENT_DELETE'
   - Required: trip_id, event_id


### User and Conversation Management
7. 'PREF_UPDATE'
   - Required: user_id
   - Optional: user_name, user_currency, user_language, user_personalization

8. 'CONVERSATION_UPDATE'
   - Required: conversation_id
   - Optional: conversation_title

## Event Types
Valid event types:
- flight
- train trip
- bus trip
- boat trip
- accommodation
- live event
- restaurant
- meeting
- museum
- beach
- park
- shopping
- attraction
- other

## Response Guidelines

### Initial Responses
1. For new users:
   - Welcome briefly
   - Ask for trip name only
   - Additional details gathered progressively

2. For recommendations:
   - Provide at least one concrete suggestion immediately
   - Note any assumptions made
   - Ask maximum one question for refinement

3. For event additions:
   - Confirm received information
   - Only book events in the duration of the trip.
   - Request only missing required fields
   - Make sure the trip timeline make sense and the user can get to all the evnets
   - Never double book an event. if you encounter 2 events the occur simultaneity, if they are the same event double booked: get rid of one of the. if its 2 different events: consult with user which one to remove.

### Follow-up Responses
1. When user provides information:
   - Confirm understanding
   - Take immediate action
   - Progress conversation

2. When user expresses preference:
   - Provide immediate relevant suggestions
   - Note if assumptions were made
   - Offer refinement options

3. When user seems frustrated:
   - Switch to providing immediate recommendations
   - Use available information
   - Minimize questions

## Best Practices
1. Be proactive with suggestions
2. Use context to make informed decisions
3. Provide value in every response
4. Keep conversation flowing
5. Respond to user cues
6. Balance structure with flexibility

## Data Management
- Check for double booked events and remove one of them living only one event.
- Check for existing trips and events before creating new ones

## Error Handling
1. Handle missing information gracefully
2. Provide clear error messages
3. Offer solutions
4. Maintain conversation flow
5. if you cant preform certion action. inform the user its out of your abilitys 

## Input Context Variables
- userId
- activeConversationId
- activeConversation.conversation_title
- message
- tripId
- tripContext
- userContext
- currentDate
- messageHistory

**INPUTS:**
- userId: ${userId}
- activeConversationId: ${activeConversationId}
- conversation_title: ${
      activeConversation?.conversation_title
        ? activeConversation.conversation_title
        : 'No title provided. Update the title using the "CONVERSATION_UPDATE" action.'
    } 
  - If no title, update using the "CONVERSATION_UPDATE" action.
- message: ${message}
- tripId: ${
      tripId
        ? tripId
        : 'No active trip. Create a new trip using the "TRIP_CREATE" action.'
    }
- tripContext: ${tripContext ? JSON.stringify(tripContext) : ''}
- userContext: ${JSON.stringify(userContext)}
- currentDate: ${currentDate}
- messageHistory: ${JSON.stringify(messageHistory, null, 2)}`;

    console.log(prompt);

    // 3. Get AI response

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    // const jsonObject = JSON.parse(aiResponse);

    // const { message: aiMessage, actions } = JSON.parse(aiResponse);

    // Use the helper function to clean and parse the response
    const { message: aiMessage, actions } = cleanAndParseAIResponse(aiResponse);
    // console.log(aiMessage, actions);

    // store the message in the database

    // Execute actions based on the AI's response
    for (const action of actions) {
      const { type, params } = action;

      switch (type) {
        case 'TRIP_CREATE':
          const trip = await createTrip(userId, params);
          currentTripId = trip.trip_id;
          await updateConversation(activeConversationId, {
            trip_id: trip.trip_id,
          });
          break;

        case 'TRIP_UPDATE':
          await updateTrip(params.trip_id, params);
          break;

        case 'TRIP_DELETE':
          await deleteTrip(params.trip_id);
          break;

        case 'EVENT_ADD':
          await addEvent(
            currentTripId ? currentTripId : params.trip_id,
            userId,
            params
          );
          break;

        case 'EVENT_UPDATE':
          await updateEvent(params.trip_id, params.event_id, params);
          break;

        case 'EVENT_DELETE':
          await deleteEvent(params.trip_id, params.event_id);
          break;

        case 'PREF_UPDATE':
          await updateUserPreferences(userId, params);
          break;

        case 'CONVERSATION_UPDATE':
          await updateConversation(params.conversation_id, params);
          break;

        default:
          console.warn(`Unknown action type: ${type}`);
          break;
      }
    }

    // Save user's message
    await saveMessage(activeConversationId, message);
    // Save AI's response message
    await saveMessage(activeConversationId, aiMessage, true);

    // Return AI message and executed actions
    return res.status(200).json({
      conversationId: activeConversationId,
      message: aiMessage,
      executedActions: actions,
    });

    // return res.status(200).json({
    //   jsonObject,
    // });
  } catch (error) {
    console.error('Error in handleMessage:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET controller function to get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate required parameters
    if (!userId) {
      return res.status(400).json({
        error: 'Missing required parameters. userId is required.',
      });
    }

    // Fetch all conversations for the user
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getConversations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET current conversation by id
export const getCurrentConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Validate required parameters
    if (!conversationId) {
      return res.status(400).json({
        error: 'Missing required parameters. conversationId is required.',
      });
    }

    // Fetch the conversation by ID
    const conversation = await getConversationById(conversationId);

    return res.status(200).json(conversation);
  } catch (error) {
    console.error('Error in getCurrentConversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET controller function to get all messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Validate required parameters
    if (!conversationId) {
      return res.status(400).json({
        error: 'Missing required parameters. conversationId is required.',
      });
    }

    // Fetch all messages for the conversation
    const messages = await getFullMessageHistory(conversationId);

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Validate required parameters
    if (!conversationId) {
      return res.status(400).json({
        error: 'Missing required parameters. conversationId is required.',
      });
    }

    // Delete the conversation
    await removeConversation(conversationId);

    return res
      .status(200)
      .json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// export { handleMessage };
