import { Component, OnInit, NgZone } from '@angular/core';
import { timer, Subject } from 'rxjs';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ServiceAdapter } from 'app/providers/service-adapter';
import { AppConstants } from '@core/constants/app.constant';

@Component({
  selector: 'app-websocket-error-notification',
  templateUrl: './websocket-error-notification.component.html',
  styleUrls: ['./websocket-error-notification.component.scss'],
})
export class WebsocketErrorNotificationComponent implements OnInit {
  webSocketReconnect = false;
  webSocketConnecting = false;
  retryInterval = AppConstants.WEB_SOCKET_RETRY_INTERVAL;
  unsubscribe: Subject<any> = new Subject();

  constructor(private serviceAdapter: ServiceAdapter, private zone: NgZone) {}

  ngOnInit() {
    this.webSocketReconnect = true;
    this.startRetryTimer();
  }

  retryWebsocket() {
    this.serviceAdapter.getDeviceConnectionStatus.next('retry');
    this.unsubscribe.next();
    this.retryInterval = 1;
  }

  startRetryTimer() {
    this.retryInterval = AppConstants.WEB_SOCKET_RETRY_INTERVAL;
    timer(1000, 1000)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.zone.run(() => {
          this.retryInterval = this.retryInterval - 1;
        });

        if (this.retryInterval === 1) {
          this.retryWebsocket();
        }
      });
  }
}
