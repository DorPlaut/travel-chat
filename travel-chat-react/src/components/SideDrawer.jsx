import React, { useState } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import HikingOutlinedIcon from '@mui/icons-material/HikingOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useChatsStore } from '../../store/chatsStore';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { deleteConversation } from '../../utils/chatHandler';
import { useUserStore } from '../../store/userStore';

const SideDrawer = () => {
  // global state
  const { conversations, setConversations, getUserConversations } =
    useChatsStore();
  const { userData } = useUserStore();
  const [isOpen, setIsOpen] = useState(true);

  // alerts
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // limit titles to 20 char
  const LimitedTitle = (title) => {
    if (title.length > 15) {
      title = title.substring(0, 15) + '...';
    }

    return title;
  };

  // delete conversation and trip
  const handleDelete = (conversationId) => {
    enqueueSnackbar(
      'This will remove the chat, trip and all events related to it. Are you sure you want to proceed?',
      {
        variant: 'warning',
        persist: true, // Keeps the alert open until user interacts
        action: (snackbarId) => (
          <>
            <Button
              onClick={async () => {
                try {
                  await deleteConversation(conversationId);
                  closeSnackbar(snackbarId);
                  // update global state
                  await getUserConversations(userData.user_id);
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
          <ListItem
            key={'new-chat'}
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
              to={`/chat/new`}
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
          {conversations.length > 0 &&
            conversations.map((conversation) => (
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
                  {isOpen &&
                    (conversation.conversation_title ? (
                      <ListItemText
                        primary={LimitedTitle(conversation.conversation_title)}
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    ) : (
                      <ListItemText primary={'No Title'} />
                    ))}
                </Link>
                {/* delete btn */}
                {isOpen && (
                  <ListItemButton
                    onClick={() => {
                      handleDelete(conversation.conversation_id);
                    }}
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

        {/* Footer actions */}
        <List>
          <ListItem
            key={'trips'}
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
              to={`/trips`}
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

          <ListItem
            key={'calendar'}
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
              to={`/calendar`}
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
