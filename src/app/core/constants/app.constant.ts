import { first } from 'rxjs/operators';
import { CameraViewConstant } from '../../camera-view/camera-view.constant';
import { SharedConstants } from '@shared/shared.constants';
import { VideoConstant } from 'app/video/video.constant';
import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';
import { FirmwareConstants } from '../../configuration/firmware/firmware.constant';
import { SettingsConstants } from 'app/settings/settings.constant';

export enum Action {
  Retrieve = 'retrieve',
  Subscribe = 'subscribe',
  Delete = 'delete',
  Perform = 'perform',
  Update = 'update',
  Notify = 'notify',
  Authenticate = 'authenticate',
  SubscribeAll = 'subscribeall',
}

export enum CacheStates {
  Router = 'router',
  Application = 'appData',
  Device = 'deviceData',
}
export const AppConstants = {
  Action,
  StateOn: '1',
  StateOff: '0',
  STREAMING: 'Streaming',
  NOT_STREMING: 'Not Streaming',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCONNECTED: 'disconnect',
  CONNECTED: 'online',
  ENABLED: 'Enabled',
  DISABLED: 'Disabled',
  SUCCESS: 'e000',
  NONE: 'none',
  VALID: 'VALID',
  CANCEL: 'Cancel',
  JOIN: 'Join',
  CONTINUE: 'Continue',
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  SAVE: 'Save',

  API_STATE: {
    IDLE: 'idle',
    FAILURE: 'failure',
    ASSOCIATION: 'association',
    CONFIGURATION: 'configuration',
    READY: 'ready',
    DISCONNECT: 'disconnect',
    ONLINE: 'online',
  },
  PacketPosition: {
    FIRST: 'first',
    LAST: 'last',
  },
  CONNECTION_STATE: {
    CONNECTED: 'Connected',
    DISCONNECTED: 'Disconnected',
    CONNECTING: 'Connecting...',
  },
  Password: 'BC8B1628901369D49AA4CEF8E687AF58',
  ToolTipDelay: 800,
  PRESET_HOME_VALUE: '1',
  PRESET_ONE_VALUE: '2',
  PRESET_TWO_VALUE: '3',
  ONE_STEP: '1',
  QUEUE_DELAY: '20',
  GROUP: 'group',
  CANONICAL_NAME: 'canonical_name',
  BACKGROUND: 'background',
  SLIDER_THROTTLE_INTERVAL: 500,
  COLORS: {
    LIGHT_GREY: '#f3f3f3',
    MEDIUM_LIGHT_GREY: '#d5d5d5',
    DARK_GREY: '#bebebe',
    BLACK: '#242424',
    WHITE: '#fff',
    NERO: '#272727',
    VERY_LIGHT_GREY: '#f8f8f8',
    BROWNISH_GREY: '#BEBEBE',
  },
  HOME_SCREEN_UUIDS: {
    [CameraViewConstant.UUID.CAMERA_ZOOM_UUID]: '',
    [CameraViewConstant.UUID.SPEAKER_VOLUME]: '',
    [CameraViewConstant.UUID.SPEAKER_MUTE]: '',
    [CameraViewConstant.UUID.AUTOFRAMING_STATE_UUID]: '',
    [CameraViewConstant.UUID.LOW_LIGHT_CORRECTION_UUID]: '',
    [CameraViewConstant.UUID.AUTOFRAME_ENABLED]: '',
    [VideoConstant.UUID.CAMERA_PAN_UUID]: '',
    [VideoConstant.UUID.CAMERA_TILT_UUID]: '',
    [FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS]: '',
    [FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS_STEPS]: '',
    [SettingsConstants.UUID.FIRMWARE_VERSION]: '',
    [SettingsConstants.UUID.CAMERA_VERSION]: '',
  },
  FIRMWARE_PROGRESS_UUIDS: {
    [FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS]: '',
    [FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS_STEPS]: '',
  },
  SYSTEM_REBOOT_UUID: 'e30659e3-3413-499f-bb4e-bbabf4e09587',
  APP_DATA_KEYS: {
    COPY_PROGRESS_RESPONSE_KEY: 'CopyProgress',
    IS_UP_TO_DATE_KEY: 'isUpToDate',
    FIRMWARE_UPDATE_IN_PROGRESS_KEY: 'FirmwareUpdateInProgress',
    FIRMWARE_COPY_IN_PROGRESS_KEY: 'FirmwareCopyInProgress',
    LOGS_DOWNLOAD_IN_PROGRESS_KEY: 'LogsDownloadStatus',
    COPY_FAILURE_ERROR: 'CopyFailure',
    UPDATE_FAILURE_ERROR: 'UpadteFailureError',
    DISCONNECT_DURING_COPY: 'DisconnectDuringCopy',
    DISCONNECT_DURING_UPDATE: 'DisconnectDuringUpdate',
    DOWNLOAD_FAILURE_ERROR: 'DownloadFailure',
    UPDATE_HUNG: 'UpdateHung',
  },
  WEBSOCKET_DISCONNECTED: 'websocketDisconnected',
  DEFAULT_IP: '0.0.0.0',
  AUTHENTICATED: 'Authenticated',
  DEVICEDATA_RETRIEVED: 'DeviceDataRetrieved',
  SYSTEM_PASSWORD: '24',
  CENTER: 'center',
  CANVAS_LAYOUT: 'canvasLayout',
  WHITE: 'white',
  LEFT: 'left',
  TOP: 'top',
  BLACK: 'black',
  SMOKE_WHITE: '#ccc',
  VALUE: 'value',
  USER: 'user',
  PRIVATE: 'private',
  AUDIO_BEAMS_EXPANDED: 'AudioBeamsExpanded',
  APP_SESSION: 'session',
  RIGHT: 'right',
  CAMERA_CONTROLS: 'Camera Controls',
  DEVICE_GETTING_READY: 'Starting up',
  BACK: 'Back',
  REDIRECT_TO_FIRMWARE_KEY: 'RedirectToFirmware',
  APP_SESSION_TIMEOUT: 'ng2Idle.main.expiry',
  SCREEN_WIDTH_HEIGHT: 'screenWidthHeight',
  CAMERA_HIGHT_WIDTH: {
    RATIO: {
      aspectRatio: 1.7741935483870968,
    },
    VIDEO_ROUTE_WIDTH_HEIGHT: {
      width: 312,
      height: 175.854545,
    },
    MICROPHONE_ROUTE_WIDTH_HEIGHT: {
      width: 440,
      height: 248,
    },
    CAMERA_ROUTE_WIDTH_HEIGHT: {
      width: 356,
      height: 200.654545,
    },
  },
  HTTP_TYPE: 'https://',
  WEB_SOCKET_RETRY_INTERVAL: 10,
  WEB_SOCKET_PING_INTERVAL: 21000,
  WEB_SOCKET_CONNECTION_TIMEOUT: 60000,
  APP_INFO_URL: 'https://assets.bose.com/content/dam/Bose_DAM/Web/pro/software/bose_work/vb1/{version}/fileInfo.json',
  SERVER_BASE_URL: 'https://assets.bose.com/content/dam/Bose_DAM/Web/pro/software/bose_work/vb1/{version}/',
  SERVER_VERSION_URL: 'https://assets.bose.com/content/dam/Bose_DAM/Web/pro/software/bose_work/vb1/version.json',
};

