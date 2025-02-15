import axios from 'axios';
const serveUrl = import.meta.env.VITE_SERVER_URL;

// Get user data using auth cookie
export const getUserData = async () => {
  try {
    console.log('auth find user req ', serveUrl);
    const response = await axios.get(`${serveUrl}/api/auth/me`, {
      withCredentials: true, // Send cookies
    });
    if (response.data.user) {
      const userData = response.data.user;
      console.log(response);
      return userData;
    } else {
      console.error('User data not found in the response');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Logout user
export const logOutUser = async () => {
  try {
    const response = await axios.post(
      `${serveUrl}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error('Logout failed');
      return false;
    }
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};
