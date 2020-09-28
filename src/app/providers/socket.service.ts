import { Injectable } from '@angular/core';
import { ServiceAdapter } from './service-adapter';
import { Subject, from, timer } from 'rxjs';
import { AppConfig } from '@environment/environment';
import { ProcessJsonResponseService } from 'app/providers/process-json-response.service';
import { Logger } from '@core/logger/Logger';
import { ErrorService } from '@core/error/error.service';
import * as errorConstants from '@core/error/error.constants';
const InvalidAction = '\\ue002';
const InvalidProperty = '\\ue004';
const PropertyOutofRange = '\\ue003';
import { NotificationService } from '@shared/components/notification/notification.service';
import {
  NotificationData,
  NotificationType,
  NotificationVposition,
  NotificationHposition,
} from '@shared/components/notification/notification-model';
import { AuthService } from '@core/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { AppConstants } from '@core/constants/app.constant';
import { SharedConstants } from '../../../shared/constants/shared.constants';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

@Injectable()
export class SocketService implements ServiceAdapter {
  websocket;
  requestMap: { [key: string]: Subject<any> } = {};
  ipcRenderer = null;
  webFrame = null;
  remote = null;
  childProcess = null;
  fs = null;
  getDeviceConnectionStatus = new Subject<string>();
  messageQueue = [];
  errorNotification = false;
  private resetPing = new Subject();
  private resetConnectionTimeout = new Subject();

  constructor(
    private processJsonService: ProcessJsonResponseService,
    private loggerService: Logger,
    private errorService: ErrorService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private applicationDataManagerService: ApplicationDataManagerService,
  ) {
    this.applicationDataManagerService.saveToAppData({ websocketDisconnected: this.errorNotification });
    this.subscribeRetry();
  }

  subscribeRetry() {
    this.getDeviceConnectionStatus.subscribe((event: any) => {
      if (event === 'retry' && this.websocket.readyState !== 0) {
        this.initWebSocket();
      }
    });
  }

  startPingTimer() {
    timer(AppConstants.WEB_SOCKET_PING_INTERVAL)
      .pipe(takeUntil(this.resetPing))
      .subscribe(() => {
        this.getDeviceConnectionStatus.next('detach');
        if (!this.errorNotification) {
          this.showErrorNotification();
          this.loggerService.info('Socket service::websocket:close');
        }
      });
  }

  startWebsocketTimeout() {
    timer(AppConstants.WEB_SOCKET_CONNECTION_TIMEOUT)
      .pipe(takeUntil(this.resetConnectionTimeout))
      .subscribe(() => {
        this.websocket.close();
      });
  }

  send(request) {
    this.loggerService.info(`Socket service paylod <- :: -> ${JSON.stringify(request)}`);
    // 3 => socket may dis connected, try to reconnect.
    if (!this.websocket || this.websocket.readyState === 3) {
      this.initWebSocket();
      this.messageQueue.push(request);
    } else if (this.websocket.readyState === 1) {
      this.loggerService.info(`Socket service send to Device <- :: -> ${JSON.stringify(request)}`);
      this.websocket.send(JSON.stringify(request));
    } else if (this.websocket.readyState === 0) {
      this.messageQueue.push(request);
    }
  }

  initWebSocket() {
    this.startWebsocketTimeout();
    const url = this.getWebsocketUrl();
    this.websocket = new WebSocket(url);

    this.websocket.onmessage = this.handleMessage.bind(this);

    this.websocket.onclose = this.onwebsocketClose.bind(this);

    this.websocket.onopen = this.onWebsocketOpen.bind(this);

    this.websocket.onerror = this.onWebsocketError.bind(this);
  }

  // !Since its websocket
  isElectron() {
    return false;
  }

  releaseResources() {
    return false;
  }

  handleMessage(message) {
    this.resetPing.next();
    this.startPingTimer();
    let arg;
    if (this.processJsonService.isJsonString(message.data)) {
      arg = JSON.parse(message.data);
    }
    if (
      message.data.indexOf(PropertyOutofRange) > -1 ||
      message.data.indexOf(InvalidProperty) > -1 ||
      message.data.indexOf(InvalidAction) > -1
    ) {
      this.errorService.showError(errorConstants.DeviceError);
      this.processJsonService.revertDataFromCacheOnError(message.data);
    }
    this.processJsonService.processJson(arg);

    if (arg.id in this.requestMap) {
      this.requestMap[arg.id].next(arg.data);
      this.requestMap[arg.id].complete();
      delete this.requestMap[arg.id];
    }
  }

  onwebsocketClose() {
    this.resetPing.next();
    this.resetConnectionTimeout.next();
    this.getDeviceConnectionStatus.next('detach');
    this.messageQueue = [];
    if (!this.errorNotification) {
      this.showErrorNotification();
      this.loggerService.info('Socket service::websocket:close');
    }
  }

  onWebsocketOpen() {
    this.resetConnectionTimeout.next();
    this.resetPing.next();
    this.startPingTimer();
    this.getDeviceConnectionStatus.next('attach');
    if (this.errorNotification) {
      this.hideErrorNotification();
    }
    this.loggerService.info(`Socket service <- :: -> open`);
    try {
      if (this.messageQueue.length > 0) {
        for (const message of this.messageQueue) {
          this.loggerService.info(`Socket service send to Device <- :: -> ${JSON.stringify(message)}`);
          this.websocket.send(JSON.stringify(message));
        }
      }
    } finally {
      this.messageQueue = [];
    }
  }

  onWebsocketError() {
    this.loggerService.error('Socket service::websocket:error');
    this.getDeviceConnectionStatus.next('error');
    if (this.errorNotification) {
      this.notificationService.restartNotificationTimer();
    }
  }

  showErrorNotification() {
    const notificationData = new NotificationData();
    notificationData.showButton = false;
    notificationData.verticalPosition = NotificationVposition.top;
    notificationData.horizontalPosition = NotificationHposition.center;
    this.notificationService.showWebSocketNotification(notificationData);
    this.errorNotification = true;
    this.applicationDataManagerService.saveToAppData({ websocketDisconnected: this.errorNotification });
  }

  hideErrorNotification() {
    this.notificationService.closeNotification();
    this.errorNotification = false;
    this.applicationDataManagerService.saveToAppData({ websocketDisconnected: this.errorNotification });
    window.location.reload();
  }
  getWebsocketUrl() {
    if (AppConfig.production) {
      const hostname = window.location.hostname;
      return `wss://${hostname}/websocket`;
    }
    return 'wss://10.1.12.60/websocket';
  }
}
