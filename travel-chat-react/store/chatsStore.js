// import { create } from 'zustand';
// import { fetchConversations, fetchMessages } from '../utils/chatHandler';

// export const useChatsStore = create((set) => ({
//   conversations: [],
//   setConversations: (conversations) => set({ conversations }),

//   getUserConversations: async (userId) => {
//     try {
//       // get user conversations
//       const conversations = await fetchConversations(userId);

//       set({ conversations });
//     } catch (error) {
//       console.error('Error fetching user conversations:', error);
//     }
//   },

//   populateConversations: async (conversationId) => {
//     try {
//       const conversations = await fetchMessages(conversationId);
//       // add messageHistory to conversation
//       set((state) => ({
//         conversations: state.conversations.map((conversation) => {
//           if (conversation.id === conversationId) {
//             return { ...conversation, messageHistory: conversations };
//           }
//           console.log(conversation);

//           return conversation;
//         }),
//       }));
//     } catch (error) {
//       console.error('Error fetching user conversations:', error);
//     }
//   },
// }));

import { create } from 'zustand';
import { fetchConversations, fetchMessages } from '../utils/chatHandler';

/**
 * Chat store for managing chat-related state and actions.
 */
export const useChatsStore = create((set) => ({
  // State
  conversations: [],

  // Actions
  /**
   * Sets the conversations state directly.
   * @param {Array} conversations - The list of conversations to set.
   */
  setConversations: (conversations) => set({ conversations }),

  /**
   * Fetches and updates the conversations for a user.
   * @param {string} userId - The ID of the user.
   */
  getUserConversations: async (userId) => {
    try {
      const conversations = await fetchConversations(userId);
      set({ conversations });
    } catch (error) {
      console.error('Error fetching user conversations:', error.message);
    }
  },

  /**
   * Fetches and populates messages for a specific conversation.
   * @param {string} conversationId - The ID of the conversation.
   */
  populateConversations: async (conversationId) => {
    try {
      const messages = await fetchMessages(conversationId);
      // Update the conversation with its message history
      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, messageHistory: messages }
            : conversation
        ),
      }));
    } catch (error) {
      console.error('Error populating conversation messages:', error.message);
    }
  },
}));
