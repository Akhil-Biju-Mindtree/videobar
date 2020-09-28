import { AUDIO_CONSTANTS } from 'app/audio/audio.constant';

export const INPUT_LEVEL_METERS = [
    { uuid: AUDIO_CONSTANTS.UUID.BLUETOOTH_INPUT_LEVEL, label: 'Bluetooth' },
    { uuid: AUDIO_CONSTANTS.UUID.USB_INPUT_LEVEL, label: 'USB' },
    { uuid: AUDIO_CONSTANTS.UUID.MICROPHONE_ARRAY_INPUT_LEVEL, label: 'Microphone Array' },
];

export const OUTPUT_LEVEL_METERS = [
    { uuid: AUDIO_CONSTANTS.UUID.BLUETOOTH_OUTPUT_LEVEL, label: 'Bluetooth' },
    { uuid: AUDIO_CONSTANTS.UUID.USB_OUTPUT_LEVEL, label: 'USB' },
    { uuid: AUDIO_CONSTANTS.UUID.LOUDSPEAKER_OUTPUT_LEVEL, label: 'Speaker' },
];
