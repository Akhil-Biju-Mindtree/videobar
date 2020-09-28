import { NavigationItem } from '@shared/models/navigation.model';
import { CONFIGURE_ROOM_UUIDS } from '@core/constants/app.constant';

export const AUDIO_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Microphones', link: 'microphones' },
  { label: 'Controls', link: 'controls' },
  { label: 'Meters', link: 'meters' },
];

export const AUDIO_CONSTANTS = {
  UUID: {
    MICROPHONE_MUTE_ACCESS: '0f53a3ac-8734-4607-a5c0-5052629e4964',
    ACOUSTIC_ECHO_CANCELLATION: '2242070c-c774-4b9c-8103-7de8e5f5e691',
    ANALOG_INPUT: 'a992de1d-b258-446e-bac9-c1f8c96468a0',
    SPEAKER_VOLUME: '47939e64-38e6-4ead-a843-a894c05c55c8',
    USB_INPUT_LEVEL: 'ba60fe1c-9c9d-44a9-ad3d-02062a9b8824',
    USB_OUTPUT_LEVEL: 'fdb5c3e6-0ad5-45c6-9f4a-d71f892c4380',
    BLUETOOTH_INPUT_LEVEL: '9ff38975-ba62-4a35-bd69-0ad5bdf14dd4',
    BLUETOOTH_OUTPUT_LEVEL: 'ae32c35f-4c4e-4bd1-b091-142eb4f3eaf0',
    MICROPHONE_ARRAY_INPUT_LEVEL: 'c7b329a1-b090-4584-a69d-181f4ecb39cb',
    LOUDSPEAKER_OUTPUT_LEVEL: '1828d45d-eb77-4b79-9f61-2c86be78f57b',
    GET_DYNAMIC_BEAM_ANGLES: '8fc4027d-96f1-4a9d-b45c-68085a98cefb',
    GET_AMM_STATE: '6afd6f2a-73c5-4cad-8264-df40abc47045',
    STATIC_ONE_ANGLE: '6745eb7b-fd43-44e1-ae1e-9068e422f5de',
    STATIC_TWO_ANGLE: '4746a431-510a-4828-8bbd-cb224fdf1152',
    STATIC_THREE_ANGLE: '4f1526ec-1cc3-4de4-8c12-1c95c9f081b9',
    STATIC_FOUR_ANGLE: '434a6a0d-eb30-45bb-a998-891f3104b9d4',
    ZONE_ONE_ANGLE: '67906970-69de-4e0d-9a27-7f56fa33a304',
    ZONE_TWO_ANGLE: '5fc62c82-00d5-4129-a906-0308ea9c6255',
    ZONE_THREE_ANGLE: '89f9a3b0-452d-4301-9223-5b5f62151a1f',
    BEAM_TYPE: '0d485156-2fd5-4d20-bf79-583de2b880a1',
    ENABLE_BEAM_EVENTS: '98b4ab7d-92fe-485c-9c06-1821bb06e1f5',
    CAMERA_PAN_UUID: 'ce706086-1925-4925-91a1-618706c9f8e3',
    CAMERA_TILT_UUID: '1e73855c-c9f4-4180-b79c-a4d71efa47b4',
    CAMERA_ZOOM_UUID: 'e1cd2715-3551-4acf-9ef7-7466c9513043',
    ENABLE_METERING_EVENTS: '34a196b4-0d6d-4c37-870e-32e47bfd9439',
    AUTOFRAMING_STATE_UUID: 'cb3f9ece-c30e-4286-8846-54e2a0d25a82',
    VIDEO_RESOLUTION_OVERLAY: '37339dc1-8b61-43bd-87ca-f0df4de54645',
    AUTOFRAME_INFO: 'fb45a96f-9b56-493f-b991-4e854e003704',
    BRIDGED_BT_CALL: 'c5cc09db-2d43-4678-92a4-c718d626ba1d',
  },
  ICON: {
    ZONES_MICROPHONE_LEFT_ICON: 'assets/images/svg/microphone/ic-zone-icon-left.svg',
    ZONES_MICROPHONE_RIGHT_ICON: 'assets/images/svg/microphone/ic-zone-icon-right.svg',
    ZONES_MICROPHONE_BASE_ICON: 'assets/images/svg/microphone/beam-base.svg',
    ADD_ICON: 'assets/images/svg/microphone/add.svg',
    DELETE_STATIC_ICON: 'assets/images/svg/microphone/ic-static-delete.svg',
    DELETE_ZONE_ICON: 'assets/images/svg/microphone/ic-zone-delete.png',
    MORE_ICON: 'assets/images/svg/microphone/ic-more-filled.svg',
    COLLAPSE_ICON: 'assets/images/svg/microphone/ic-collapse.svg',
    EXPAND_ICON: 'assets/images/svg/microphone/ic-expand.svg',
    CONFIGURE_ICON: 'assets/images/svg/microphone/configure.png',
    ROOM_CONFIGURE_ICON: 'assets/images/svg/microphone/room-config-down-arrow.svg',
  },
  URL: {
    DYNAMIC_BEAM_URL: 'dynamic-beams',
    STATIC_BEAM_URL: 'static-beams',
    ZONE_BEAM_URL: 'zone-beams',
    AUDIO_URL: 'audio',
  },
  BEAMS: {
    PERFORM_ENABLE: '1',
    PERFORM_DISABLE: '0',
    MAX_NUMBER_OF_STATIC_BEAMS: 4,
    DEFAULT_BEAM_VALUES: [40, 15, -15, -40],
    DYNAMIC_BEAM_DISABLED: 'na',
    STATIC_BEAM_DISABLED: 'disabled',
    RANGE_MAPPING: {
      INPUT_RANGE: [-56, 56],
      OUTPUT_RANGE: [-60, 60],
    },
  },
  ZONES: {
    ZONE_KEYS: {
      START_ANGLE: 'START_ANGLE_UUID',
      END_ANGLE: 'END_ANGLE_UUID',
      DELETE_ANGLE: 'DELETE_ANGLE_UUID',
    },
    MAX_NUMBER_OF_ZONES: 3,
    DEFAULT_NUMBER_OF_ZONES: 2,
    DRAG_HANDLES: {
      MINIMUM: 'minimum',
      MAXIMUM: 'maximum',
      ENABLE_BOTH: 'both',
      DISABLE_BOTH: 'none',
    },
    RANGE_MAPPING: {
      INPUT_RANGE: [-56, 56],
      OUTPUT_RANGE: [-60, 60],
      OUTPUT_EXTENDED_IN_DEVICE: [-89, 89],
      OUTPUT_EXTENDED_IN_UI: [-83, 83],
    },
    ZONE_UUIDS: {
      ZONE_ONE: {
        START_ANGLE_UUID: 'f4738bf8-d683-47ab-acbc-48646b56f4eb',
        END_ANGLE_UUID: '67906970-69de-4e0d-9a27-7f56fa33a304',
      },
      ZONE_TWO: {
        START_ANGLE_UUID: '69a00953-60d7-41d1-9d21-b76ac3845ae1',
        END_ANGLE_UUID: 'a44a95d5-71b0-49c2-b71d-96298374ba7f',
        DELETE_ANGLE_UUID: '89f9a3b0-452d-4301-9223-5b5f62151a1f',
      },
      ZONE_THREE: {
        START_ANGLE_UUID: '5fc62c82-00d5-4129-a906-0308ea9c6255',
        END_ANGLE_UUID: 'af8e690a-bb59-4a0a-a83b-c7cf77a18d4e',
      },
    },
  },
  ROOM_CONFIG_SLIDER_WIDTH: '190px',
  BEAM_TYPES: {
    DYNAMIC: 'dynamic',
    STATIC: 'fixed',
  },
  TEXT: {
    CONFIGURE_ROOM: 'Configure Room',
  },
  DIMENSIONS: {
    FULL_SCREEN_WIDTH: 735,
    FULL_SCREEN_HEIGHT: 641,
    NORMAL_WIDTH: 480,
    NORMAL_HEIGHT: 570,
  },
  KEY_CODES: {
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    PLUS: '+',
    MINUS: '-',
    PLUS_EXTENDED: '=',
  },
  TIMEOUT: {
    AUTOFRAME_TIMEOUT: 2000,
    PTZ_TIMEOUT: 500,
  },
};

