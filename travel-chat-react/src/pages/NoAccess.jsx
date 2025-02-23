import { Box, Button, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
const serveUrl = import.meta.env.VITE_SERVER_URL;

const NoAccess = () => {
  const theme = useTheme();
  const handleLoginClick = () => {
    // Redirect to the backend to start the OAuth flow
    window.location.href = `${serveUrl}/api/auth/google`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Welcome to AI Chat Travel Planner
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: theme.palette.text.secondary }}
        >
          Please log in to start planning your next adventure with AI assistance
        </Typography>
        <Button
          variant="contained"
          size="large"
          href={`${serveUrl}/api/auth/google`}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          Login to Continue
        </Button>
      </motion.div>
    </Box>
  );
};

export default NoAccess;
