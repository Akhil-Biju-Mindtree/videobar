import { of } from 'rxjs';

export const AuthServiceMock = {
  isCacheInitialized: false,
  password: '',
  isAuthenticated: false,
  /**
   * This method subscribes for password and authentication status changes
   * Typically, this method should be invoked as soon as the application initialized
   * Do not call this method more than once
   */
  subscribeCredentials: () => {},

  /**
   * It provides admin password string
   */
  getPassword: () => {
    return this.password;
  },

  /**
   * It provides status of admin login at a given point in time
   */
  IsAuthenticated: () => {
    return this.isAuthenticated;
  },

  setAdminAccess: (permission: boolean) => {},

  /**
   * This method provides observable that will emit the admin access as and when it is changed
   */
  subscribeAdminAuth: () => {
    return of('');
  },

  initializeCache: () => {},

  subscribeAllDeviceComponent: () => {},

  retrieveAllDeviceComponent: () => {},

  login: (value) => {
    return of(true);
  },
};
