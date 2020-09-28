import { Observable } from 'rxjs';
import * as usbDetect from 'usb-detection';
import { HIDInstanceSingleton } from '../services/deviceInstance.service';
import { SYSTEM_ERROR_CODES } from '../../shared/error/error.constants';
import { DeviceError } from '../../shared/error/error.model';
import { DEVICE_CODES, DEVICE_EVENTS } from '../constants/device.constants';
import loggerService from '../../shared/logger/loggerService';

export class DeviceController {
  public deviceHandle = null;
  public massStorageDeviceHandle = null;
  constructor() {}

  public usbDetectStartMonitoring = () => {
    usbDetect.startMonitoring();
  }
  /**
   * Dynamic detection of USB/HID device plugged or unplugged.
   */
  public getDeviceConnectionStatus = (): Observable<string> => {
    return new Observable((observer: any) => {
      try {
        /**
         * The below handler provides the first attached device.
         */
        HIDInstanceSingleton.setDeviceHandle()
          .then((instance: any) => {
            this.deviceHandle = instance;
            loggerService.trace(`inside default ${JSON.stringify(this.deviceHandle)}`);
            if (this.deviceHandle) {
              loggerService.trace('USB-HID device connected before starting app');
              observer.next(DEVICE_EVENTS['attach']);
            }
          })
          .catch((err: any) => {
            loggerService.error(`Can't get the device handle :: ${err}`);
          });
        usbDetect.on(DEVICE_EVENTS['add'], (device: any) => {
          loggerService.trace(`usb attach detected`);
          if (
            DEVICE_CODES['vid'].includes(device.vendorId) &&
            DEVICE_CODES['pid'].includes(device.productId) &&
            device.serialNumber === DEVICE_CODES.serialNumber
          ) {
            setTimeout(() => {
              loggerService.trace('USB-HID Attached');
              HIDInstanceSingleton.setDeviceHandle().then((instance) => {
                this.deviceHandle = instance;
                loggerService.trace(`got response ${JSON.stringify(this.deviceHandle)}`);
                if (this.deviceHandle) {
                  observer.next(DEVICE_EVENTS['attach']);
                }
              })
              .catch((err: any) => {
                loggerService.error(`Can't get the device handle :: ${err}`);
              });
            },         2200);
          }
        });
        usbDetect.on(DEVICE_EVENTS['remove'], (device: any) => {
          loggerService.trace(`usb deattach detected`);
          if (
            DEVICE_CODES['vid'].includes(device.vendorId) &&
            DEVICE_CODES['pid'].includes(device.productId) &&
            device.serialNumber === DEVICE_CODES.serialNumber
          ) {
            loggerService.trace('USB-HID Detached');
            HIDInstanceSingleton.releaseDeviceHandler();
            this.releaseDeviceHandle();
            observer.next(DEVICE_EVENTS['detach']);
          }
        });
      } catch (err) {
        loggerService.error('Device handle is null');
        const errorModel = new DeviceError();
        errorModel.code = SYSTEM_ERROR_CODES.ERROR3.code;
        errorModel.message = SYSTEM_ERROR_CODES.ERROR3.message;
        errorModel.innerException = err;
        loggerService.error(`error at deviceConnectionStatus::${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    });
  }

  /**
   * Dynamic detection of USB/MASS Storage device plugged or unplugged.
   */
  public getStorageDeviceConnectionStatus = (): Observable<string> => {
    return new Observable((observer: any) => {
      try {
        usbDetect.find((err, devices) => {
          devices.forEach((device: any) => {
            if (
              DEVICE_CODES['storagevid'] === device.vendorId &&
              DEVICE_CODES['storagepid'] === device.productId &&
              device.serialNumber === ''
            ) {
              loggerService.trace('Mass Storage device connected before starting app');
              observer.next(DEVICE_EVENTS['storageattach']);
            }
          });
        });
        usbDetect.on(DEVICE_EVENTS['add'], (storageDevice: any) => {
          if (
            storageDevice.vendorId === DEVICE_CODES['storagevid'] &&
            storageDevice.productId === DEVICE_CODES['storagepid'] &&
            storageDevice.serialNumber === ''
          ) {
            loggerService.trace('Mass Storage USB Attached');
            observer.next(DEVICE_EVENTS['storageattach']);
          }
        });
        usbDetect.on(DEVICE_EVENTS['remove'], (storageDevice: any) => {
          if (
            storageDevice.vendorId === DEVICE_CODES['storagevid'] &&
            storageDevice.productId === DEVICE_CODES['storagepid'] &&
            storageDevice.serialNumber === ''
          ) {
            loggerService.trace('Mass Storage USB Detached');
            this.massStorageDeviceHandle = null;
            observer.next(DEVICE_EVENTS['storagedetach']);
          }
        });
      } catch (err) {
        const errorModel = new DeviceError();
        errorModel.code = SYSTEM_ERROR_CODES.ERROR21.code;
        errorModel.message = SYSTEM_ERROR_CODES.ERROR21.message;
        errorModel.innerException = err;
        loggerService.error(`error at getStorageDeviceConnectionStatus::${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    });
  }

  /**
   * Writing chunks to device.
   */
  public writeChunk(chunk) {
    try {
      if (this.deviceHandle) {
        this.deviceHandle.write(chunk);
      }
    } catch (error) {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR4.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR4.message;
      errorModel.innerException = error;
      loggerService.error(`error at writeChunk::${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }

  public getDeviceHandle() {
    return this.deviceHandle;
  }
  /**
   * Function always listens from the device for any event emitted.
   */
  public listenFromDevice = (): Observable<string> => {
    if (this.deviceHandle == null) {
      HIDInstanceSingleton.setDeviceHandle().then((instance) => {
        this.deviceHandle = instance;
        if (this.deviceHandle == null) {
          const errorModel = new DeviceError();
          errorModel.code = SYSTEM_ERROR_CODES.ERROR12.code;
          errorModel.message = SYSTEM_ERROR_CODES.ERROR12.message;
          loggerService.error(`error at writeChunk::${JSON.stringify(errorModel)}`);
          throw errorModel;
        }
      })
      .catch((err: any) => {
        loggerService.error(`Can't get the device handle :: ${err}`);
      });
    }
    return new Observable((observer: any) => {
      const combinedPayload = [];
      this.deviceHandle.on('error', (error: any) => {
        loggerService.error(`error while reading from device : ${error}`);
      });
      this.deviceHandle.on('data', (data: Buffer) => {
        observer.next(data);
      });
    });
  }
  releaseDeviceHandle = () => {
    if (this.deviceHandle) {
      this.deviceHandle.close();
      this.deviceHandle = null;
    }
  }
}

// !Default export the instance of DeviceController instance
const DeviceControllerInstance = new DeviceController();
export default DeviceControllerInstance;