export const staticBeamUUIDs = {
  allUUIDs: {
    [AUDIO_CONSTANTS.UUID.STATIC_ONE_ANGLE]: '',
    [AUDIO_CONSTANTS.UUID.STATIC_TWO_ANGLE]: '',
    [AUDIO_CONSTANTS.UUID.STATIC_THREE_ANGLE]: '',
    [AUDIO_CONSTANTS.UUID.STATIC_FOUR_ANGLE]: '',
  },
  UUID_ARRAY: [
    AUDIO_CONSTANTS.UUID.STATIC_ONE_ANGLE,
    AUDIO_CONSTANTS.UUID.STATIC_TWO_ANGLE,
    AUDIO_CONSTANTS.UUID.STATIC_THREE_ANGLE,
    AUDIO_CONSTANTS.UUID.STATIC_FOUR_ANGLE,
  ],
};
export const ptzUUIDs = {
  [AUDIO_CONSTANTS.UUID.CAMERA_PAN_UUID]: '',
  [AUDIO_CONSTANTS.UUID.CAMERA_TILT_UUID]: '',
  [AUDIO_CONSTANTS.UUID.CAMERA_ZOOM_UUID]: '',
};
export const zonesUUIDs = {
  [AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_ONE.END_ANGLE_UUID]: '',
  [AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_ONE.START_ANGLE_UUID]: '',
  [AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_THREE.START_ANGLE_UUID]: '',
  [AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_THREE.END_ANGLE_UUID]: '',
  [AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_TWO.START_ANGLE_UUID]: '',
  [AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_TWO.END_ANGLE_UUID]: '',
  [AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_TWO.DELETE_ANGLE_UUID]: '',
};
export const MICROPHONE_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Dynamic', link: 'dynamic-beams' },
  { label: 'Static', link: 'static-beams' },
];

