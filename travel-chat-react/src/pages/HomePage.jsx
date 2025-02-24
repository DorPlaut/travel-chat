import {
  Box,
  Button,
  Grid,
  Typography,
  useTheme,
  Stack,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/userStore';

const HomePage = () => {
  const theme = useTheme();
  const { userData } = useUserStore();

  /**
   * Toggles the drawer's open/close state on mobile devices.
   */
  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
      <motion.div variants={containerVariants} initial="show" animate="show">
        <Box>
          <img
            src="/logo2.svg"
            alt="App Logo"
            style={{
              width: isMobile ? 150 : 300,
              height: isMobile ? 150 : 300,
              scale: '1.3',
              filter: 'blur(0.3px)',
              marginTop: isMobile ? 120 : 0,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              mt: 2,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            AI Chat Travel Planner
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Welcome back, {userData.user_name}!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Ready to continue planning your next adventure?
                  </Typography>
                  <Button
                    variant="contained"
                    href="/chat"
                    sx={{
                      textTransform: 'none',
                      px: 4,
                      borderRadius: 2,
                    }}
                  >
                    Start New Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[2] }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Travel Planning Tips
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant="body2">
                      • Start by describing your ideal trip to the AI assistant
                    </Typography>
                    <Typography variant="body2">
                      • Mention any specific preferences or constraints
                    </Typography>
                    <Typography variant="body2">
                      • Review suggested itineraries and refine as needed
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default HomePage;
