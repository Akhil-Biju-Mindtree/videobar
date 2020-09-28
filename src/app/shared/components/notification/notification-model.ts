import { NotificationService } from './notification.service';

export class NotificationModel { }
export enum NotificationHposition {
  left = 'left',
  center = 'center',
  right = 'right',
  start = 'start',
  end = 'end',
}

export enum NotificationVposition {
  top = 'top',
  bottom = 'bottom',
}

export enum NotificationType {
  success = 'Success',
  error = 'Error',
  info = 'Info',
  warning = 'Warning',
}

export enum NotificationCloseActionType {
  autoClose = 'autoClosed',
  manuallyClose = 'manuallyClosed',
}

export enum NotificationDuration {
  timeout = 5000,
  onHoverOut = 1000,
}

export class NotificationData {
  message: string;
  showButton = true;
  returnMessage?: string;
  closeAction: NotificationCloseActionType = NotificationCloseActionType.manuallyClose;
  titleMessage = 'Notification Alert';
  messageType: NotificationType = NotificationType.success;
  buttonText = 'Close';
  verticalPosition: NotificationVposition = NotificationVposition.bottom;
  horizontalPosition: NotificationHposition = NotificationHposition.left;

  // constructor() {
  // 	this.messageType = NotificationType.success;
  // 	this.verticalPosition = NotificationVposition.bottom;
  // 	this.horizontalPosition = NotificationHposition.right;
  // 	this.closeAction = NotificationCloseActionType.manuallyClose;
  // }
}
