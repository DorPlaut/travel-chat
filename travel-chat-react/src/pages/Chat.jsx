import React, { useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import { Link, useParams, Router } from 'react-router-dom';
import { useChatsStore } from '../../store/chatsStore';
import { Box, Button, ListItemIcon, Typography } from '@mui/material';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';

const Chat = () => {
  const { conversationId } = useParams();

  return (
    <>
      {conversationId ? (
        <ChatWindow
          paramsConversationId={
            conversationId === 'new' ? null : conversationId
          }
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <Link to={`/chat/new`}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '8px',
                  p: 2,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <AddCommentOutlinedIcon />
                </ListItemIcon>
                <Typography> Start a new conversation</Typography>
              </Button>
            </Link>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chat;
