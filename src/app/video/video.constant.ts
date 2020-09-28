import { NavigationItem } from '@shared/models/navigation.model';

export const VideoConstant = {
  UUID: {
    CAMERA_PAN_UUID: 'ce706086-1925-4925-91a1-618706c9f8e3',
    CAMERA_TILT_UUID: '1e73855c-c9f4-4180-b79c-a4d71efa47b4',
    CAMERA_ZOOM_UUID: 'e1cd2715-3551-4acf-9ef7-7466c9513043',

    AUTOFRAME_ENABLED: '9b2be117-8fce-465e-8f4a-e6fd3580ec8a',
    AUTOFRAMING_STATE_UUID: 'cb3f9ece-c30e-4286-8846-54e2a0d25a82',
    HEADROOM_ADJUSTMENT_UUID: '12119116-b8bb-4125-a50c-0100d21e68d9',
    ZOOM_SPEED_UUID: 'ff4f8931-6f68-47be-a811-bad48c0a559f',
    PAN_TILT_SPEED_UUID: '4f805c94-27b3-43f8-b8d2-a19271ea5d8d',
    BORDER_SIZE_UUID: 'ade446be-dccd-45b9-b426-af00b18cd5c1',

    CAMERA_ANTIFLICKER_UUID: 'a8fcb412-42ec-4afb-8dd9-6cd0fde24283',
    CAMERA_BRIGHTNESS_UUID: 'a5699289-bc6c-4db9-9c29-161db2245716',
    CAMERA_CONTRAST_UUID: 'ee5620a9-b0d2-46c7-ab8d-f1b58105edfb',
    CAMERA_SATURATION_UUID: 'ff10e91d-3cc1-4ba6-b617-74a336fad352',
    CAMERA_SHARPNESS_UUID: 'f059d24b-000a-44fc-99ea-16e72057a32b',
    CAMERA_WHITEBALANCE_UUID: '7b738774-36ea-46b2-9ddd-a9b7be718dad',
    CAMERA_WHITEBALANCEAUTO_UUID: '807587dc-87db-494c-83ce-9f67289f75cc',
    CAMERA_SAVE_PRESET_FIRST: '46f9bcab-efff-499f-a78f-fedee46c5177',
    CAMERA_SAVE_PRESET_SECOND: '7da31ca1-8296-43ba-8b19-b6bb0cc37f69',
    CAMERA_SAVE_HOME_PRESET: '931400ef-58eb-4480-87cf-6b3b1a05c239',
    HOME_PRESET_UUID: '7f99bb30-8ee3-4016-892a-e87203323f76',
    FIRST_PRESET_UUID: 'db043921-0da1-48c2-8d55-69428d1e6fd5',
    SECOND_PRESET_UUID: 'df070f5d-eccd-4b25-af38-dad0d1ca754f',
    ACTIVE_PRESET_UUID: 'b16ce50e-5f58-4b26-acf1-14700f80182b',
    APPLY_ACTIVE_PRESET_UUID: '8d01ccea-fd5c-4030-b6f2-52debf62f306',
    BACKLIGHT_COMPENSATION: 'cc7923cf-0a10-47c4-9ec8-10dd05afcbcf',

    OSD_RES: '37339dc1-8b61-43bd-87ca-f0df4de54645',
    OSD_BBOX: 'fb45a96f-9b56-493f-b991-4e854e003704',
  },

  ICON: {
    AUTOFRAMING_ON_ICON: 'assets/images/svg/autoframe/autoframing_on.svg',
    AUTOFRAMING_OFF_ICON: 'assets/images/svg/autoframe/autoframing_off.svg',
    CAMERA_PRESET_ACTIVATE: 'assets/images/svg/camera/visible.svg',
  },

  TEXT: {
    DEFAULT_RESTORED: 'Factory defaults restored.',
    AUTOFRAME_ON: 'Autoframe On',
    AUTOFRAME_OFF: 'Autoframe Off',
    ENABLED: 'Enabled',
    DISABLED: 'Disabled',
    HEADROOM_SITTING_TEXT: 'Sitting',
    HEADROOM_STANDING_TEXT: 'Standing',
    SPEED_SLOW_TEXT: 'Slow',
    SPEED_NORMAL_TEXT: 'Normal',
    SPEED_FAST_TEXT: 'Fast',
    SIZE_SMALL_TEXT: 'Small',
    SIZE_NORMAL_TEXT: 'Normal',
    SIZE_LARGE_TEXT: 'Large',
    PRESET_BUTTON_LABEL: 'Save as Preset...',
    PRESET1SAVED: 'Preset 1 saved',
    PRESET2SAVED: 'Preset 2 saved',
    HOMEPRESETSAVED: 'Preset Home saved',
  },

  DIALOG_TEXTS: {
    AUTOFRAME_DIALOG_HEADER: 'Restore Factory Defaults?',
    AUTOFRAME_DIALOG_CONTENT:
      '<p>Restoring the factory defaults will override all current autoframing values.</p> <p>Are you sure you want to proceed?</p>',
    IMAGE_DIALOG_CONTENT:
      '<p>Restoring the factory defaults will override all current image values.</p><p>Are you sure you want to proceed?</p>',
    AUTOFRAME_CONFIRM_TEXT: 'Restore',
    SAVE_HOME_PRESET_DIALOG_HEADER: 'Save New Home Preset?',
    SAVE_HOME_PRESET_DIALOG_CONTENT: `<p>The camera returns to the Home preset on each new connection.</p><p>
    Are you sure you want to change the Home preset?</p>`,
    SAVE_HOME_PRESET_CONFIRM_TEXT: 'Save',
    UNSAVED_CHANGES_DIALOG_HEADER: 'Unsaved Changes',
    UNSAVED_CHANGES_DIALOG_CONTENT: 'There are unsaved changes on this page',
    UNSAVED_CHANGES_CONFIRM_TEXT: 'Leave',
    CAMERA_DIALOG_CONTENT:
      '<p>Restoring the factory defaults will override all current camera values.</p><p>Are you sure you want to proceed?</p>',
  },

  BUTTON: {
    SIZE: '34px',
  },
};

