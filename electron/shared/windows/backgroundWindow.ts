import { BrowserWindow, screen, ipcMain } from 'electron';
import deviceController from '../../../server/controllers/device.controller';
import * as path from 'path';
import * as url from 'url';
import { Subscription } from 'rxjs';
import loggerService from '../../../shared/logger/loggerService';
import { HIDInstanceSingleton } from '../../../server/services/deviceInstance.service';
import * as usbDetect from 'usb-detection';
const DeviceStatus = 'deviceStatus';
const AsynchronousChunkResponse = 'async-chunk-response';

const backgroundWindow = () => {
  const serve = process.argv.slice(1).some(val => val === '--serve');

  // Create the browser window.
  const browserWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800,
    height: 800,
    minWidth: 480,
    minHeight: 600,
    maxWidth: 480,
    maxHeight: 600,

    webPreferences: {
      nodeIntegration: true,
    },
    title: 'background',
    show: false,
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/../../../node_modules/electron`),
    });
    browserWindow.loadURL('http://localhost:4200');
  } else {
    browserWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '/../../../', 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  let deviceConnectionStatusSubscription = new Subscription();
  let devicelistenerSubscription = new Subscription();
  browserWindow.webContents.on('did-finish-load', () => {
    deviceConnectionStatusSubscription = deviceController.getDeviceConnectionStatus().subscribe((deviceStatus: any) => {
      if (deviceStatus === 'attach') {
        loggerService.trace('Came inside background after attach');
        devicelistenerSubscription = deviceController.listenFromDevice().subscribe((response: string) => {
          browserWindow.webContents.send(AsynchronousChunkResponse, response);
        });
      } else if (deviceStatus === 'detach') {
        loggerService.trace('Usb got detached');
        if (devicelistenerSubscription) {
          devicelistenerSubscription.unsubscribe();
        }
      }
      browserWindow.webContents.send(DeviceStatus, deviceStatus);
    });
  });
  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    if (devicelistenerSubscription) {
      devicelistenerSubscription.unsubscribe();
    }
    if (deviceConnectionStatusSubscription) {
      deviceConnectionStatusSubscription.unsubscribe();
    }
    HIDInstanceSingleton.releaseDeviceHandler();
    deviceController.releaseDeviceHandle();
    usbDetect.stopMonitoring();
    loggerService.trace(`Closed in background:${browserWindow}`);
  });

  return browserWindow;
};

export default backgroundWindow;
