import {
  Box,
  Button,
  Grid,
  Typography,
  useTheme,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/userStore';

const HomePage = () => {
  const theme = useTheme();
  const { userData } = useUserStore();

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

            <motion.div variants={itemVariants} style={{ marginTop: 32 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Trips
              </Typography>
              {/* Add your recent chats list here */}
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
