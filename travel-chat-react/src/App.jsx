import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import AuthSuccess from './AuthSuccess';
import UserBtn from './UserBtn';
import TripList from './components/TripList';
import TripDetails from './components/TripDetails';
import NewTrip from './components/NewTrip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import SideDrawer from './components/SideDrawer';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Trips from './pages/Trips';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e293b',
    },
    secondary: {
      main: '#f43f5e',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh' }}>
          {/* Side Drawer */}
          <SideDrawer />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Top App Bar */}
            <AppBar
              position="sticky"
              elevation={1}
              color="primary"
              sx={{ height: '3.5rem' }}
            >
              <Toolbar
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant="h1" color="inherit">
                  AI Chat Travel Planner
                </Typography>
                <UserBtn />
              </Toolbar>
            </AppBar>

            {/* Page Content */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <Typography variant="h2" sx={{ textAlign: 'center' }}>
                      Welcome to the AI Chat Travel Planner
                    </Typography>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/auth-success" element={<AuthSuccess />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/trips/:tripId" element={<TripDetails />} />
                <Route path="/trips/new" element={<NewTrip />} />
                <Route path="/calendar" element={<Calendar />} />

                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:conversationId" element={<Chat />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
