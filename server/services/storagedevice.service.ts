import { list } from 'drivelist';
import { Observable, Subject } from 'rxjs';
import * as progressStream from 'progress-stream';
import * as fs from 'fs';
import * as path from 'path';
import loggerService from '../../shared/logger/loggerService';
import fileCopyProgressService from '../../shared/fileCopyProgress/fileCopyProgressService';
import { SharedConstants } from '../../shared/constants/shared.constants';
import fileLocationMainService from '../../shared/fileLocationMain/fileLocationMainService';
const FWFILENAME = 'FWfile';
const LOGILENAME = 'logs.zip';
const DONEFWFILE = '.fwcopydone.txt';
const DONELOGFILE = '.logcopydone.txt';
const DRIVEENUMERATIONWIN = 'USBSTOR';
const DRIVEDESCWIN = 'Bose Vid eobar VB1mass st USB Device';
const DRIVEENUMERATIONMAC = 'DiskArbitration';
const DRIVEDESCMAC = 'Bose Vid eobar VB1mass st Media';
const WRITE_DISCONNECT_ERROR_KEY = 'ENOENT';

let _source;
let stat;
let str;
let getDriveRetryCount;
const getDriveRetryMaxCount = 2;

const createDoneFile = (drivePath: string, doneFileName: string) => {
  let fd;
  try {
    fd = fs.openSync(`${drivePath}/${doneFileName}`, 'w+');
    if (fd !== undefined) {
      loggerService.trace(`${drivePath}/${doneFileName} file created`);
    }
  } catch (error) {
    loggerService.error(`error occured in createDoneFile(): ${error}`);
    throw error;
  } finally {
    if (fd !== undefined) {
      fs.closeSync(fd);
    }
  }
};

const copyFile = (source, target, drive, isLogDownload?) => {
  const rd = fs.createReadStream(source);
  rd.on('error', (err: any) => {
    fileCopyProgressService.setFileCopyProgress(SharedConstants.statusfailure);
    loggerService.error(`Error occured while copying: ${err}`);
  });

  const wr = fs.createWriteStream(target);

  wr.on('error', (err: any) => {
    loggerService.trace(`Write error::::: ${err}`);
    if (!err.toString().match(WRITE_DISCONNECT_ERROR_KEY)) {
      fileCopyProgressService.setFileCopyProgress(SharedConstants.statusfailure);
      loggerService.error(`Error occured while copying: ${err}`);
      if (isLogDownload) {
        createDoneFile(drive, DONELOGFILE);
      } else {
        createDoneFile(drive, DONEFWFILE);
      }
    }
  });

  wr.on('close', (ex: any) => {
    loggerService.trace(`${target} file copy done`);
    if (isLogDownload) {
      createDoneFile(drive, DONELOGFILE);
    } else {
      createDoneFile(drive, DONEFWFILE);
    }
  });

  rd.pipe(str).pipe(wr);
};

// file copy from src to mass storage drive
export const fileCopyToStorage = (srcfilepath: string, evkDrive: string, evkfilename: string) => {
  const EVKPATH = `${evkDrive}/${evkfilename}`;
  _source = path.resolve(srcfilepath);
  stat = fs.statSync(_source);
  str = progressStream({
    length: stat.size,
    time: 100,
  });
  loggerService.trace(`EVKPATH: ${EVKPATH}`);
  try {
    loggerService.trace(`${srcfilepath} copying started`);
    str.on('progress', (progress: any) => {
      if (parseInt(progress, 10)) {
        loggerService.trace('File Copy Done Successfully');
      }
      fileCopyProgressService.setFileCopyProgress(parseInt(progress.percentage, 10));
    });
    copyFile(_source, EVKPATH, evkDrive);
  } catch (error) {
    loggerService.error(`Error occured while copying fileCopyToStorage(): ${error}`);
    throw error;
  }
};

const sleep = (ms: number) => {
  return new Promise((resolve: any) => {
    setTimeout(resolve, ms);
  });
};

// sleep for miliseconds
const waitfor = async (ms: number) => {
  await sleep(ms);
};

const getAllDrives = async () => {
  // wait for 5-10 secs to detect removable disks once device enumerates as mass storage device
  let massStorgaeDrive;
  try {
    await waitfor(5000);
    const drives = await list();
    loggerService.trace(`All Drives detected:::: ${JSON.stringify(drives)}`);
    massStorgaeDrive = drives.filter((drive: any) => {
      return (
        (drive.enumerator === DRIVEENUMERATIONWIN || drive.enumerator === DRIVEENUMERATIONMAC) &&
        drive.isRemovable &&
        (drive.description === DRIVEDESCWIN || drive.description === DRIVEDESCMAC)
      );
    });
  } catch (error) {
    loggerService.error(`Error occured in getAllDrives(): ${error}`);
    throw error;
  }
  return massStorgaeDrive;
};

