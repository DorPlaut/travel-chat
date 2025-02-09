import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Login = () => {
  const handleLoginClick = () => {
    // Redirect to the backend to start the OAuth flow
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="h6">Please log in to use the app</Typography>
      <Button variant="contained" color="secondary" onClick={handleLoginClick}>
        login
      </Button>
    </Box>
    // <Button
    //   variant="contained"
    //   color="primary"
    //   onClick={handleLoginClick}
    //   sx={{ width: '200px' }}
    // >
    //   Login with Google
    // </Button>
  );
};

export default Login;
