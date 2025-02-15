import React from 'react';
import { Box, Button, Typography } from '@mui/material';
const serveUrl = import.meta.env.VITE_SERVER_URL;

const Login = () => {
  const handleLoginClick = () => {
    // Redirect to the backend to start the OAuth flow
    window.location.href = `${serveUrl}/api/auth/google`;
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="h6">Please log in to use the app</Typography>
      <Button variant="contained" color="secondary" onClick={handleLoginClick}>
        login
      </Button>
    </Box>
  );
};

export default Login;
