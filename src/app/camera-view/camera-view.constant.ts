export const CameraViewConstant = {
  UUID: {
    AUTOFRAME_ENABLED: '9b2be117-8fce-465e-8f4a-e6fd3580ec8a',
    AUTOFRAMING_STATE_UUID: 'cb3f9ece-c30e-4286-8846-54e2a0d25a82',
    LOW_LIGHT_CORRECTION_UUID: 'b374bc3d-52bc-43cb-bdf1-a2977139fa85',
    PRESET_ONE_UUID: 'db043921-0da1-48c2-8d55-69428d1e6fd5',
    PRESET_SECOND_UUID: 'df070f5d-eccd-4b25-af38-dad0d1ca754f',
    ACTIVE_PRESET_UUID: 'b16ce50e-5f58-4b26-acf1-14700f80182b',
    APPLY_ACTIVE_PRESET_UUID: '8d01ccea-fd5c-4030-b6f2-52debf62f306',

    HOME_PRESET_UUID: '7f99bb30-8ee3-4016-892a-e87203323f76',
    CAMERA_PAN_RIGHT_UUID: '83fcee24-ea2e-4097-8687-51059465b896',
    CAMERA_PAN_LEFT_UUID: '64c4ab3f-1c33-4c09-b72e-06eb810f146b',
    CAMERA_TILT_UP_UUID: '6b5aa35d-66cc-4103-b6a7-1656e2c1e0c2',
    CAMERA_TILT_DOWN_UUID: 'f19bfa29-77f4-44ed-979d-93729309494a',

    CAMERA_ZOOM_UUID: 'e1cd2715-3551-4acf-9ef7-7466c9513043',
    CAMERA_ZOOM_IN_UUID: '9ada8de0-0a40-4167-a3c1-c13483a8dc49',
    CAMERA_ZOOM_OUT_UUID: 'b81ff38f-c0a7-4e02-a23d-1636aa4738d1',

    SAVE_PRESET_FIRST: '46f9bcab-efff-499f-a78f-fedee46c5177',
    SAVE_PRESET_SECOND: '7da31ca1-8296-43ba-8b19-b6bb0cc37f69',

    SPEAKER_VOLUME: '47939e64-38e6-4ead-a843-a894c05c55c8',
    SPEAKER_MUTE: '4ee0b9a6-e603-42d6-9f7e-98db87dec790',
  },

  ICON: {
    LOW_LIGHT_CORRECTION_ON_ICON: 'assets/images/svg/low-light-correct/ic-brightness-on.svg',
    LOW_LIGHT_CORRECTION_OFF_ICON: 'assets/images/svg/low-light-correct/ic-brightness-off.svg',
    AUTOFRAMING_ON_ICON: 'assets/images/svg/autoframe/autoframing_on.svg',
    AUTOFRAMING_OFF_ICON: 'assets/images/svg/autoframe/autoframing_off.svg',
    CAMERA_SLIDER_ZOOM_ICON: 'assets/images/svg/zoom-slider/ic-zoom.svg',
    CAMERA_SLIDER_ZOOM_MINUS_ICON: 'assets/images/svg/zoom-slider/ic-zoom-minus.svg',
    CAMERA_SLIDER_ZOOM_PLUS_ICON: 'assets/images/svg/zoom-slider/ic-zoom-plus.svg',
    VOLUME_SLIDER_MINUS_ICON: 'assets/images/svg/microphone/ic-volume-down.svg',
    VOLUME_SLIDER_PLUS_ICON: 'assets/images/svg/microphone/ic-volume-up.svg',
    VOLUME_SLIDER_MUTE_ICON: 'assets/images/svg/microphone/ic-mic-mute-2.svg',
    VOLUME_SLIDER_SPEAKER_ICON: 'assets/images/svg/microphone/ic-volume-speaker.svg',
  },

  TEXT: {
    AUTOFRAME_TOOLTIP_TEXT_ON: 'Autoframe On',
    AUTOFRAME_TOOLTIP_TEXT_OFF: 'Autoframe Off',
    LOW_LIGHT_CORRECTION_ON: 'Low Light Compensation: On',
    LOW_LIGHT_CORRECTION_OFF: 'Low Light Compensation: Off',
    PRESET_ONE: 'preset1',
    PRESET_1: 'Preset 1',
    PRESET_2: 'Preset 2',
    CAMERA_PAN_TILT_HOME_AREA_ID: 'ptHome',
    CAMERA_PAN_RIGHT_AREA_ID: 'panRight',
    CAMERA_TILT_DOWN_AREA_ID: 'tiltDown',
    CAMERA_PAN_LEFT_AREA_ID: 'panLeft',
    CAMERA_TILT_UP_AREA_ID: 'tiltUp',
    PRESET1_SAVE_SUCCESS: 'Preset 1 saved.',
    PRESET2_SAVE_SUCCESS: 'Preset 2 saved.',
  },

  PRESET_ONE_ICON_WIDTH: '5.3px',
  PRESET_TWO_ICON_WIDTH: '8.3px',

  CAMERA_SLIDER_ZOOM_WIDTH: '262px',
  CONTEXT_MENU_ITEMs: [
    { text: 'Go to Preset', value: 0 },
    { text: 'Save New Preset', value: 1 },
  ],
  UPDATE_INTERVAL: 500,
  MOUSE_RIGHT_BUTTON: 2,
  MOUSE_LEFT_BUTTON: 0,
};

export const PRESET_CONST = {
  presetOneStyles: {
    backgroundColor: '#f3f3f3',
    backgroundImage: 'url(assets/images/svg/preset/ic-preset-1.svg)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#242424',
    width: '40px',
    height: '40px',
  },
  presetTwoStyles: {
    backgroundColor: '#f3f3f3',
    backgroundImage: 'url(assets/images/svg/preset/ic-preset-2.svg)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#242424',
    width: '40px',
    height: '40px',
  },
  presetDirectvieStyles: {
    onMouseEnter: {
      backgroundColor: '#d5d5d5',
      color: '#242424',
      opacity: '1',
    },
    onMouseLeave: {
      backgroundColor: '#f3f3f3',
      color: '#242424',
      opacity: '1',
    },
    onMouseUp: {
      backgroundColor: '#d5d5d5',
    },
    onMouseDown: {
      backgroundColor: '#bebebe',
    },
  },
};
