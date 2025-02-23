// import axios from 'axios';
// const serveUrl = import.meta.env.VITE_SERVER_URL;

// // Get user data using auth cookie
// export const getUserData = async () => {
//   try {
//     // console.log('auth find user req ', serveUrl);
//     const response = await axios.get(`${serveUrl}/api/auth/me`, {
//       withCredentials: true, // Send cookies
//     });
//     if (response.data.user) {
//       const userData = response.data.user;
//       return userData;
//     } else {
//       console.error('User data not found in the response');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     return null;
//   }
// };

// // Logout user
// export const logOutUser = async () => {
//   try {
//     const response = await axios.post(
//       `${serveUrl}/api/auth/logout`,
//       {},
//       { withCredentials: true }
//     );
//     if (response.status === 200) {
//       return true;
//     } else {
//       console.error('Logout failed');
//       return false;
//     }
//   } catch (error) {
//     console.error('Error during logout:', error);
//     return false;
//   }
// };

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
