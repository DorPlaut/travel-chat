import React, { useEffect } from 'react';
import Login from './Login';
import { useUserStore } from '../../../store/userStore';
import { getUserData, logOutUser } from '../../../utils/userHandler';
import { useChatsStore } from '../../../store/chatsStore';
import { useDataStore } from '../../../store/dataStore';
import { useSnackbar } from 'notistack';
import { Box, Button, Typography } from '@mui/material';

/**
 * User Button Component.
 * Handles user authentication, logout, and welcome message.
 */
const UserBtn = () => {
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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUserData(userData);
          await Promise.all([
            getUserConversations(userData.user_id),
            getTrips(userData.user_id),
            getEvents(userData.user_id),
          ]);
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
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="h6">Welcome, {userData.user_name}</Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  ) : (
    <Login />
  );
};

export default UserBtn;