export const AppIconConstants = {
  ADMIN_ICON: 'assets/images/svg/navigation/ic-admin.svg',
  SETTINGS_ICON: 'assets/images/svg/navigation/settings.svg',
  BACK_HOME_ICON: 'assets/images/svg/navigation/ic-back-home.svg',
  BACK_ICON: 'assets/images/svg/navigation/ic-back.svg',
};

export const CONFIGURE_ROOM_UUIDS = {
  ROOM_WIDTH: '4c526939-45cb-4f2f-8a5d-3887804e7257',
  ROOM_DEPTH: '4574bbc4-04da-4180-93ec-674bcf0772c7',
};

export const ALL_CONFIGURE_ROOM_UUIDS = {
  '4c526939-45cb-4f2f-8a5d-3887804e7257': '',
  '4574bbc4-04da-4180-93ec-674bcf0772c7': '',
};
export const READY_STATE_UUID = 'fa7b814b-b877-4d49-84ce-a431e4a2455e';

export const WAKEUP_DEVICE_UUID = '058c4d17-3669-42e8-a623-13bdd2866e16';

export const ALL_UUID = 'ALL';
export const APP_INFO = {
  APP_VERSION: 'App Version: 1.10',
  APP_NAME: 'Bose Work Configuration',
  APP_NAME_WEB: 'Bose Videobar VB1',
  BOSE_LOGO: 'assets/images/bose-pro-logo-blackbox-rgb@2x.jpg',
};

export const FILE_TRANSFER_MODE = {
  LOG_DOWNLOAD: 'log',
  FIRMWARE_UPDATE: 'firmware',
};

export const LOG_TIMEOUT = 'timeout';
