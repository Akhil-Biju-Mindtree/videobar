import { Logger } from './Logger';
import { AppConfig } from '@environment/environment';
export class ElectronLoggerService implements Logger {
  electronLogger;
  path;
  fs;

  /** Dynamically loading electron-log module and restrict the file size inside constructor */
  constructor() {
    this.path = window.require('path');
    this.fs = window.require('fs');
    this.electronLogger = window.require('electron-log');
    this.electronLogger.transports.file.level = AppConfig.enableStorageLog
      ? AppConfig.logLevel
      : AppConfig.enableStorageLog;
    this.electronLogger.transports.console.level = AppConfig.enableConsoleLog
      ? AppConfig.logLevel
      : AppConfig.enableConsoleLog;
    if (!AppConfig.enableConsoleLog) {
      this.electronLogger.transports.mainConsole = null;
      this.electronLogger.transports.rendererConsole = null;
    }
    const logFileName = AppConfig.logFileName.concat('.log');
    this.electronLogger.transports.file.fileName = logFileName;
    this.electronLogger.transports.file.maxSize = AppConfig.logFileSize;
    this.electronLogger.transports.file.archiveLog = (currentLogFilePath: string) => {
      const info = this.path.parse(currentLogFilePath);
      let files: any;
      files = this.fs.readdirSync(info.dir);
      files = files.filter((logFiles: any) => {
        if (logFiles.indexOf(AppConfig.logFileName) > -1) {
          return logFiles;
        }
      });
      files.sort();
      if (files.length >= AppConfig.logsFileCount) {
        this.fs.unlink(this.path.join(info.dir, files[1]), (err: any) => {
          if (err) {
            throw err;
          }
        });
      }

      try {
        const fileName = info.name.split('.log');
        this.fs.renameSync(
          currentLogFilePath,
          this.path.join(info.dir, fileName[0].concat(new Date().getTime().toString(), '-archive', '.log')),
        );
      } catch (e) {}
    };
  }

  debug(data) {
    this.electronLogger.debug(data);
  }
  error(data) {
    this.electronLogger.error(data);
  }
  info(data) {
    this.electronLogger.info(data);
  }
  warn(data) {
    this.electronLogger.warn(data);
  }
  trace(data) {
    this.electronLogger.verbose(data);
  }
}
