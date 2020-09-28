import { Component, OnInit, Inject, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { timer, Subscription, Subject } from 'rxjs';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { SharedConstants } from '@shared/shared.constants';
import {
  NotificationCloseActionType,
  NotificationData,
  NotificationDuration,
} from './notification-model';
import { AppConstants } from '@core/constants/app.constant';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  closeIcon = SharedConstants.ICON.CLOSE_ICON;
  isHovered = false;
  isTimedOut = false;
  hoverInEventListenerFunc;
  hoverOutEventListenerFunc;
  hoverOutSubscription;
  unsubscribe: Subject<any> = new Subject();
  webSocketReconnect = false;
  webSocketConnecting = false;
  retryInterval = AppConstants.WEB_SOCKET_RETRY_INTERVAL;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
    private snackBarRef: MatSnackBarRef<NotificationComponent>,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit() {
    this.data.closeAction = NotificationCloseActionType.autoClose;
    const ele = this.elementRef.nativeElement.closest('.cdk-overlay-pane');
    ele.classList.add(SharedConstants.TOASTER_MARGIN_CLASS);
    this.listenHoverevents(ele);
    this.initiateAutoClose();
    this.listenRouteChange();
  }

  listenRouteChange() {
    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.onClose();
      }
    });
  }

  listenHoverevents(element) {
    this.hoverInEventListenerFunc = this.renderer.listen(element, 'mouseleave', () => {
      this.isHovered = false;
      this.handleHoverOut();
    });
    this.hoverOutEventListenerFunc = this.renderer.listen(element, 'mouseenter', () => {
      this.isHovered = true;
      if (this.hoverOutSubscription instanceof Subscription) {
        this.hoverOutSubscription.unsubscribe();
      }
    });
  }

  initiateAutoClose() {
    const timerData = timer(NotificationDuration.timeout);
    timerData.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      if (!this.isHovered) {
        this.onClose();
      }
      this.isTimedOut = true;
    });
  }

  handleHoverOut() {
    const timerData = timer(NotificationDuration.onHoverOut);
    this.hoverOutSubscription = timerData.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      if (this.isTimedOut && !this.isHovered) {
        this.onClose();
      }
    });
  }

  onClose() {
    this.data.closeAction = NotificationCloseActionType.manuallyClose;
    this.snackBarRef.dismiss();
  }

  ngOnDestroy() {
    if (_.isFunction(this.hoverOutEventListenerFunc)) {
      this.hoverOutEventListenerFunc();
    }
    if (_.isFunction(this.hoverInEventListenerFunc)) {
      this.hoverInEventListenerFunc();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