export const getMassStorageDrive = async () => {
  let drivename;
  try {
    let removableDrive = await getAllDrives();
    if (removableDrive.length === 0) {
      for (
        getDriveRetryCount = 0;
        getDriveRetryCount < getDriveRetryMaxCount;
        getDriveRetryCount = getDriveRetryCount + 1
      ) {
        loggerService.trace(`Retrying to find drive::: ${getDriveRetryCount + 1}`);
        const drivesDetected = await getAllDrives();
        removableDrive = drivesDetected;
        if (drivesDetected.length > 1) {
          loggerService.trace(`Multiple Mass storage disk is detected`);
          break;
        } else if (drivesDetected.length === 1) {
          drivename = removableDrive[0].mountpoints[0].path;
          loggerService.trace(`drivename: ${drivename}`);
          break;
        }
      }
      if (removableDrive.length === 0) {
        loggerService.trace(`No Raphael Mass storage disk is detected`);
      }
    } else if (removableDrive.length > 1) {
      loggerService.trace(`Multiple Mass storage disk is detected`);
    } else {
      // assuming removableDrive gives only one drive
      drivename = removableDrive[0].mountpoints[0].path;
      loggerService.trace(`drivename: ${drivename}`);
    }
  } catch (error) {
    loggerService.error(`Error occured in getMassStorageDrive(): ${error}`);
    throw error;
  }
  return drivename;
};

// fwFilePath is the absolute FW file path
export const fwCopy = async (fwFilePath: string) => {
  try {
    loggerService.trace('starting copy of FW file');
    const drive = await getMassStorageDrive();
    loggerService.trace(`File Path:::: ${fwFilePath}`);
    if (fwFilePath) {
      if (drive) {
        loggerService.trace(`drive defined: ${drive}`);
        fileCopyToStorage(fwFilePath, drive, FWFILENAME);
      } else {
        fileCopyProgressService.setFileCopyProgress(SharedConstants.statusfailure);
        loggerService.trace(`drive undefined: ${drive}`);
      }
    } else if (drive) {
      createDoneFile(drive, DONEFWFILE);
    }
  } catch (error) {
    loggerService.error(`Error occured in fwCopy(): ${error}`);
    // reject promise when throwing exception from async function
    return Promise.reject(error);
  }
};

// log file copy from mass storage to destination path
export const fileCopyFromStorage = (drive: string, destPath: string, evkfilename: string) => {
  const SYSTEMPATH = `${destPath}`;
  _source = path.resolve(`${drive}/${evkfilename}`);
  stat = fs.statSync(_source);
  str = progressStream({
    length: stat.size,
    time: 100,
  });
  loggerService.trace(`EVKPATH: ${SYSTEMPATH}`);
  try {
    loggerService.trace(`${_source} copying started`);
    str.on('progress', (progress: any) => {
      fileCopyProgressService.setFileCopyProgress(parseInt(progress.percentage, 10));
      if (parseInt(progress, 10)) {
        loggerService.trace('File copy done Successfully!');
      }
    });
    copyFile(_source, SYSTEMPATH, drive, true);
  } catch (error) {
    loggerService.error(`Error occured while copying fileCopyFromStorage(): ${error}`);
    throw error;
  }
};

// logFilePath is the destination folder where log file should be copied
export const logCopy = async () => {
  try {
    loggerService.trace('starting copy of Log file');
    const drive = await getMassStorageDrive();
    const logFilePath = fileLocationMainService.getFileLocation();
    loggerService.trace(`File Path:::: ${logFilePath}`);
    if (logFilePath) {
      if (drive) {
        loggerService.trace(`drive defined: ${drive}`);
        fileCopyFromStorage(drive, logFilePath, LOGILENAME);
      } else {
        fileCopyProgressService.setFileCopyProgress(SharedConstants.statusfailure);
        loggerService.trace(`drive undefined: ${drive}`);
      }
    } else if (drive) {
      createDoneFile(drive, DONELOGFILE);
      fileLocationMainService.setFileTransferMode(null);
    }
  } catch (error) {
    loggerService.error(`Error occured in logCopy(): ${error}`);
    // reject promise when throwing exception from async function
    return Promise.reject(error);
  }
};
