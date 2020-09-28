import { Injectable } from '@angular/core';
import { Logger } from '@core/logger/Logger';
import { ipcRenderer, ipcMain } from 'electron';
import { AppConstants } from '@core/constants/app.constant';
import { UtilitiesService } from '@providers/utilities.service';
import { QueueService } from '@providers/queue.service';
import { DeviceError } from './../../../../shared/error/error.model';
import { SYSTEM_ERROR_CODES } from '../../../../shared/error/error.constants';

@Injectable({
  providedIn: 'root',
})
/**
 * Function gets the chunk from listen method and chunk processing and combining after all the chunk processing is done here.
 */
export class DeviceRepository {
  writeChunkFn: Function;

  constructor(
    private loggerService: Logger,
    private utilityService: UtilitiesService,
    private timedQueueService: QueueService,
  ) {}
  private combinedPayload = [];
  deviceResponseInChunk = (payload: any): string | null => {
    const packetStream = this.utilityService.sliceBufferStream(payload);
    if (packetStream.packetPosition === AppConstants.PacketPosition.FIRST) {
      this.combinedPayload = [];
    }
    this.combinedPayload = this.combinedPayload.concat(packetStream.outputIntegerStream);
    if (packetStream.packetPosition === AppConstants.PacketPosition.LAST) {
      return this.utilityService.decodeFromBase64(this.combinedPayload);
    }
  }

  /**
   * Function used for reading the data from device..
   * Need to call listenFromDevice to get the data
   */
  retrieve = (payload: any) => {
    if (payload.action === AppConstants.Action.Retrieve) {
      try {
        this.writeToDevice(payload);
      } catch (error) {
        const errorModel = new DeviceError();
        errorModel.innerException = error;
        this.loggerService.error(`${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    } else {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR6.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR6.message;
      this.loggerService.error(`Not a retrieved function : ${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }
  /**
   *  Function used for updating the data to the device..
   */
  // tslint:disable-next-line
  update = (payload: any) => {
    if (payload.action === AppConstants.Action.Update) {
      try {
        this.writeToDevice(payload);
      } catch (error) {
        const errorModel = new DeviceError();
        errorModel.innerException = error;
        this.loggerService.error(`${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    } else {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR7.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR7.message;
      this.loggerService.error(`Not a update function : ${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }
  /**
   * Function used for deleting the data in the device..
   */
  // tslint:disable-next-line
  delete = (payload: any) => {
    if (payload.action === AppConstants.Action.Delete) {
      try {
        this.writeToDevice(payload);
      } catch (error) {
        const errorModel = new DeviceError();
        errorModel.innerException = error;
        this.loggerService.error(`${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    } else {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR8.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR8.message;
      this.loggerService.error(`Not a delete function : ${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }

  /**
   * Function used for subscribing all the data from device...
   */
  // tslint:disable-next-line
  subscribeall = (payload: any) => {
    if (payload.action === AppConstants.Action.SubscribeAll) {
      try {
        this.writeToDevice(payload);
      } catch (error) {
        const errorModel = new DeviceError();
        errorModel.innerException = error;
        this.loggerService.error(`${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    } else {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR9.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR9.message;
      this.loggerService.error(`Not a subscribeall function : ${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }
  /**
   * Function used for subscribing the data from device...
   */
  // tslint:disable-next-line
  subscribe = (payload: any) => {
    if (payload.action === AppConstants.Action.Subscribe) {
      try {
        this.writeToDevice(payload);
      } catch (error) {
        const errorModel = new DeviceError();
        errorModel.innerException = error;
        this.loggerService.error(`${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    } else {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR9.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR9.message;
      this.loggerService.error(`Not a subscribe function : ${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }
  /**
   * Function used for performing to the device...
   */
  // tslint:disable-next-line
  perform = (payload: any) => {
    if (payload.action === AppConstants.Action.Perform) {
      try {
        this.writeToDevice(payload);
      } catch (error) {
        const errorModel = new DeviceError();
        errorModel.innerException = error;
        this.loggerService.error(`${JSON.stringify(errorModel)}`);
        throw errorModel;
      }
    } else {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR9.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR9.message;
      this.loggerService.error(`Not a perform function : ${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }

  /**
   * Function used for writing to the device.
   */
  writeToDevice = (payload: any) => {
    try {
      const integerStreamWholePacket = this.utilityService.concateOctateToPerformWriteOperation(
        JSON.stringify(payload, null, 2),
      );
      let index;
      let temparray = [];
      const chunk = 64;
      const totalpacketSize = integerStreamWholePacket.length;
      for (index = 0; index < totalpacketSize; index += chunk) {
        temparray = integerStreamWholePacket.slice(index, index + chunk);
        temparray.unshift(0);
        temparray.fill(0x04, 0, 1);
        if (temparray.length < chunk) {
          while (true) {
            temparray.push(0xff);
            if (temparray.length === chunk + 1) {
              break;
            }
          }
        }
        const addToQueue = this.wrapFunction(this.writeChunkFn, null, temparray);
        this.timedQueueService.addTask(addToQueue, AppConstants.QUEUE_DELAY);
      }
    } catch (err) {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR4.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR4.message;
      errorModel.innerException = err;
      this.loggerService.error(`Writing to the device failed : ${JSON.stringify(errorModel)}`);
      throw errorModel;
    }
  }

  /**
   * Function wraps the function writeChunk by passing the parameter to them.
   */
  wrapFunction = (writeChunk: any, context: any, params: any[]) => {
    return () => {
      writeChunk.call(context, params);
    };
  }
}
