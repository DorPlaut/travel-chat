import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useChatsStore } from '../../store/chatsStore';
import {
  fetchConversation,
  fetchMessages,
  sendChatMessage,
} from '../../utils/chatHandler';
import { useUserStore } from '../../store/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { format } from 'date-fns';

const ChatWindow = ({ paramsConversationId }) => {
  // Global state
  const { getUserConversations } = useChatsStore();
  const { userData } = useUserStore();

  // Local state
  const [conversationId, setConversationId] = useState(paramsConversationId);
  const [messages, setMessages] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [input, setInput] = useState('');
  const [conversationTitle, setConversationTitle] =
    useState('New conversation');

  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages and conversation details
  const populateMessages = async () => {
    if (paramsConversationId) {
      setConversationId(paramsConversationId);
    }
    if (!paramsConversationId) {
      setMessages([]);
      setConversationId(null);
      setConversationTitle('New conversation');
      setTripId(null);
      return;
    }

    try {
      const fetchedMessages = await fetchMessages(paramsConversationId);
      const conversation = await fetchConversation(paramsConversationId);

      if (conversation.trip_id) {
        setTripId(conversation.trip_id);
      }
      if (conversation.conversation_title) {
        setConversationTitle(conversation.conversation_title);
      } else {
        setConversationTitle('New conversation');
      }

      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    populateMessages();
  }, [paramsConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = {
        role: 'user',
        content: input,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');

      try {
        const aiResponse = await sendChatMessage(
          userData.user_id,
          input.trim(),
          tripId,
          conversationId
        );

        const aiMessage = {
          role: 'assistant',
          content: aiResponse.message,
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        setConversationId(aiResponse.conversationId);

        if (
          aiResponse.executedActions.length > 0 ||
          !aiResponse.conversationId
        ) {
          getUserConversations(userData.user_id);
          if (aiResponse.conversationId) {
            const updatedConversation = await fetchConversation(
              aiResponse.conversationId
            );
            setConversationTitle(updatedConversation.conversation_title);
            if (updatedConversation.trip_id) {
              setTripId(updatedConversation.trip_id);
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          textAlign: 'center',
          padding: '0.5rem',
          backgroundColor: '#1976d2',
          color: '#fff',
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {conversationTitle}
        </Typography>
      </Box>

      {/* Messages List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <AnimatePresence>
          {messages.map((message, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  alignSelf:
                    message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  width: 'fit-content', // Add this
                }}
              >
                <Box
                  sx={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor:
                      message.role === 'user' ? '#1976d2' : '#e0e0e0',
                    color: message.role === 'user' ? '#fff' : '#000',
                    boxShadow: 1,
                  }}
                >
                  {/* time stamp */}
                  {message.timestamp && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: message.role === 'user' ? 'right' : 'left',
                        color:
                          message.role === 'user'
                            ? 'rgba(255,255,255,0.7)'
                            : 'rgba(0,0,0,0.5)',
                        mt: 0.5,
                      }}
                    >
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </Typography>
                  )}
                  {/* message */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      strong: ({ node, ...props }) => (
                        <Typography
                          component="span"
                          sx={{ fontWeight: 'bold' }}
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li style={{ marginBottom: '0.25rem' }}>
                          <Typography component="span" {...props} />
                        </li>
                      ),
                      p: ({ node, ...props }) => (
                        <Typography
                          paragraph
                          sx={{ marginBottom: '0.5rem' }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          display: 'flex',
          gap: '0.5rem',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          sx={{ backgroundColor: '#fff' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!input.trim()}
          sx={{ borderRadius: '8px' }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