export const CONFIGURE_ROOM_MENU_ITEMS = {
  CONFIGURE_ROOM: {
    label: 'Configure Room',
    iconPath: AUDIO_CONSTANTS.ICON.ROOM_CONFIGURE_ICON,
  },
  CONFIGURE_ROOM_ITEMS: [
    { label: 'Room Width', value: 0, isRequired: true, uuid: CONFIGURE_ROOM_UUIDS.ROOM_WIDTH },
    { label: 'Room Depth', value: 0, isRequired: true, uuid: CONFIGURE_ROOM_UUIDS.ROOM_DEPTH },
  ],
};

export const ExpandCollapseConstant = {
  ExpandModeStyles: {
    backgroundColor: '#f3f3f3',
    backgroundImage: `url(${AUDIO_CONSTANTS.ICON.EXPAND_ICON})`,
    backgroundPosition: 'center',
    backgroundSize: '100%',
    color: '#6c6c6c',
    position: 'absolute',
    zIndex: 20,
    top: '95px',
    right: '10px',
    width: '40px',
    height: '40px',
    opacity: '0.75',
  },
  CollopseModeStyles: {
    backgroundColor: '#f3f3f3',
    backgroundImage: `url(${AUDIO_CONSTANTS.ICON.COLLAPSE_ICON}`,
    backgroundPosition: 'center',
    backgroundSize: '100%',
    color: '#242424',
    position: 'absolute',
    zIndex: 20,
    top: '10px',
    right: '10px',
    width: '40px',
    height: '40px',
    opacity: '0.75',
  },
  ExpandCollapseDirectvieStyles: {
    onMouseEnter: {
      backgroundColor: '#f3f3f3',
      color: '#242424',
      opacity: '1',
    },
    onMouseLeave: {
      backgroundColor: '#f3f3f3',
      color: '#242424',
      opacity: '0.75',
    },
    onMouseUp: {
      backgroundColor: '#f3f3f3',
    },
    onMouseDown: {
      backgroundColor: '#f3f3f3',
    },
  },
};
