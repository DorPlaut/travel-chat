import React, { useEffect } from 'react';
import Login from './Login';
import { useUserStore } from '../../../store/userStore';
import { getUserData, logOutUser } from '../../../utils/userHandler';
import { useChatsStore } from '../../../store/chatsStore';
import { useDataStore } from '../../../store/dataStore';
import { useSnackbar } from 'notistack';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';

const serveUrl = import.meta.env.VITE_SERVER_URL;

/**
 * User Button Component.
 * Handles user authentication, logout, and welcome message.
 */
const UserBtn = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  // Global state
  const { userData, setUserData, clearUserData } = useUserStore();
  const { getUserConversations, setConversations } = useChatsStore();
  const { setTrips, getTrips, setEvents, getEvents } = useDataStore();
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Cleans up user-related data (conversations, trips, events).
   */
  const cleanData = () => {
    setUserData(null);
    clearUserData();
    setConversations([]);
    setTrips([]);
    setEvents([]);
  };

  /**
   * Fetches and sets user data on component mount.
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUserData(userData);
          await handleData();
          enqueueSnackbar(`Welcome ${userData.user_name}!`, {
            variant: 'success',
          });
        } else {
          cleanData();
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        cleanData();
      }
    };

    if (!userData) {
      fetchUserData();
    }
  }, [userData, setUserData, clearUserData]);

  /**
   * Handles user logout.
   */
  const handleLogout = async () => {
    try {
      const logoutSuccess = await logOutUser();
      if (logoutSuccess) {
        cleanData();
        enqueueSnackbar('Logged out successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return userData ? (
    <Box display="flex" alignItems="center" gap={1} height="75%">
      {!isMobile && (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Hi, {userData.user_name}
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        size={isMobile ? 'small' : 'medium'}
        sx={{
          minWidth: 'auto',
          px: isMobile ? 1.5 : 2,
        }}
      >
        {isMobile ? 'Logout' : 'Sign Out'}
      </Button>
    </Box>
  ) : (
    <Box display="flex" alignItems="center" gap={1}>
      {!isMobile && <Typography variant="body2">Get Started</Typography>}
      <Button
        variant="contained"
        color="secondary"
        href={`${serveUrl}/api/auth/google`}
        size={isMobile ? 'small' : 'medium'}
        sx={{
          minWidth: 'auto',
          px: isMobile ? 1.5 : 2,
        }}
      >
        {isMobile ? 'Login' : 'Continue with Google'}
      </Button>
    </Box>
  );
};

export default UserBtn;
