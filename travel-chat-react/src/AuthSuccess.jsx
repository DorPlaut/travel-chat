import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore'; // Zustand store
import axios from 'axios';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setUserData } = useUserStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
      // Fetch user data from backend
      axios
        .get(`http://localhost:3000/api/users/${userId}`, {
          withCredentials: true, // Send cookies automatically
        })
        .then((response) => {
          setUserData(response.data); // Save user data in Zustand
          console.log(response.data);

          setLoading(false);
          navigate('/'); // Redirect to dashboard
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setLoading(false);
          navigate('/login'); // Redirect back to login on error
        });
    } else {
      console.error('Missing user ID.');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate, setUserData]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="h6">
          Authentication Successful! Redirecting...
        </Typography>
      )}
    </Box>
  );
};

export default AuthSuccess;
