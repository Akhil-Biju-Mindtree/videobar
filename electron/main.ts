import { app, ipcMain } from 'electron';
import mainWindow from './shared/windows/mainWindow';
import errorDialog from './shared/dialog/errorDialog';
import backgroundWindow from './shared/windows/backgroundWindow';
import loggerService from '../shared/logger/loggerService';
import deviceController from '../server/controllers/device.controller';
import fileLocationMainService from '../shared/fileLocationMain/fileLocationMainService';
import { SharedConstants } from '../shared/constants/shared.constants';
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const AsynchronousRequest = SharedConstants.Channels.ASYNCHRONOUS_REQUEST;
const AsynchronousRequestAction = SharedConstants.Channels.ASYNCHRONOUS_REQUEST_ACTION;
const AsynchronousResponse = SharedConstants.Channels.ASYNCHRONOUS_RESPONSE;
const CombinedResponse = SharedConstants.Channels.COMBINED_RESPONSE;
const ChunkProcessComplete = SharedConstants.Channels.CHUNK_PROCESS_COMPLETE;
const ErrorResponse = SharedConstants.Channels.ERROR_RESPONSE;
const FilePath = SharedConstants.Channels.FILE_PATH;
const InvalidAction = '\\ue002';
const InvalidProperty = '\\ue004';
const PropertyOutofRange = '\\ue003';
const FileTransferMode = SharedConstants.Channels.TRANSFER_MODE;

app.disableHardwareAcceleration();

try {
  let browsermainWindow;
  let backgroundmainWindow;
  let isIPCsubscribed = false;

  const primaryInstanceLock = app.requestSingleInstanceLock();
  if (!primaryInstanceLock) {
    app.quit();
    process.exit(0);
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Request for Second instance, main window is focussed if it exists.
      if (browsermainWindow) {
        if (browsermainWindow.isMinimized()) {
          browsermainWindow.restore();
        }
        browsermainWindow.focus();
      }
    });
  }

  const closeBrowserWindow = () => {
    browsermainWindow.on('closed', () => {
      loggerService.trace('came inside browserwindow close event');
      ipcMain.eventNames().forEach((channel: any) => ipcMain.removeAllListeners(channel));
      backgroundmainWindow.close();
      browsermainWindow = null;
    });
  };

  const isJsonString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const subscribeToIPCListeners = () => {
    isIPCsubscribed = true;
    // ! Global Method to write into the device
    ipcMain.on(AsynchronousRequest, (event, arg) => {
      try {
        backgroundmainWindow.webContents.send(AsynchronousRequestAction, arg);
      } catch (err) {
        loggerService.error(`ipcMain::on::AsynchronousRequest::catch::${JSON.stringify(err)}`);
      }
    });

    ipcMain.on(CombinedResponse, (event, arg) => {
      if (
        arg.indexOf(PropertyOutofRange) > -1 ||
        arg.indexOf(InvalidProperty) > -1 ||
        arg.indexOf(InvalidAction) > -1
      ) {
        browsermainWindow.webContents.send(ErrorResponse, arg);
      } else {
        browsermainWindow.webContents.send(AsynchronousResponse, arg);
      }
    });

    ipcMain.on(ChunkProcessComplete, (event, arg) => {
      try {
        deviceController.writeChunk(arg);
      } catch (err) {
        loggerService.error(`ipcMain::on::chunk-process-complete-bg::catch::${JSON.stringify(err)}`);
      }
    });

    ipcMain.on(FilePath, (event, arg) => {
      loggerService.trace(`Received file path value ${arg}`);
      fileLocationMainService.setFileLocation(arg);
    });
    ipcMain.on(FileTransferMode, (event, arg) => {
      loggerService.trace(`Received transfer mode with value ${arg}`);
      fileLocationMainService.setFileTransferMode(arg);
    });
  };

  app.on('ready', () => {
    try {
      loggerService.trace('start from electron main');
      browsermainWindow = mainWindow();
      backgroundmainWindow = backgroundWindow();
      subscribeToIPCListeners();
      loggerService.trace('next will go inside close browserwindow function');
      closeBrowserWindow();
      autoUpdater.checkForUpdatesAndNotify();
    } catch (ex) {
      loggerService.error(`uncaught exception: ${ex}`);
      errorDialog('Error', 'Not able to start the application. Please contact system administrator');
    }
  });

  app.on('quit', () => {
    loggerService.trace('came inside quit');
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    loggerService.trace('came inside window-all-closed');
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    backgroundmainWindow = null;
    browsermainWindow = null;
    isIPCsubscribed = false;
    /** Uncomment this code if the application has to be persisted on the MAC dock bar
    // if (process.platform !== 'darwin') {
    // app.quit();
    // process.exit(0);
    // }
    */
    app.quit();
  });

  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the request)
    // and say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
  });

  app.on('activate', () => {
    loggerService.trace('Now your app will start');
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!browsermainWindow) {
      browsermainWindow = mainWindow();
      backgroundmainWindow = backgroundWindow();
      if (!isIPCsubscribed) {
        subscribeToIPCListeners();
        deviceController.usbDetectStartMonitoring();
      }
      closeBrowserWindow();
    }
  });

  process.on('uncaughtException', (err: any) => {
    loggerService.error(`uncaught exception: ${err}`);
    if (isJsonString(err)) {
      browsermainWindow.webContents.send(ErrorResponse, err);
    }
  });
} catch (e) {
  loggerService.error(`error in IPC main AsynchronousRequest::${JSON.stringify(e)}`);
}
