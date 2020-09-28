import { SocketService } from 'app/providers/socket.service';
import { AppConfig } from '@environment/environment';
import { ProcessJsonResponseService } from 'app/providers/process-json-response.service';
import { Injector, Type } from '@angular/core';
import { Logger } from '@core/logger/Logger';
import { ErrorService } from '@core/error/error.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { AuthService } from '@core/auth/auth.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

export function serviceAdaptorFactory(depInjector: Injector) {
  const processJsonService = depInjector.get<ProcessJsonResponseService>(
    ProcessJsonResponseService as Type<ProcessJsonResponseService>,
  );
  const loggerService = depInjector.get<Logger>(Logger as Type<Logger>);
  const errorService = depInjector.get<ErrorService>(ErrorService as Type<ErrorService>);
  const notificationService = depInjector.get<NotificationService>(NotificationService as Type<NotificationService>);
  const authService = depInjector.get<AuthService>(AuthService as Type<AuthService>);
  const applicationDataManagerService = depInjector.get<ApplicationDataManagerService>(
    ApplicationDataManagerService as Type<ApplicationDataManagerService>,
  );
  if (!AppConfig.isDesktopApp) {
    return new SocketService(
      processJsonService,
      loggerService,
      errorService,
      notificationService,
      authService,
      applicationDataManagerService,
    );
  }
}
