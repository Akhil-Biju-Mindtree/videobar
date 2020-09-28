import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';

export const VIDEO_CONTROLS_CAMERA = { label: 'Camera', uuid: CONFIGURATION_CONSTANTS.UUID.CAMERA_ENABLED };

export const VIDEO_CONTROLS_AUTO_FRAME = {
  label: 'Autoframe Access',
  uuid: CONFIGURATION_CONSTANTS.UUID.AUTOFRAMING_ENABLED,
};

export const AUDIO_CONTROLS = [
  { label: 'Microphone Mute Access', uuid: CONFIGURATION_CONSTANTS.UUID.MUTE_BUTTON_ENABLED },
];

export const NETWORK_CONTROLS = [
  { label: 'Wired Network', uuid: CONFIGURATION_CONSTANTS.UUID.ETHERNET_ENABLED },
  { label: 'Wireless Network', uuid: CONFIGURATION_CONSTANTS.UUID.WIFI_ENABLED },
];
export const BLUETOOTH_CONTROLS = { label: 'Bluetooth', uuid: CONFIGURATION_CONSTANTS.UUID.BLUETOOTH_ENABLED };
