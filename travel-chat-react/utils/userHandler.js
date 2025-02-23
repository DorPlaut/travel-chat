import axios from 'axios';

// Server URL from environment variables
const serveUrl = import.meta.env.VITE_SERVER_URL;

/**
 * Fetches user data using the auth cookie.
 * @returns {Object|null} - The user data or null if an error occurs.
 */
export const getUserData = async () => {
  try {
    const response = await axios.get(`${serveUrl}/api/auth/me`, {
      withCredentials: true,
    });
    if (response.data.user) {
      return response.data.user;
    } else {
      console.error('User data not found in the response');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return null;
  }
};

/**
 * Logs out the user.
 * @returns {boolean} - True if successful, false if an error occurs.
 */
export const logOutUser = async () => {
  try {
    const response = await axios.post(
      `${serveUrl}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error during logout:', error.message);
    return false;
  }
};
