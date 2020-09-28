import { NGXLogger, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
export const logMapper = {
  debug: NgxLoggerLevel.DEBUG,
  info: NgxLoggerLevel.INFO,
  warn: NgxLoggerLevel.WARN,
  error: NgxLoggerLevel.ERROR,
  trace: NgxLoggerLevel.TRACE,
  enableStorageLog: 0,
};
