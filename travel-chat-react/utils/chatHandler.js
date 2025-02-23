// import axios from 'axios';
// const serveUrl = import.meta.env.VITE_SERVER_URL;

// // Send a message to the AI chat
// export const sendChatMessage = async (
//   userId,
//   message,
//   tripId = null,
//   conversationId = null
// ) => {
//   try {
//     const response = await axios.post(
//       `${serveUrl}/api/chat`,
//       { userId, message, tripId, conversationId },
//       { withCredentials: true }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error sending chat message:', error);
//     return null;
//   }
// };

// // Fetch conversations for a user
// export const fetchConversations = async (userId) => {
//   try {
//     const response = await axios.get(`${serveUrl}/api/chat/${userId}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching conversations:', error);
//     return null;
//   }
// };

// // fetch single convarsation by id
// export const fetchConversation = async (conversationId) => {
//   try {
//     const response = await axios.get(
//       `${serveUrl}/api/conversation/${conversationId}`,
//       {
//         withCredentials: true,
//       }
//     );
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching conversation:', error);
//     return null;
//   }
// };

// // Fetch messages for a specific conversation
// export const fetchMessages = async (conversationId) => {
//   try {
//     const response = await axios.get(
//       `${serveUrl}/api/messages/${conversationId}`,
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     return null;
//   }
// };

// // Delete conversation
// export const deleteConversation = async (conversationId) => {
//   try {
//     const response = await axios.delete(
//       `${serveUrl}/api/conversation/${conversationId}`,
//       {
//         withCredentials: true,
//       }
//     );
//     return true;
//   } catch (error) {
//     console.error('Error deleting conversation:', error);
//     return null;
//   }
// };

import axios from 'axios';

// Server URL from environment variables
const serveUrl = import.meta.env.VITE_SERVER_URL;

/**
 * Sends a message to the AI chat.
 * @param {string} userId - The ID of the user sending the message.
 * @param {string} message - The message content.
 * @param {string|null} tripId - Optional trip ID associated with the message.
 * @param {string|null} conversationId - Optional conversation ID for context.
 * @returns {Object|null} - The response data or null if an error occurs.
 */
export const sendChatMessage = async (
  userId,
  message,
  tripId = null,
  conversationId = null
) => {
  try {
    const response = await axios.post(
      `${serveUrl}/api/chat`,
      { userId, message, tripId, conversationId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error.message);
    return null;
  }
};

/**
 * Fetches all conversations for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Array|null} - The list of conversations or null if an error occurs.
 */
export const fetchConversations = async (userId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/chat/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error.message);
    return null;
  }
};

/**
 * Fetches a single conversation by ID.
 * @param {string} conversationId - The ID of the conversation.
 * @returns {Object|null} - The conversation data or null if an error occurs.
 */
export const fetchConversation = async (conversationId) => {
  try {
    const response = await axios.get(
      `${serveUrl}/api/conversation/${conversationId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error.message);
    return null;
  }
};

/**
 * Fetches messages for a specific conversation.
 * @param {string} conversationId - The ID of the conversation.
 * @returns {Array|null} - The list of messages or null if an error occurs.
 */
export const fetchMessages = async (conversationId) => {
  try {
    const response = await axios.get(
      `${serveUrl}/api/messages/${conversationId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    return null;
  }
};

/**
 * Deletes a conversation by ID.
 * @param {string} conversationId - The ID of the conversation to delete.
 * @returns {boolean} - True if successful, null if an error occurs.
 */
export const deleteConversation = async (conversationId) => {
  try {
    await axios.delete(`${serveUrl}/api/conversation/${conversationId}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error.message);
    return null;
  }
};
