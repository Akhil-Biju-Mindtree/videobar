import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { ServiceAdapter } from './service-adapter';
import { Subject } from 'rxjs';
import { AppConstants } from '@core/constants/app.constant';
import * as errorConstants from '@core/error/error.constants';
import { ErrorService } from '@core/error/error.service';
import { Logger } from '@core/logger/Logger';
import { DeviceRepository } from '@core/services/deviceRepository.service';
import { ProcessJsonResponseService } from 'app/providers/process-json-response.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { SharedConstants } from '../../../shared/constants/shared.constants';

@Injectable()
export class ElectronService implements ServiceAdapter {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  requestMap: { [key: string]: Subject<any> } = {};
  getDeviceConnectionStatus = new Subject<string>();

  constructor(
    private errorService: ErrorService,
    private loggerService: Logger,
    private deviceRepository: DeviceRepository,
    private processJsonService: ProcessJsonResponseService,
    private applicationDataManagerService: ApplicationDataManagerService,
  ) {
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      this.ipcRenderer.on(SharedConstants.Channels.ERROR_RESPONSE, (event, arg) => {
        this.errorService.showError(errorConstants.DeviceError);
        this.processJsonService.revertDataFromCacheOnError(arg);
      });

      const title = this.remote.getCurrentWindow().getTitle();

      this.checkBackgroundWindow(title);

      this.ipcRenderer.on(SharedConstants.Channels.ASYNCHRONOUS_RESPONSE, (event, argument) => {
        let arg;
        if (this.processJsonService.isJsonString(argument)) {
          arg = JSON.parse(argument);
        }
        this.processJsonService.processJson(arg);

        if (arg.id in this.requestMap) {
          // manually emitting/triggering event
          this.requestMap[arg.id].next(arg.data);
          this.requestMap[arg.id].complete();
          delete this.requestMap[arg.id];
        }
      });

      this.ipcRenderer.on(SharedConstants.Channels.DEVICE_STATUS, (event, device) => {
        this.getDeviceConnectionStatus.next(device);
      });

      this.ipcRenderer.on(SharedConstants.Channels.COPY_PROGRESS_RESPONSE, (event, progressPercent) => {
        this.applicationDataManagerService.saveToAppData({ CopyProgress: progressPercent });
      });
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  private checkBackgroundWindow(title: string) {
    if (title === AppConstants.BACKGROUND) {
      this.ipcRenderer.on(SharedConstants.Channels.ASYNCHRONOUS_CHUNK_RESPONSE, (event, payload) => {
        const response = this.deviceRepository.deviceResponseInChunk(payload);
        if (response != null) {
          this.ipcRenderer.send(SharedConstants.Channels.COMBINED_RESPONSE, response);
        }
      });
      this.ipcRenderer.on(SharedConstants.Channels.ASYNCHRONOUS_REQUEST_ACTION, (event, payload) => {
        this.deviceRepository.writeChunkFn = this.writeChunk;
        this.deviceRepository[payload.action](payload);
      });
    }
  }

  send(request: any) {
    try {
      this.ipcRenderer.send(SharedConstants.Channels.ASYNCHRONOUS_REQUEST, request);
    } catch (err) {
      this.loggerService.error('ElectronService::send::catch');
    }
  }

  responseCallBack = (payload: any) => {
    return () => {
      const response = this.deviceRepository.deviceResponseInChunk(payload);
      if (response != null) {
        this.ipcRenderer.send('combined-response', response);
      }
    };
  }

  /**
   * Function returns the chunk processed to the write method in device controller to write to device.
   */
  writeChunk = (temparray: []) => {
    this.ipcRenderer.send(SharedConstants.Channels.CHUNK_PROCESS_COMPLETE, temparray);
  }

  releaseResources() {
    this.ipcRenderer.eventNames().forEach((channel: any) => {
      this.ipcRenderer.removeAllListeners(SharedConstants.Channels[channel]);
    });
  }
}
