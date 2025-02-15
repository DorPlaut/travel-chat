import React, { useEffect } from 'react';
import Login from './Login';
import { useUserStore } from '../store/userStore';
import { getUserData, logOutUser } from '../utils/userHandler';
import { Button, Typography, Box } from '@mui/material';
import { useChatsStore } from '../store/chatsStore';
import { useSnackbar } from 'notistack';

const UserBtn = () => {
  // global state
  const { userData, setUserData, clearUserData } = useUserStore();
  const { getUserConversations } = useChatsStore();
  // alerts
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUserData(userData);
          getUserConversations(userData.user_id);
          enqueueSnackbar(`Welcome ${userData.user_name}!`, {
            variant: 'success',
          });
        } else {
          clearUserData();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        clearUserData();
      }
    };

    if (!userData) {
      fetchUserData();
    }
  }, [userData, setUserData, clearUserData]);

  const handleLogout = async () => {
    try {
      const logoutSuccess = await logOutUser();
      if (logoutSuccess) {
        clearUserData();
        enqueueSnackbar('Logged out successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error during logout:', error);
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
