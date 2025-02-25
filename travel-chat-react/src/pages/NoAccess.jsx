import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
const serveUrl = import.meta.env.VITE_SERVER_URL;

const NoAccess = () => {
  const theme = useTheme();
  const handleLoginClick = () => {
    // Redirect to the backend to start the OAuth flow
    window.location.href = `${serveUrl}/api/auth/google`;
  };
  /**
   * Toggles the drawer's open/close state on mobile devices.
   */
  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        // textAlign: 'center',
        height: '100%',
        // textAlign: 'center',
        px: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: '100%',
        }}
      >
        <img
          src="/logo2.svg"
          alt="App Logo"
          style={{
            width: isMobile ? 150 : 300,
            height: isMobile ? 150 : 300,
            scale: '1.3',
            filter: 'blur(0.3px)',
          }}
        />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, m: 1 }}>
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
    </Container>
  );
};

export default NoAccess;
