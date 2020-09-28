import { BrowserWindow, nativeImage, shell, Menu, app, dialog } from 'electron';
import deviceController from '../../../server/controllers/device.controller';
import * as path from 'path';
import * as url from 'url';
import * as https from 'https';
import { Subscription } from 'rxjs';
import loggerService from '../../../shared/logger/loggerService';
import { DEVICE_EVENTS } from '../../../server/constants/device.constants';
import { fwCopy, logCopy } from '../../../server/services/storagedevice.service';
import fileLocationMainService from '../../../shared/fileLocationMain/fileLocationMainService';
import fileCopyProgressService from '../../../shared/fileCopyProgress/fileCopyProgressService';
import { SharedConstants } from '../../../shared/constants/shared.constants';

const AsynchronousResponse = 'asynchronous-response';
const DeviceStatus = 'deviceStatus';
const CopyProgressResponse = 'copy-progress-response';

const mainWindow = () => {
  const serve = process.argv.slice(1).some(val => val === '--serve');

  // Create the browser window.
  // !If devTools is disabled then hide the menubar
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
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath(`${__dirname}/../../../dist/assets/images/bose_logo.png`),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    title: 'Bose Work Configuration',
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
  });
  const isMac = process.platform === 'darwin';

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Bose Work Configuration',
      submenu: [
        { label: 'About Bose Work Configuration', role: 'about' },
        { type: 'separator' },
        { label: 'Hide Bose Work Configuration', role: 'hide' },
        { role: 'hideOthers' },
        { type: 'separator' },
        { label: 'Quit Bose Work Configuration', role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    { role: 'window', submenu: [{ role: 'minimize' }, { role: 'close' }, { type: 'separator' }] },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            require('electron').shell.openExternal(SharedConstants.MAC_SUBMENU_LINKS.LEARN_MORE);
          },
        },
        {
          label: 'VB1 User Manual',
          click() {
            https
              .get(SharedConstants.MAC_SUBMENU_LINKS.LATEST_VERSION, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                  data += chunk;
                });
                response.on('end', () => {
                  const redirectURL = SharedConstants.MAC_SUBMENU_LINKS.VB1_USER_MANUAL.replace(
                    '{version}',
                    JSON.parse(data).latestVersion,
                  );
                  require('electron').shell.openExternal(redirectURL);
                });
              })
              .on('error', (err) => {
                dialog.showErrorBox('Connection Error', 'Please check your internet connectivity.');
              });
          },
        },
      ],
    },
  ];

  if (isMac) {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    browserWindow.setMenu(null);
  }

  if (serve) {
    browserWindow.webContents.openDevTools({ mode: 'detach' });
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
    deviceController.usbDetectStartMonitoring();
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
    loggerService.trace('came inside mainWindow close');
    if (browserWindow.webContents.isDevToolsOpened()) {
      browserWindow.webContents.closeDevTools();
    }
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
