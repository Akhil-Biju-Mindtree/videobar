import { Logger } from './Logger';
import { LoggerModule, NgxLoggerLevel, NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class WebLoggerService implements Logger {
  constructor(private logger: NGXLogger) {}

  debug(data) {
    this.logger.debug(data);
  }
  error(data) {
    this.logger.error(data);
  }
  info(data) {
    if (this.logger) {
      this.logger.info(data);
    }
  }
  warn(data) {
    this.logger.warn(data);
  }

  trace(data) {
    this.logger.trace(data);
  }
}
