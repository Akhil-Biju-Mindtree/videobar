import { AUDIO_CONSTANTS } from 'app/audio/audio.constant';
export const FACTORY_RESTORE_UUIDS = {
  [AUDIO_CONSTANTS.UUID.ACOUSTIC_ECHO_CANCELLATION]: '',
  [AUDIO_CONSTANTS.UUID.ANALOG_INPUT]: '',
  [AUDIO_CONSTANTS.UUID.MICROPHONE_MUTE_ACCESS]: '',
  [AUDIO_CONSTANTS.UUID.SPEAKER_VOLUME]: '',
  [AUDIO_CONSTANTS.UUID.BRIDGED_BT_CALL]: '',
};
export const DIALOG_TEXTS = {
  RESTORE_DEFAULT_DIALOG_HEADER: 'Restore Factory Defaults?',
  RESTORE_DEFAULT_DIALOG_CONTENT:
    '<p>Restoring the factory defaults will override all current controls values.</p><p>Are you sure you want to proceed?</p>',
  RESTORE_DEFAULT_CONFIRM_TEXT: 'Restore',
  DEFAULT_RESTORED: 'Factory defaults restored.',
};
