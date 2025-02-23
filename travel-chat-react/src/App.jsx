import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useUserStore } from '../store/userStore';

// Components
import Login from './components/user/Login';
import AuthSuccess from './AuthSuccess';
import UserBtn from './components/user/UserBtn';
import SideDrawer from './components/SideDrawer';

// Pages
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Trips from './pages/Trips';
import TripDetailsPage from './pages/TripDetailsPage';
import HomePage from './pages/HomePage';
import NoAccess from './pages/NoAccess';

// Theme Configuration
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

/**
 * Main Application Component.
 * Handles routing, theme, and overall layout.
 */
function App() {
  const { userData } = useUserStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SnackbarProvider maxSnack={3}>
          <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Side Drawer */}
            <SideDrawer />

            {/* Main Content Area */}
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
                  {/* App Title */}
                  <Link
                    to="/"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Typography variant="h1" color="inherit">
                      AI Chat Travel Planner
                    </Typography>
                  </Link>
                  {/* User Button */}
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
                {!userData && <NoAccess />}
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth-success" element={<AuthSuccess />} />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={userData ? <HomePage /> : <NoAccess />}
                  />
                  <Route
                    path="/trips"
                    element={userData ? <Trips /> : <NoAccess />}
                  />
                  <Route
                    path="/trips/:tripId"
                    element={userData ? <TripDetailsPage /> : <NoAccess />}
                  />

                  <Route
                    path="/calendar"
                    element={userData ? <Calendar /> : <NoAccess />}
                  />
                  <Route
                    path="/chat"
                    element={userData ? <Chat /> : <NoAccess />}
                  />
                  <Route
                    path="/chat/:conversationId"
                    element={userData ? <Chat /> : <NoAccess />}
                  />
                </Routes>
              </Box>
            </Box>
          </Box>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