export const SLIDERS_ITEMS = [
  {
    label: 'Brightness',
    uuid: VideoConstant.UUID.CAMERA_BRIGHTNESS_UUID,
  },
  {
    label: 'Contrast',
    uuid: VideoConstant.UUID.CAMERA_CONTRAST_UUID,
  },
  {
    label: 'Saturation',
    uuid: VideoConstant.UUID.CAMERA_SATURATION_UUID,
  },
  {
    label: 'Sharpness',
    uuid: VideoConstant.UUID.CAMERA_SHARPNESS_UUID,
  },
];

export const WHITE_BALANCE = [
  {
    label: 'Auto',
    uuid: VideoConstant.UUID.CAMERA_WHITEBALANCEAUTO_UUID,
    value: false,
  },
  {
    label: 'White Balance',
    uuid: VideoConstant.UUID.CAMERA_WHITEBALANCE_UUID,
  },
];

export const ANTIFLICKER_ITEMS = [
  { text: 'Off', value: 'off' },
  { text: '50', value: '50' },
  { text: '60', value: '60' },
];

export const VIDEO_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Camera', link: 'camera-setting' },
  { label: 'Autoframing', link: 'autoframe' },
  { label: 'Image', link: 'image' },
];

export const AutoFrameSettingConstant = {
  autoframeOnStyles: {
    backgroundColor: '#f3f3f3',
    backgroundImage: 'url(assets/images/svg/autoframe/autoframing_on.svg)',
    backgroundPosition: 'center',
    backgroundSize: '83%',
    color: '#242424',
    width: '34px',
    height: '34px',
    backgroundRepeat: 'no-repeat',
  },
  autoframeOffStyles: {
    backgroundColor: '#f3f3f3',
    backgroundImage: 'url(assets/images/svg/autoframe/autoframing_off.svg)',
    backgroundPosition: 'center',
    backgroundSize: '83%',
    color: '#242424',
    width: '34px',
    height: '34px',
    backgroundRepeat: 'no-repeat',
  },
  autoframeDisabledStyles: {
    backgroundColor: '#f3f3f3',
    backgroundImage: 'url(assets/images/svg/autoframe/autoframing_off.svg)',
    backgroundPosition: 'center',
    backgroundSize: '83%',
    color: '#242424',
    width: '34px',
    height: '34px',
    backgroundRepeat: 'no-repeat',
    opacity: '0.5',
  },
  autoframeDirectvieStyles: {
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

export const BackLightCompensationControl = {
  label: 'Backlight Compensation',
  uuid: 'cc7923cf-0a10-47c4-9ec8-10dd05afcbcf',
};

export const BackLightValueList = [
  { label: 'Off', value: 'off' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];
