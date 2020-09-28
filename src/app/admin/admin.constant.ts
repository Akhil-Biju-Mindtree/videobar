export const ADMIN_CONST = {
  UUID: {
    SYSTEM_PASSWORD: '41d8625a-7ebb-4a44-87df-41524b446dcb',
  },
  TEXT: {
    INCORRECT_PASSWORD: 'e006',
    AUTO_LOGOUT_POPUP_TITLE: 'Inactivity warning',
    LOG_OUT: 'Log Out',
    CONTINUE: 'Continue',
    AUTO_LOGOUT_COMPONENT: 'AutoLogoutComponent',
    /** for 30 mins it is calulated as 1670 = 30x60 - 10(set_timeout) - 120(count_down)
     * now 86270 is added for 24 hrs
     * AUTO_LOGOUT_IDLE_TIME: 1670,
     * */
    AUTO_LOGOUT_IDLE_TIME: 1670,
    AUTO_LOGOUT_SET_TIMEOUT: 10,
    AUTO_LOGOUT_COUNT_DOWN: 120,
    ATTEMPT_COUNT: 5,
    MINUTES: 'minutes',
    SECONDS: 'seconds',
  },
  PASSWORD_REGEX: '^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[{}?():,;|\\\\<>.\\s\\]\'"[/*@#$%^&+=!_`~-]).{8,12}$',
  LOADING_TEXT_TITLE: 'Loading Data',
  PASSWORD_MAX_LENGTH: '12',
};
