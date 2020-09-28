export const CONFIGURATION_NAVIGATION_ITEMS = [
  { label: 'Firmware', link: 'firmware' },
  { label: 'User Access', link: 'user-access' },
  { label: 'Profile', link: 'profile' },
  { label: 'System', link: 'system' },
  { label: 'Identity', link: 'identity' },
];

export const CONFIGURATION_CONSTANTS = {
  ARROW_ICON: 'assets/images/svg/down-chevron.svg',
  UUID: {
    WIFI_ENABLED: '0bb3d802-464e-4440-b2d0-4e991bb7e634',
    ETHERNET_ENABLED: '7a6c7304-3601-49e8-9644-15cc1164941e',
    BLUETOOTH_ENABLED: 'f2362dd2-1fe6-4479-9cf7-63c04936d7ac',
    CAMERA_ENABLED: '4427216a-570f-47b2-a9ad-5b67ccedf98a',
    AUTOFRAMING_ENABLED: '9b2be117-8fce-465e-8f4a-e6fd3580ec8a',
    SYSTEM_NAME: '40c271ee-91ef-4c16-a3a6-18bd237ff523',
    SYSTEM_ROOM: '275ec6e2-7a68-437e-9071-a1e5076e9f65',
    SYSTEM_FLOOR: '56411afb-872d-4a41-afdc-7f716b569066',
    SYSTEM_BUILDING: 'b3ffdc9c-eb83-4b4d-a202-4d879954f165',
    MUTE_BUTTON_ENABLED: '0f53a3ac-8734-4607-a5c0-5052629e4964',
    GPI_ACTIVE: '9f1a0003-d953-40d7-bbc5-1988978134b0',
    TIME_ZONE: 'af72b60f-1d82-4ee1-8e8d-a71faf0cc64a',
    NTP_SERVER: '7380162f-e834-4872-bb3a-35a2daf1c891',
    DEVICE_PASSWORD: '41d8625a-7ebb-4a44-87df-41524b446dcb',
    RESTART_DEVICE: 'e30659e3-3413-499f-bb4e-bbabf4e09587',
    PROFILE_DIRTY_STATE: '923d356f-d017-4686-9b87-15821305f543',
    PROFILE_NAME: 'f846143b-b1cb-4c36-a036-9053208ae379',
    PROFILE_DESCRPTION: 'de58e9d7-919c-4631-84f5-e7b26f9f6b8d',
    PROFILE: 'a95bcf56-95f9-48f6-b419-8b5b5d04e160',
    PROFILE_IMPORT_STATUS: 'd7b51306-de3b-45f2-b551-6026e373632b',
    PROFILE_RESTORE: 'e738c93b-124b-4d91-8af0-c6a39456edf4',
    LOW_POWER_MODE_ENABLE: 'c03ef5ae-32e3-41b2-bb2c-77b0adf8ff91',
  },
  TEXT: {
    RESTORING_DEFAULTS: 'Restoring Defaults...',
    PROFILE_DESCRIPTION: 'Profile Description',
    APPLY_PROFILE: 'Applying New Profile',
    PROFILE_RESTORED: '0',
    IMPORT_SUCCESS: '100',
    IMPORT_FAILURE: 'failure',
    PROFILE_UPLOAD_SUCCESS: 'Profile applied.',
    FIRMWARE_UPLOAD_ACTION_TEXT: 'Install',
    PROFILE_UPLOAD_ACTION_TEXT: 'Apply',
    UPLOAD_PROFILE: 'Uploading Profile...',
  },

  DIALOG_TEXTS: {
    ERROR_DIALOG_TYPE: 'Error',
    ERROR_DIALOG_HEADER: 'Error applying profile',
    ERROR_DIALOG_CONTENT: 'Unable to apply profile. Please check file parameters and try again.',
    ERROR_DIALOG_CONFIRM_TEXT: 'OK',
    PROFILE_DIALOG_HEADER: 'Restore Profile?',
    PROFILE_DIALOG_CONTENT:
      '<p>Restoring the applied profile will override the current profile edits.</p> <p>Are you sure you want to proceed?</p>',
    PROFILE_CONFIRM_TEXT: 'Restore',
  },

  KEY: {
    ENTER: 'Enter',
    TAB: 'Tab',
  },
};
