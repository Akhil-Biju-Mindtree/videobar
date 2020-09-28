import { Injectable } from '@angular/core';
import { JsonSchemaValidatorService } from '@core/services/json-schema-validator.service';
import { ErrorService } from '@core/error/error.service';
import { Logger } from '@core/logger/Logger';

@Injectable()
export class AppInitService {
  constructor(
    private jsonSchemaValidatorService: JsonSchemaValidatorService,
    private errorService: ErrorService,
    private loggerService: Logger,
  ) {}

  init() {
    this.loggerService.trace(`App is initialized Started`);
    return new Promise<void>((resolve, reject) => {
      // !do your initialisation stuff here
      if (this.jsonSchemaValidatorService.isJsonSchemaValid()) {
        resolve();
      } else {
        this.errorService.showError('Please Verifiy JSON Schema');
        this.errorService.logError('Please Verifiy JSON Schema');
        reject();
      }
    });
  }
}
