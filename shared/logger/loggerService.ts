import * as logger from 'electron-log';
import * as fs from 'fs';
const path = require('path');
import { AppConfig } from '../configurations/configuration';

class LoggerService {
  constructor() {
    logger.transports.file.level = AppConfig.enableStorageLog
      ? (AppConfig.logLevel as logger.ILevelOption)
      : (AppConfig.enableStorageLog as logger.ILevelOption);
    logger.transports.console.level = AppConfig.enableConsoleLog
      ? (AppConfig.logLevel as logger.ILevelOption)
      : (AppConfig.enableConsoleLog as logger.ILevelOption);

    if (!AppConfig.enableConsoleLog) {
      logger.transports.mainConsole = null;
      logger.transports.rendererConsole = null;
    }

    const logFileName = AppConfig.logFileName.concat('.log');
    logger.transports.file.fileName = logFileName;
    logger.transports.file.maxSize = AppConfig.logFileSize;
    logger.transports.file.archiveLog = (currentLogFilePath: string) => {
      const info = path.parse(currentLogFilePath);
      let files: any;
      files = fs.readdirSync(info.dir);
      files = files.filter((logFiles: any) => {
        if (logFiles.indexOf(AppConfig.logFileName) > -1) {
          return logFiles;
        }
      });
      files.sort();
      if (files.length >= AppConfig.logsFileCount) {
        fs.unlink(path.join(info.dir, files[1]), (err: any) => {
          if (err) {
            throw err;
          }
        });
      }

      try {
        const fileName = info.name.split('.log');
        fs.renameSync(
          currentLogFilePath,
          path.join(info.dir, fileName[0].concat(new Date().getTime().toString(), '-archive', '.log')),
        );
      } catch (e) {}
    };
  }

  debug(data) {
    // logger.debug(data);
  }

  info(data) {
    // logger.info(data);
  }
  warn(data) {
    // logger.warn(data);
  }
  error(data) {
    logger.error(data);
  }

  trace(data) {
    // logger.verbose(data);
  }
}

const CommonLoggerInstance = new LoggerService();
export default CommonLoggerInstance;
