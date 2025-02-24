import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Tooltip,
  Button,
  ListItemButton,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import HikingOutlinedIcon from '@mui/icons-material/HikingOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { deleteConversation } from '../../utils/chatHandler';
import { useUserStore } from '../../store/userStore';
import { useChatsStore } from '../../store/chatsStore';
import { useDataStore } from '../../store/dataStore';

/**
 * SideDrawer Component.
 * Handles the sidebar navigation, including conversations, trips, and calendar links.
 */
const SideDrawer = () => {
  // Router
  const navigate = useNavigate();
  const location = useLocation();
  // Global state
  const { conversations, getUserConversations } = useChatsStore();
  const { userData } = useUserStore();
  const { getTrips, getEvents } = useDataStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Local state
  const [isOpen, setIsOpen] = useState(true);

  /**
   * Handle data updates and sync with app global state
   */
  const handleData = async () => {
    if (userData?.user_id) {
      await getTrips(userData.user_id);
      await getEvents(userData.user_id);
      await getUserConversations(userData.user_id);
    } else {
      setTrips([]);
      setEvents([]);
    }
  };

  /**
   * Toggles the drawer's open/close state on mobile devices.
   */
  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  // Optional: Auto-close/open when screen size changes
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);
  /**
   * Toggles the drawer's open/close state.
   */
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Limits the conversation title to 15 characters.
   * @param {string} title - The conversation title.
   * @returns {string} - The truncated title.
   */
  const limitedTitle = (title) => {
    return title.length > 15 ? `${title.substring(0, 15)}...` : title;
  };

  /**
   * Handles the deletion of a conversation.
   * @param {string} conversationId - The ID of the conversation to delete.
   */
  const handleDelete = (conversationId) => {
    enqueueSnackbar(
      'This will remove the chat, trip, and all related events. Are you sure you want to proceed?',
      {
        variant: 'warning',
        persist: true,
        action: (snackbarId) => (
          <>
            <Button
              onClick={async () => {
                try {
                  await deleteConversation(conversationId);
                  closeSnackbar(snackbarId);
                  await handleData();

                  // Check if we're on the specific conversation route
                  if (location.pathname.includes(`/chat/${conversationId}`)) {
                    navigate('/chat');
                  }

                  enqueueSnackbar('Conversation deleted successfully', {
                    variant: 'success',
                  });
                } catch (error) {
                  console.error('Error deleting conversation:', error);
                  enqueueSnackbar('Error deleting conversation', {
                    variant: 'error',
                  });
                }
              }}
              color="inherit"
            >
              Confirm
            </Button>
            <Button onClick={() => closeSnackbar(snackbarId)} color="inherit">
              Cancel
            </Button>
          </>
        ),
      }
    );
  };

  return (
    <Box display="flex" height="100vh">
      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? '16rem' : '4rem',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? '16rem' : '4rem',
            boxSizing: 'border-box',
            transition: 'width 0.3s ease-in-out',
            overflow: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={isOpen ? 'space-between' : 'center'}
          px={2}
          py={1}
          color="primary"
          sx={{ height: '3.5rem' }}
        >
          {isOpen && <Typography variant="h6">Conversations</Typography>}
          <Tooltip title={isOpen ? 'Minimize' : 'Expand'}>
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        {/* List of conversations */}
        <List>
          {/* New Chat Link */}
          <ListItem
            key="new-chat"
            sx={{
              height: '3rem',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
              },
            }}
          >
            <Link
              to="/chat/new"
              style={{
                display: 'flex',
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
              }}
            >
              <ListItemIcon
                style={{
                  width: '4rem',
                  transform: 'translateX(-0.5rem)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <AddCommentOutlinedIcon />
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary="New Chat"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                />
              )}
            </Link>
          </ListItem>

          {/* Conversations List */}
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.conversation_id}
              sx={{
                height: '3rem',
                gap: '0.5rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  cursor: 'pointer',
                },
              }}
            >
              <Link
                to={`/chat/${conversation.conversation_id}`}
                style={{
                  display: 'flex',
                  textDecoration: 'none',
                  color: 'inherit',
                  width: '100%',
                }}
              >
                <ListItemIcon
                  style={{
                    width: '4rem',
                    transform: 'translateX(-0.5rem)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ChatBubbleOutlineIcon />
                </ListItemIcon>
                {isOpen && (
                  <ListItemText
                    primary={
                      conversation.conversation_title
                        ? limitedTitle(conversation.conversation_title)
                        : 'No Title'
                    }
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                )}
              </Link>

              {/* Delete Button */}
              {isOpen && (
                <ListItemButton
                  onClick={() => handleDelete(conversation.conversation_id)}
                  variant="contained"
                  sx={{
                    position: 'absolute',
                    right: '0.25rem',
                    borderRadius: '50%',
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: 'Highlight',
                    },
                  }}
                >
                  <ListItemIcon
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ClearIcon />
                  </ListItemIcon>
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mt: 'auto' }} />

        {/* Footer Navigation Links */}
        <List>
          {/* Trips Link */}
          <ListItem
            key="trips"
            sx={{
              height: '3rem',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
              },
            }}
          >
            <Link
              to="/trips"
              style={{
                display: 'flex',
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
              }}
            >
              <ListItemIcon
                style={{
                  width: '4rem',
                  transform: 'translateX(-0.5rem)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <HikingOutlinedIcon />
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary="Trips"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                />
              )}
            </Link>
          </ListItem>

          {/* Calendar Link */}
          <ListItem
            key="calendar"
            sx={{
              height: '3rem',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
              },
            }}
          >
            <Link
              to="/calendar"
              style={{
                display: 'flex',
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
              }}
            >
              <ListItemIcon
                style={{
                  width: '4rem',
                  transform: 'translateX(-0.5rem)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CalendarMonthOutlinedIcon />
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary="Calendar"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                />
              )}
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
