import { create } from 'zustand';
import { fetchConversations, fetchMessages } from '../utils/chatHandler';

export const useChatsStore = create((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),

  getUserConversations: async (userId) => {
    try {
      // get user conversations
      const conversations = await fetchConversations(userId);

      set({ conversations });
    } catch (error) {
      console.error('Error fetching user conversations:', error);
    }
  },

  populateConversations: async (conversationId) => {
    try {
      const conversations = await fetchMessages(conversationId);
      // add messageHistory to conversation
      set((state) => ({
        conversations: state.conversations.map((conversation) => {
          if (conversation.id === conversationId) {
            return { ...conversation, messageHistory: conversations };
          }
          console.log(conversation);

          return conversation;
        }),
      }));
    } catch (error) {
      console.error('Error fetching user conversations:', error);
    }
  },
}));
