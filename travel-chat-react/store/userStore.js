// import { create } from 'zustand';

// export const useUserStore = create((set) => ({
//   userData: null,
//   setUserData: (userData) => set({ userData }),
//   clearUserData: () => set({ userData: null }),
// }));

import { create } from 'zustand';

/**
 * User store for managing user-related state and actions.
 */
export const useUserStore = create((set) => ({
  // State
  userData: null,

  // Actions
  /**
   * Sets the user data state directly.
   * @param {Object} userData - The user data to set.
   */
  setUserData: (userData) => set({ userData }),

  /**
   * Clears the user data state (logs out the user).
   */
  clearUserData: () => set({ userData: null }),
}));
