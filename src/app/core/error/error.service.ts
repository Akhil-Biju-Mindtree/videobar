import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationData, NotificationType } from '@shared/components/notification/notification-model';
import * as errorMessages from './error.constants';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Logger } from '../logger/Logger';
import { AppConfig } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private notificationService: NotificationService, private logger: Logger) {}

  /**
   * this method is used to show the error message using notification service.
   * @param message
   *
   */
  showError(message) {
    const notificationData = new NotificationData();
    notificationData.message = message || errorMessages.defaultError;
    notificationData.messageType = NotificationType.error;
    notificationData.showButton = true;
    notificationData.buttonText = 'Close';
    if (!AppConfig.production) {
      this.notificationService.showNotification(notificationData);
    }
  }
  /**
   * This method handles the exceptions thrown in angular code
   * @param error
   */
  handleException(error) {
    this.logError(error);
    this.showError(errorMessages.ExceptionOccured);
  }

  logError(error) {
    this.logger.error(error);
  }
}
