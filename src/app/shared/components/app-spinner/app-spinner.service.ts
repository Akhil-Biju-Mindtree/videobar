import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subject } from 'rxjs';
import { TIMER_COUNTDOWN_ERROR } from '@core/error/error.constants';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedConstants } from '@shared/shared.constants';
import { AppSpinnerModel } from './app-spinner.model';
import { AppSpinnerComponent } from './app-spinner.component';
import { ErrorService } from '@core/error/error.service';
import { NotificationData, NotificationType } from '../notification/notification-model';
import { NotificationService } from '../notification/notification.service';
import { FirmwareConstants } from 'app/configuration/firmware/firmware.constant';
import { DOWNLOAD_LOGS_TITLE } from 'app/configuration/system/system.constant';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { LOG_TIMEOUT } from '@core/constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  spinnerInvokedCount = 0;
  timerSubject = new Subject();
  public dialogRef: MatDialogRef<AppSpinnerComponent>;

  constructor(
    private errorService: ErrorService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private applicationDataManagerService: ApplicationDataManagerService,
  ) {}

  openSpinnerDialog(spinnerDialogModel: AppSpinnerModel, usedFor: string = null) {
    if (this.spinnerInvokedCount === 0) {
      this.listenTimerCountdown(usedFor);
      this.dialogRef = this.dialog.open(AppSpinnerComponent, {
        width: SharedConstants.SPINNER_DIALOG_WIDTH,
        height: SharedConstants.SPINNER_DIALOG_HEIGHT,
        data: spinnerDialogModel,
        disableClose: true,
        restoreFocus: false,
        position: {
          top: SharedConstants.DIALOG.SPINNER_DIALOG.TOP,
          left: SharedConstants.DIALOG.SPINNER_DIALOG.LEFT,
        },
      });
      this.spinnerInvokedCount = this.spinnerInvokedCount + 1;
    }
  }

  private listenTimerCountdown(usedFor) {
    const timerValue =
      usedFor === DOWNLOAD_LOGS_TITLE ? TIMER_COUNTDOWN_ERROR.LOG_DOWNLOAD_TIME : TIMER_COUNTDOWN_ERROR.SPINNER_TIME;
    this.startTimer(timerValue)
      .pipe(takeUntil(this.timerSubject))
      .subscribe(() => {
        this.ngZone.run(() => {
          this.spinnerInvokedCount = this.spinnerInvokedCount - 1;
          this.dialogRef.close();
          this.timerSubject.next();
        });
        if (usedFor === SharedConstants.TEXT.READY_STATE_TEXT_FLAG) {
          const notificationProfileSuccess = new NotificationData();
          notificationProfileSuccess.message = SharedConstants.TEXT.READY_STATE_FAILURE_TOAST_TEXT;
          notificationProfileSuccess.messageType = NotificationType.success;
          this.notificationService.showNotification(notificationProfileSuccess);
        } else if (usedFor === DOWNLOAD_LOGS_TITLE) {
          this.applicationDataManagerService.saveToAppData({ CopyProgress: LOG_TIMEOUT });
        } else if (usedFor !== FirmwareConstants.DIALOG_TEXTS.RESTART_DIALOG_HEADER) {
          this.errorService.showError(TIMER_COUNTDOWN_ERROR.DIALOG_MESSAGE);
        }
      });
  }

  closeSpinnerDialog() {
    if (this.spinnerInvokedCount > 0) {
      this.spinnerInvokedCount = this.spinnerInvokedCount - 1;
      if (this.spinnerInvokedCount === 0 && this.dialogRef) {
        this.ngZone.run(() => {
          this.dialogRef.close();
        });
        this.timerSubject.next(); // unsubscribe-> Destory/Stop the Timer
      }
    } else {
      this.ngZone.run(() => {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
      });
      this.timerSubject.next(); // unsubscribe-> Destory/Stop the Timer
    }
  }

  startTimer(customTime?): Observable<number> {
    return timer(customTime ? customTime : TIMER_COUNTDOWN_ERROR.SPINNER_TIME);
  }
}
