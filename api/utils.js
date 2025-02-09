import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Constants for validation
const VALID_EVENT_TYPES = [
  'flight',
  'train trip',
  'bus trip',
  'boat trip',
  'accommodation',
  'live event',
  'restaurant',
  'meeting',
  'museum',
  'beach',
  'park',
  'shopping',
  'attraction',
  'other',
];

const VALID_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'INR',
];
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LANGUAGE = 'en-US';

// Validation helper
const validateEventType = (type) => {
  if (!VALID_EVENT_TYPES.includes(type)) {
    throw new Error(
      `Invalid event type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}`
    );
  }
};

//
// USERS
//

//  * get user by ID
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// * Get user preferences by user ID
export const getUserPreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_name, user_personalization, user_currency, user_language')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
};

// * Update user preferences
export const updateUserPreferences = async (userId, prefData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(prefData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

// update user data
export const updateUser = async (userId, userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// * Get user trips by user ID
export const getUserTrips = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select(
        `
        *,
        events (*)
      `
      )
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user trips:', error);
    throw error;
  }
};

// * Get user conversations by user ID
export const getUserConversations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        messages (*)
      `
      )
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    throw error;
  }
};

//
// TRIPS
//

// * Get trip by ID
export const getTripById = async (tripId) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select(
        `
        *,
        events (*)
      `
      )
      .eq('trip_id', tripId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trip:', error);
    throw error;
  }
};

// * Create a new trip
export const createTrip = async (userId, tripData) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert([{ user_id: userId, ...tripData }]) // Only one .insert() call
      .select()
      .single();

    if (error) throw error;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

// * Update an existing trip
export const updateTrip = async (tripId, tripData) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update(tripData)
      .eq('trip_id', tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

// * Get all events for a trip
export const getTripEvents = async (tripId) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('trip_id', tripId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trip events:', error);
    throw error;
  }
};

// * Get all evetns of specific user
export const getUserEvents = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};

// * Delete a trip and all associated events
export const deleteTrip = async (tripId) => {
  try {
    // First delete all events associated with the trip
    await supabase.from('events').delete().eq('trip_id', tripId);

    // Then delete the trip
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('trip_id', tripId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

//
// EVENTS
//

// * Add an event to a trip
export const addEvent = async (tripId, userId, eventData) => {
  try {
    // validateEventType(eventData.type);

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          trip_id: tripId,
          user_id: userId,
          ...eventData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

// * Update an existing event using id
export const updateEvent = async (tripId, eventId, eventData) => {
  try {
    // if (eventData.enevt_type) {
    //   validateEventType(eventData.event_type);
    // }
    // clean

    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('event_id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// * Delete an event from a trip
export const deleteEvent = async (tripId, eventId) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('trip_id', tripId)
      .eq('event_id', eventId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// * Get event by ID
export const getEventById = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

//
// CHAT
//

//  * Get full message history for a conversation
export const getFullMessageHistory = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(
        `
        message_id,
        message,
        sender,
        sent_at,
        conversation_id
      `
      )
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true });

    if (error) throw error;

    // Format messages for AI context
    return data.map((msg) => ({
      role: msg.sender === 'assistant' ? 'assistant' : 'user',
      content: msg.message,
      timestamp: msg.sent_at,
    }));
  } catch (error) {
    console.error('Error fetching full message history:', error);
    throw error;
  }
};

// * Get message history for a conversation (last 10 messages)
export const getMessageHistory = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(
        `
        message_id,
        message,
        sender,
        sent_at,
        conversation_id
      `
      )
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Format messages for AI context
    return data.reverse().map((msg) => ({
      role: msg.sender === 'assistant' ? 'assistant' : 'user',
      content: msg.message,
      timestamp: msg.sent_at,
    }));
  } catch (error) {
    console.error('Error fetching message history:', error);
    throw error;
  }
};

// * Save a message to the conversation
export const saveMessage = async (
  conversationId,
  message,
  isAssistant = false
) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          conversation_id: conversationId,
          sender: isAssistant ? 'assistant' : 'user',
          message: message,
          sent_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// * Create a new conversation
export const createConversation = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          user_id: userId,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// * Verify that a conversation exists and belongs to the user
export const verifyConversation = async (conversationId, userId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('conversation_id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error) return false;
    return true;
  } catch (error) {
    return false;
  }
};

// * Get conversation by ID
export const getConversationById = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('conversation_id', conversationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

// * updated conversation title
// export const updateConversation = async (conversationId, conversationData) => {
//   try {
//     const { data, error } = await supabase
//       .from('conversations')
//       .update(conversationData)
//       .eq('conversation_id', conversationId)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error updating conversation:', error);
//     throw error;
//   }
// };

// * Update conversation title or other fields
export const updateConversation = async (conversationId, updatedFields) => {
  try {
    // Step 1: Retrieve the existing conversation
    const existingConversation = await getConversationById(conversationId);

    // Step 2: Merge existing conversation with updated fields
    const mergedConversation = { ...existingConversation, ...updatedFields };

    // Step 3: Update the conversation
    const { data: updatedConversation, error: updateError } = await supabase
      .from('conversations')
      .update(mergedConversation)
      .eq('conversation_id', conversationId)
      .select()
      .single();

    if (updateError)
      throw new Error(`Failed to update conversation: ${updateError.message}`);

    return updatedConversation;
  } catch (error) {
    console.error('Error updating conversation:', error.message);
    throw error;
  }
};

//
// HELPERS
//

// * Clean and parse AI response to ensure valid JSON
export const cleanAndParseAIResponse = (response) => {
  try {
    // First try parsing as-is
    try {
      return JSON.parse(response);
    } catch (e) {
      // If direct parsing fails, clean the response
      let cleanedResponse = response;

      // Remove markdown code blocks if present
      if (cleanedResponse.includes('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n/g, '');
        cleanedResponse = cleanedResponse.replace(/```\n/g, '');
        cleanedResponse = cleanedResponse.replace(/```/g, '');
      }

      // Remove any leading/trailing whitespace
      cleanedResponse = cleanedResponse.trim();

      // Try parsing the cleaned response
      try {
        return JSON.parse(cleanedResponse);
      } catch (e) {
        // If still fails, try finding JSON object within the string
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Unable to parse AI response as JSON');
      }
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
    // Return a fallback response
    return {
      message:
        'I apologize, but I encountered an error processing the response. Could you please try again?',
      actions: [],
    };
  }
};
