import { ErrorService } from '@core/error/error.service';
import { DeviceRepository } from '@core/services/deviceRepository.service';
import { ElectronService } from 'app/providers/electron.service';
import { Injector, Type } from '@angular/core';
import { Logger } from '@core/logger/Logger';
import { AppConfig } from '@environment/environment';
import { ProcessJsonResponseService } from 'app/providers/process-json-response.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

export function serviceAdaptorFactory(depInjector: Injector) {
  const errorService = depInjector.get<ErrorService>(ErrorService as Type<ErrorService>);
  const loggerService = depInjector.get<Logger>(Logger as Type<Logger>);
  const deviceRepository = depInjector.get<DeviceRepository>(DeviceRepository as Type<DeviceRepository>);
  const processJsonService = depInjector.get<ProcessJsonResponseService>(
    ProcessJsonResponseService as Type<ProcessJsonResponseService>,
  );
  const applicationDataManagerService = depInjector.get<ApplicationDataManagerService>(
    ApplicationDataManagerService as Type<ApplicationDataManagerService>,
  );
  if (AppConfig.isDesktopApp) {
    return new ElectronService(
      errorService,
      loggerService,
      deviceRepository,
      processJsonService,
      applicationDataManagerService,
    );
  }
}
