export const SharedConstants = {
  UUID: {
    SYSTEM_NAME: '40c271ee-91ef-4c16-a3a6-18bd237ff523',
  },
  ICON: {
    CLOSE_ICON: 'assets/images/svg/ic-close.svg',
    DOWN_ARROW: 'assets/images/svg/network/down-chevron.svg',
    NO_CAMERA_VIEW: 'assets/images/svg/camera/no-camera-view.png',
  },
  TEXT: {
    DROPDOWN_DEFAULT_TEXT: 'None',
    DOWNLOAD_PROFILE_HEADER: 'Downloading Profile',
    PROFILE_SAVE_FAILED: 'Save Profile Failed',
    PROFILE_SAVED_SUCCESS: 'Profile Saved.',
    CURRENT_OPERATION: 'Current Operation',
    FIRMWARE_PROGRESS_DIALOG_DEFAULT_CONTENT:
      'Please do not disconnect device power supply during the firmware installation.',
    FIRMWARE_PROGRESS_DIALOG_DEFAULT_TITLE: 'Installing Firmware Update',
    INPUT: 'input',
    READY_STATE_TEXT_FLAG: 'READY-STATE',
    READY_STATE_FAILURE_TOAST_TEXT: 'Camera not ready, Check the device',
  },
  FILE_TYPE_TEXT: {
    JSON_FILE: 'JavaScript Object Notation File',
    ALL_FILES: 'All Files (*.*)',
    FILE_ERROR_SIZE_EXCEEDED: 'File Size Exceeded',
    FILE_ERROR_TYPE: 'File Type Not Supported',
  },
  STYLES: {
    FILEUPLOAD_BGCOLOR_DEFAULT: '#f8f8f8',
    FILEUPLOAD_BGCOLOR_HOVER: '#6c6c6c',
    FILEUPLOAD_TEXTCOLOR_DEFAULT: '#3a3a3a',
    FILEUPLOAD_TEXTCOLOR_HOVER: '#ffffff',
  },
  MAX_FILE_SIZE: 367001600,
  ERROR_DIALOG: 'Error',
  DIALOG_WIDTH: '356px',
  SPINNER_DIALOG_WIDTH: '180px',
  SPINNER_DIALOG_HEIGHT: '148px',
  PROGRESS_DIALOG_WIDTH: '356px',
  PROGRESS_DIALOG_HEIGHT: '102px',
  DIALOG: {
    CONFIRMATION_DIALOG: {
      TOP: '3px',
      LEFT: '17%',
      FUllSCREEN_LEFT: '33%',
    },
    SPINNER_DIALOG: {
      TOP: '3px',
      LEFT: '31%',
    },
  },
  INPUT: {
    TYPE: {
      NUMBER: 'number',
      TEXT: 'text',
    },
    WIDTH: {
      LARGE: '212px',
      SMALL: '36px',
      MEDIUM: '61px',
    },
  },

  RADIO_BUTTON_STYLE: {
    HORIZONTAL: {
      paddingRight: '16px',
    },
    VERTICAL: {
      display: 'flex',
      margin: '3px 0px',
      color: '#000000',
    },
  },
  TOASTER_MARGIN_CLASS: 'toaster-margin',
  SLIDER_CONTAINER_DEFAULT_WIDTH: '198px',
  STREAM_DATA: {
    TYPES: ['videoinput'],
    LABELS: ['UVC Camera', 'Bose'],
  },
  NO_CAMERA: {
    MIN_RECT_WIDTH: 89,
    MIN_RECT_HEIGHT: 50,
    CANVAS_WIDTH: 356,
    CANVAS_HEIGHT: 200,
    ZOOM_OFFSET_HEIGHT: 25,
    ZOOM_OFFSET_WIDTH: 44.5,
    SCALING_FACTOR: 1.78,
    GRID_COUNT: 21, // number of grids
    MIN_ZOOM_SCALE_PIXEL: 50,
    ZOOM_OFFSET_MAP: [
      { WIDTH: 178, HEIGHT: 100 },
      { WIDTH: 134.848, HEIGHT: 75.757 },
      { WIDTH: 107.228, HEIGHT: 60.24 },
      { WIDTH: 89, HEIGHT: 50 },
      { WIDTH: 76.724, HEIGHT: 43.103 },
      { WIDTH: 66.917, HEIGHT: 37.593 },
      { WIDTH: 59.333, HEIGHT: 33.333 },
      { WIDTH: 53.614, HEIGHT: 30.12 },
      { WIDTH: 48.633, HEIGHT: 27.322 },
      { WIDTH: 44.5, HEIGHT: 25 },
    ],
    TEXT: {
      LOADING_VIDEO_STREAM: 'Loading video stream...',
      NO_USB_CONNECTED:
        'This video stream is not available.<br>Please check that it is connected and enabled in the configuration settings.',
      NO_CAMERA_TEXT_VIDEO: [
        'The video stream is not available. Please check that it is connected, enabled, and not active in another application and ',
        ' this window.',
      ],
      NO_CAMERA_MICROPHONE_TEXT: [
        'The video stream is active in another window. Close that application and ',
        ' this window to configure microphones.',
      ],
    },
  },
  NEWLINE_REGEX: /(\n)/g,
  NEWLINE_TAG: '\n',
  NEW_LINE_TAG: '\u1683',
  NEW_LINE_REG: /(\u1683)/g,
  BREAK_LINE_TAG: '<br>',
  KEYBOARD_KEYS: {
    ESCAPE_KEY: 'Escape',
    ESCAPE_IE_KEY: 'Esc',
    ENTER_KEY: 'Enter',
  },
};
