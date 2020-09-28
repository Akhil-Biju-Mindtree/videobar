import { Injectable, NgZone } from '@angular/core';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { AppConstants, FILE_TRANSFER_MODE, LOG_TIMEOUT } from '@core/constants/app.constant';
import { DIALOG_TEXTS, DOWNLOAD_LOGS_STATUS, DOWNLOAD_LOG_UUID, DOWNLOAD_LOGS_TITLE } from './system.constant';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { CONFIGURATION_CONSTANTS } from '../configuration.constant';
import { NotificationService } from '@shared/components/notification/notification.service';
import { NotificationType, NotificationData } from '@shared/components/notification/notification-model';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { SharedConstants as AppSharedConstants } from '../../../../shared/constants/shared.constants';
import { Subject } from 'rxjs';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { AppConfig } from '@environment/environment';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppSpinnerModel } from '@shared/components/app-spinner/app-spinner.model';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadlogsService {
  unSubscribeProgress: Subject<void> = new Subject();
  isDesktopApp = AppConfig.isDesktopApp;
  lastDownload = new Date();
  isSetTimer = null;
  isSpinnerShown = false;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private notificationService: NotificationService,
    private fileAdaptor: FileServiceAdaptor,
    private deviceManagerService: DeviceDataManagerService,
    private spinnerService: SpinnerService,
    private ngZone: NgZone,
  ) {}

  /**
   * Call download API immediately or after some duration
   * @param triggerTime - Time delay to call the Log download API
   */
  triggerDownloadAPI(triggerTime?) {
    if (triggerTime) {
      this.isSetTimer = setTimeout(() => {
        this.callDownloadLogUSB();
        this.isSetTimer = null;
      },                           triggerTime);
    } else {
      this.callDownloadLogUSB();
    }
  }

  callDownloadLogUSB() {
    this.fileAdaptor.setTransferMode(FILE_TRANSFER_MODE.LOG_DOWNLOAD);
    this.applicationDataManagerService.saveToAppData({ LogsDownloadStatus: DOWNLOAD_LOGS_STATUS.COPY });
    this.listenToCopyProgress();
    this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
      [DOWNLOAD_LOG_UUID]: 'usb',
    });
  }

  listenToCopyProgress() {
    this.applicationDataManagerService
      .listenForAppData(AppConstants.APP_DATA_KEYS.COPY_PROGRESS_RESPONSE_KEY)
      .pipe(takeUntil(this.unSubscribeProgress), debounceTime(400))
      .subscribe((progressStatus: any) => {
        if (
          progressStatus === 100 ||
          progressStatus === AppSharedConstants.statusfailure ||
          progressStatus === LOG_TIMEOUT
        ) {
          this.fileAdaptor.send(null);
          this.fileAdaptor.setTransferMode(null);
          if (this.isDesktopApp) {
            this.applicationDataManagerService.saveToAppData({ LogsDownloadStatus: DOWNLOAD_LOGS_STATUS.CONVERT });
          } else {
            this.applicationDataManagerService.saveToAppData({ LogsDownloadStatus: DOWNLOAD_LOGS_STATUS.NONE });
          }
          if (progressStatus === AppSharedConstants.statusfailure) {
            this.showErrorDialog(AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_COPY);
          } else if (progressStatus === LOG_TIMEOUT) {
            this.showErrorDialog(LOG_TIMEOUT);
          } else {
            this.closeProgressDialog();
            this.showSuccessMessage();
          }
          this.applicationDataManagerService.saveToAppData({
            CopyProgress: 0,
          });
          this.unSubscribeProgress.next();
        }
      });
  }

  showProgressDialog() {
    const restartDialog = new AppSpinnerModel();
    restartDialog.title = DOWNLOAD_LOGS_TITLE;
    this.isSpinnerShown = true;
    this.spinnerService.openSpinnerDialog(restartDialog, DOWNLOAD_LOGS_TITLE);
  }

  closeProgressDialog() {
    this.lastDownload = new Date();
    this.unSubscribeProgress.next();
    this.isSpinnerShown = false;
    this.spinnerService.closeSpinnerDialog();
  }

  showErrorDialog(errorType) {
    this.ngZone.run(() => {
      if (this.isSpinnerShown) {
        this.closeProgressDialog();
      }
      const errorDialogModel = new ConfirmationDialogModel();
      if (errorType === AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_COPY) {
        errorDialogModel.title = DIALOG_TEXTS.ERROR_DIALOG_HEADER_LOGS_DOWNLOAD;
        errorDialogModel.content = DIALOG_TEXTS.ERROR_DIALOG_CONTENT_LOGS_DOWNLOAD_FAILURE;
      } else if (errorType === LOG_TIMEOUT) {
        errorDialogModel.title = DIALOG_TEXTS.ERROR_DIALOG_HEADER_LOGS_DOWNLOAD;
        errorDialogModel.content = DIALOG_TEXTS.TIMEOUT_DIALOG_CONTENT_LOGS_DOWNLOAD_FAILURE;
      }
      errorDialogModel.dialogType = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_TYPE;
      errorDialogModel.confirmButtonLabel = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_CONFIRM_TEXT;
      this.confirmationDialogService.openConfirmationDialog(errorDialogModel).then(() => {});
    });
  }

  showSuccessMessage() {
    const notificationData = new NotificationData();
    notificationData.message = DIALOG_TEXTS.LOGS_DOWNLOADED;
    notificationData.messageType = NotificationType.success;
    this.notificationService.showNotification(notificationData);
  }

  resetLogState() {
    if (this.isSetTimer) {
      clearTimeout(this.isSetTimer);
      this.isSetTimer = null;
    }
    this.applicationDataManagerService.saveToAppData({ LogsDownloadStatus: DOWNLOAD_LOGS_STATUS.NONE });
    this.applicationDataManagerService.saveToAppData({
      CopyProgress: 0,
    });
  }
}
