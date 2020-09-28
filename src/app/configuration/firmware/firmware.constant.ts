export const FirmwareConstants = {
  UUID: {
    FIRMWARE_VERSION: '998bf2df-7f03-4299-b274-d0d6d3c6b76c',
    FIRMWARE_UPDATE: '19b8a8c9-aa6b-4251-ba43-f10b4ce51713',
    FIRMWARE_UPDATE_STATUS: '1afaa496-492f-4228-a836-d7889a006302',
    FIRMWARE_UPDATE_STATUS_STEPS: '60578a6a-b607-477f-8458-9774d2f0fb43',
  },
  COPY_SUCCESS_STATUS: 100,
  UPDATE_SUCCESS_STATUS: '100',
  UPDATE_STATUS_START: '0',
  FIRMWARE_INFO_URL:
    'https://assets.bose.com/content/dam/Bose_DAM/Web/pro/software/bose_work/vb1/{version}/fileInfo.json',
  BOSE_WORK_LINK: 'https://pro.bose.com/en_us/products/conferencing/videobars/bose-videobar-vb1.html',
  DIALOG_TEXTS: {
    OLDFIRMWARE_DIALOG_HEADER: 'Older Firmware Version',
    OLDFIRMWARE_DIALOG_CONTENT:
      '<p>The firmware version you are attempting to install is older than the one currently installed.</p>' +
      '<p>Updating the firmware will reboot the device, log out of the administrative app and return to the Home screen.</p>' +
      '<p>Are you sure you want to proceed?</p>',
    OLDFIRMWARE_CONFIRM_TEXT: 'Continue',
    FIRMWARE_CONFIRM_DIALOG_HEADER: 'Firmware Update',
    FIRMWARE_CONFIRM_DIALOG_CONTENT:
      '<p>Updating the firmware will reboot the device, log out of the administrative app and return to the Home screen.</p>' +
      '<p>Are you sure you want to proceed?</p>',
    CURRENT_OPERATION_DOWNLOADING: 'Downloading Firmware',
    CURRENT_OPERATION_COPYING: 'Copying Firmware',
    CURRENT_OPERATION_UPDATING: 'Updating Firmware',
    CURRENT_OPERATION_WAITING_FOR_UPDATE: 'Waiting for Update',
    ERROR_DIALOG_HEADER_FIRMWARE_DEFAULT: 'Error Installing Firmware Update',
    ERROR_DIALOG_HEADER_FIRMWARE_DISCONNECT_DURING_UPDATE: 'Device Disconnected During Firmware Update',
    ERROR_DIALOG_CONTENT_FIRMWARE_DEFAULT: '<p>Unable to install firmware update. Please try again.</p>',
    ERROR_DIALOG_CONTENT_FIRMWARE_COPY_FAILURE: '<p>Unable to copy the firmware file. Please try again.</p>',
    ERROR_DIALOG_CONTENT_FIRMWARE_DISCONNECT_DURING_COPY:
      '<p>Unable to copy the firmware file. Please reconnect, sign in, and try again.</p>',
    ERROR_DIALOG_CONTENT_FIRMWARE_UPDATE_FAILURE: '<p>Unable to install firmware update. Please try again.</p>',
    ERROR_DIALOG_CONTENT_FIRMWARE_DISCONNECT_DURING_UPDATE: '<p>Please reconnect to check update progress.</p>',
    ERROR_DIALOG_CONTENT_FIRMWARE_DOWNLOAD: '<p>Unable to download the firmware update. Please try again.</p>',
    UPDATE_STUCK_DEVICE: '<p>Something went wrong in the device. Please reboot and try again.</p>',
    UPDATE_TIMEOUT: 'Firmware Update timed out',
    RESTART_DIALOG_HEADER: 'Rebooting',
  },
  STATUS_FAILURE: 'failure',
  UPDATE_URL: '/uploadFirmware',
  PROGRESS_TEXT: {
    DOWNLOAD: 'Downloading Firmware',
    COPY: 'Copying Firmware',
    FILESYSTEM: `Updating filesystem`,
    CAMERA: `Updating camera`,
    WAITING: 'Waiting for Update',
  },
};
