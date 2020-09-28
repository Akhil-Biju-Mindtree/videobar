import * as HID from 'node-hid';
import { DEVICE_CODES } from '../constants/device.constants';
import loggerService from '../../shared/logger/loggerService';

// Get the device path based on the usagepage.
const getAllDevices = () => {
  const devices = HID.devices();
  loggerService.trace(`device list:: ${JSON.stringify(devices)}`);
  const deviceInfo = devices.find((device: any) => {
    return (
      DEVICE_CODES['vid'].includes(device.vendorId) &&
      DEVICE_CODES['pid'].includes(device.productId) &&
      device.usagePage === DEVICE_CODES['usagePage']
    );
  });
  loggerService.trace(`HID device match found and path is ${deviceInfo.path}`);
  return deviceInfo.path;
};

// Device Instance created here----
const HIDInstanceSingleton = (() => {
  let instance; // add and chk
  return {
    // TODO The below will not handle 2 devices connection scenario. Changes yet to be done
    setDeviceHandle: () => {
      return new Promise((resolve, reject) => {
        loggerService.trace(`inside promise ${JSON.stringify(instance)}`);
        try {
          if (!instance) {
            const hidDevices = HID.devices();
            loggerService.trace(`Promise devices ${JSON.stringify(HID.devices())}`);
            hidDevices.forEach((hidDevice) => {
              if (
                DEVICE_CODES['vid'].includes(hidDevice.vendorId) &&
                DEVICE_CODES['pid'].includes(hidDevice.productId) &&
                hidDevice.usagePage === DEVICE_CODES['usagePage']
              ) {
                loggerService.trace(`inside set device handle ${JSON.stringify(hidDevice)}`);
                instance = new HID.HID(hidDevice.path);
                instance.constructor = null;
                resolve(instance);
              }
            });
          } else {
            resolve(instance);
          }
        } catch (err) {
          loggerService.error(`Can't get the HID path ::: ${err}`);
        }
      });
    },
    releaseDeviceHandler: () => {
      if (instance) {
        instance.close();
        instance = null;
      }
    },
  };
})();

export { HIDInstanceSingleton };
