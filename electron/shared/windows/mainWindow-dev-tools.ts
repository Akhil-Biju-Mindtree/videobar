import { BrowserWindow, nativeImage, screen, shell } from 'electron';
import deviceController from '../../../server/controllers/device.controller';
import * as path from 'path';
import * as url from 'url';
import { Subscription } from 'rxjs';
import loggerService from '../../../shared/logger/loggerService';
import { DEVICE_EVENTS } from '../../../server/constants/device.constants';
import { fwCopy, logCopy } from '../../../server/services/storagedevice.service';
import fileLocationMainService from '../../../shared/fileLocationMain/fileLocationMainService';
import fileCopyProgressService from '../../../shared/fileCopyProgress/fileCopyProgressService';

const AsynchronousResponse = 'asynchronous-response';
const DeviceStatus = 'deviceStatus';
const CopyProgressResponse = 'copy-progress-response';

const mainWindow = () => {
  const serve = process.argv.slice(1).some(val => val === '--serve');

  // Create the browser window.
  // !If devTools is enabled for Testing & debuging purpose then show the menuBar
  const browserWindow = new BrowserWindow({
    // Size adjusted as the window gets resized while draging.
    width: 480,
    height: 570,
    minWidth: 480,
    minHeight: 570,
    maxWidth: 480,
    maxHeight: 570,
    useContentSize: true,
    resizable: false,
    icon: nativeImage.createFromPath(`${__dirname}/../../../dist/assets/images/bose_logo.png`),
    webPreferences: {
      nodeIntegration: true,
    },
    title: 'Bose Work Configuration',
    maximizable: false,
  });

  if (serve) {
    browserWindow.webContents.openDevTools();
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
  let deviceListenerSubscription: Subscription = null;
  let deviceMassStorageListenerSubscription: Subscription = null;
  let massStoragelistenerSubscription: Subscription = null;
  browserWindow.webContents.on('did-finish-load', () => {
    deviceListenerSubscription = deviceController.getDeviceConnectionStatus().subscribe((deviceStatus: any) => {
      if (deviceStatus === 'attach') {
        loggerService.trace('Came inside mainwindow after attach');
      } else if (deviceStatus === 'detach') {
        loggerService.trace('Usb got detached');
      }
      browserWindow.webContents.send(DeviceStatus, deviceStatus);
    });
    deviceMassStorageListenerSubscription = deviceController.getStorageDeviceConnectionStatus().subscribe((deviceStatus: any) => {
      if (deviceStatus === DEVICE_EVENTS['storageattach']) {
        loggerService.trace('Angular catches mass storage attach event ----');
        massStoragelistenerSubscription = fileCopyProgressService
          .getFileCopyProgress()
          .subscribe((progressStatus: any) => {
            browserWindow.webContents.send(CopyProgressResponse, progressStatus);
          });
        if (fileLocationMainService.getFileTransferMode() === 'log') {
          loggerService.trace('will start copying of Log file');
          logCopy().catch((error: any) => {
            loggerService.error(`error occured in getStorageDeviceConnectionStatus: ${error}`);
          });
        } else {
          loggerService.trace('will start copying of FW file');
          fwCopy(fileLocationMainService.getFileLocation()).catch((error: any) => {
            loggerService.error(`error occured in getStorageDeviceConnectionStatus: ${error}`);
          });
        }
      } else if (deviceStatus === DEVICE_EVENTS['storagedetach']) {
        loggerService.trace('Angular catches mass storage detach event ------');
        if (massStoragelistenerSubscription) {
          massStoragelistenerSubscription.unsubscribe();
        }
      }
      browserWindow.webContents.send(DeviceStatus, deviceStatus);
    });
  });

  // to open a URL in default browser
  browserWindow.webContents.on('new-window', (e, URL) => {
    e.preventDefault();
    shell.openExternal(URL);
  });

  browserWindow.on('close', () => {
    loggerService.trace('came inside mainWindow devtools');
    if (deviceListenerSubscription) {
      deviceListenerSubscription.unsubscribe();
    }
    if (deviceMassStorageListenerSubscription) {
      deviceMassStorageListenerSubscription.unsubscribe();
    }
  });

  return browserWindow;
};

export default mainWindow;
