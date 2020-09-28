import { Injectable, Output, EventEmitter, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { NotificationData } from './notification-model';
import { WebsocketErrorNotificationComponent } from '@core/websocket-error-notification/websocket-error-notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  @Output() change: EventEmitter<string> = new EventEmitter();
  private snackBarRef: MatSnackBarRef<any>;

  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  showNotification(notificationData: NotificationData) {
    this.zone.run(() => {
      this.snackBarRef = this.snackBar.openFromComponent(NotificationComponent, this.stackbarConfig(notificationData));

      this.snackBarRef.afterDismissed().subscribe(() => {
        this.change.emit(notificationData.closeAction);
      });
    });
  }

  showWebSocketNotification(notificationData: NotificationData) {
    this.zone.run(() => {
      this.snackBarRef = this.snackBar.openFromComponent(WebsocketErrorNotificationComponent, this.stackbarConfig(notificationData));
    });
  }

  closeNotification() {
    this.zone.run(() => {
      this.snackBarRef.dismiss();
    });
  }

  restartNotificationTimer() {
    this.snackBarRef.instance.startRetryTimer();
  }

  private stackbarConfig(notificationData: NotificationData) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = notificationData.verticalPosition;
    config.horizontalPosition = notificationData.horizontalPosition;
    // this for applying custome stylesheet
    if (notificationData.messageType) {
      config.panelClass = [notificationData.messageType];
    }
    // this is passing the data to the custom component
    config.data = notificationData;
    return config;
  }
}
