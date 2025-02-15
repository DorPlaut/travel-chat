import axios from 'axios';
const serveUrl = import.meta.env.VITE_SERVER_URL;

// Send a message to the AI chat
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
    console.error('Error sending chat message:', error);
    return null;
  }
};

// Fetch conversations for a user
export const fetchConversations = async (userId) => {
  try {
    const response = await axios.get(`${serveUrl}/api/chat/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return null;
  }
};

// fetch single convarsation by id
export const fetchConversation = async (conversationId) => {
  try {
    const response = await axios.get(
      `${serveUrl}/api/conversation/${conversationId}`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }
};

// Fetch messages for a specific conversation
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
    console.error('Error fetching messages:', error);
    return null;
  }
};

// Delete conversation
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axios.delete(
      `${serveUrl}/api/conversation/${conversationId}`,
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return null;
  }
};
