import { create } from 'zustand';

export const useLayoutStore = create((set) => ({
  // page
  page: 'home',
  setPage: (page) => set(() => ({ page })),

  // mouse position
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (mousePosition) => set(() => ({ mousePosition })),
  // loading

  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading })),

  // screen resolution
  screenResolution: { width: 0, height: 0 },
  setScreenResolution: (screenResolution) => set(() => ({ screenResolution })),

  isFirstLoad: false,
  setIsFirstLoad: (isFirstLoad) => set(() => ({ isFirstLoad })),

  // mobile
  isMobile: false,
  setIsMobile: (isMobile) => set(() => ({ isMobile })),

  isSearchBarOpen: false,
  setIsSearchBarOpen: (isSearchBarOpen) => set(() => ({ isSearchBarOpen })),

  // menu
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set(() => ({ isMenuOpen })),

  // cart
  isCartOpen: false,
  setIsCartOpen: (isCartOpen) => set(() => ({ isCartOpen })),

  // alerts
  alert: { status: 'danger', message: 'alert' },
  setAlert: (alert) => set(() => ({ alert })),

  alertAnimation: '',

  handleAlerts: (status, message) => {
    set(() => ({
      alert: { status, message },
      alertAnimation: 'animation-fade-in-fast',
    }));
    setTimeout(() => {
      set(() => ({
        alertAnimation: 'animation-fade-out-fast',
      }));
      setTimeout(() => {
        set(() => ({
          alert: { status: '', message: '' },
          alertAnimation: '',
        }));
      }, 3000);
    }, 3000);
  },

  isAnimating: true,
  setIsAnimating: (isAnimating) => set(() => ({ isAnimating })),
}));
