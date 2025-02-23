import React from 'react';
import { Box, Button, Typography } from '@mui/material';

// Server URL from environment variables
const serveUrl = import.meta.env.VITE_SERVER_URL;

/**
 * Login Component.
 * Provides a login button for Google authentication.
 */
const Login = () => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="h6">Please log in to use the app</Typography>
      <Button
        variant="contained"
        color="secondary"
        href={`${serveUrl}/api/auth/google`}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
