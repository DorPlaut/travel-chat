import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
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
import { useDataStore } from '../../store/dataStore';
import { useSnackbar } from 'notistack';
import { TypeAnimation } from 'react-type-animation';

/**
 * Chat Window Component.
 * Enhanced version with loading states, typing animation, and improved input handling.
 */
const ChatWindow = ({ paramsConversationId }) => {
  const { enqueueSnackbar } = useSnackbar();

  // Global state
  const { getUserConversations } = useChatsStore();
  const { userData } = useUserStore();
  const { trips, getTrips, events, getEvents, setTrips, setEvents } =
    useDataStore();

  // Local state
  const [conversationId, setConversationId] = useState(paramsConversationId);
  const [messages, setMessages] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [input, setInput] = useState('');
  const [conversationTitle, setConversationTitle] =
    useState('New conversation');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState('');

  // Refs
  const messagesEndRef = useRef(null);
  const textFieldRef = useRef(null);

  /**
   * Toggles the drawer's open/close state on mobile devices.
   */
  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  /**
   * Update all data after AI actions
   */
  const handleData = async () => {
    if (userData?.user_id) {
      await Promise.all([
        getTrips(userData.user_id),
        getEvents(userData.user_id),
        getUserConversations(userData.user_id),
      ]);
    } else {
      setTrips([]);
      setEvents([]);
    }
  };

  /**
   * Scrolls to the bottom of the chat
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Handles text input with Shift+Enter support
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Auto-resize textarea based on content
   */
  const adjustTextFieldHeight = () => {
    if (textFieldRef.current) {
      textFieldRef.current.style.height = 'auto';
      textFieldRef.current.style.height = `${textFieldRef.current.scrollHeight}px`;
    }
  };

  /**
   * Simulates typing animation for AI responses
   */
  const simulateTyping = async (content) => {
    setIsTyping(true);
    setCurrentTypingMessage('');

    // Split content into chunks for typing animation
    const words = content.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust speed as needed
      setCurrentTypingMessage(
        (prev) => `${prev}${i > 0 ? ' ' : ''}${words[i]}`
      );
    }

    setIsTyping(false);
    return content;
  };

  /**
   * Fetches messages and conversation details
   */
  const populateMessages = async () => {
    setIsLoading(true);
    try {
      if (!paramsConversationId) {
        const welcomeMessage = `**Hey there!** 👋\n\nI'm your AI travel assistant, here to help you plan the perfect trip. Whether it's a weekend getaway or a dream vacation, I've got you covered!\n\nLet's get started - where would you like to go, and when? 🌍✈️`;
        await simulateTyping(welcomeMessage);
        setMessages([
          {
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date(),
          },
        ]);
        setConversationId(null);
        setConversationTitle('New conversation');
        setTripId(null);
        return;
      }

      const [fetchedMessages, conversation] = await Promise.all([
        fetchMessages(paramsConversationId),
        fetchConversation(paramsConversationId),
      ]);

      if (conversation.trip_id) {
        setTripId(conversation.trip_id);
      }
      setConversationTitle(
        conversation.conversation_title || 'New conversation'
      );
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
      enqueueSnackbar('Failed to load conversation', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles sending a message
   */
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    adjustTextFieldHeight();
    setIsLoading(true);

    try {
      const aiResponse = await sendChatMessage(
        userData.user_id,
        userMessage.content,
        tripId,
        conversationId
      );

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      if (aiResponse.executedActions?.length > 0) {
        await handleData();
      }

      await simulateTyping(aiResponse.message);

      const aiMessage = {
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setConversationId(aiResponse.conversationId);

      if (aiResponse.executedActions.length > 0 || !aiResponse.conversationId) {
        await getUserConversations(userData.user_id);
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
      enqueueSnackbar('Failed to send message', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    populateMessages();
  }, [paramsConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTypingMessage]);

  useEffect(() => {
    adjustTextFieldHeight();
  }, [input]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        height: '100%',
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Chat Header */}
      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={{
          textAlign: 'center',
          padding: '1rem',
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
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {isLoading && messages.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                width: 'fit-content',
              }}
            >
              <Box
                sx={{
                  padding: '1rem',
                  borderRadius: '1rem',
                  backgroundColor: message.role === 'user' ? '#1976d2' : '#fff',
                  color: message.role === 'user' ? '#fff' : '#000',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children }) => <Typography>{children}</Typography>,
                    strong: ({ children }) => (
                      <Typography component="span" fontWeight="bold">
                        {children}
                      </Typography>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: message.role === 'user' ? 'right' : 'left',
                    color:
                      message.role === 'user'
                        ? 'rgba(255,255,255,0.7)'
                        : 'rgba(0,0,0,0.5)',
                    mt: 1,
                  }}
                >
                  {format(new Date(message.timestamp), 'HH:mm')}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              alignSelf: 'flex-start',
              maxWidth: '70%',
            }}
          >
            <Box
              sx={{
                padding: '1rem',
                borderRadius: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {currentTypingMessage}
              </ReactMarkdown>
            </Box>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#fff',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <TextField
          multiline
          maxRows={4}
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message... (Shift + Enter for new line)"
          inputRef={textFieldRef}
          disabled={isLoading}
          sx={{
            backgroundColor: '#f5f5f5',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          sx={{
            borderRadius: '12px',
            // minWidth: '100px',
            // height: '56px',
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
