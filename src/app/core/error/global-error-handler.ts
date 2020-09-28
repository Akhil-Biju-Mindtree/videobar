import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ErrorService } from 'app/core/error/error.service';
import { Logger } from '../logger/Logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private errorService: ErrorService) {}

  handleError(error: Error) {
    const errorService = this.injector.get(ErrorService);
    errorService.logError(`Caught by global error handler:: ${error}`);
    errorService.handleException(error);
  }
}
