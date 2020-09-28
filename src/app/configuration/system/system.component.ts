import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import {
  GPI_RADIO_BUTTON,
  TIME_ZONE_LIST,
  DIALOG_TEXTS,
  FACTORY_RESTORE_UUIDS,
  DOWNLOAD_LOG_UUID,
  DOWNLOAD_LOGS_STATUS,
  DOWNLOAD_LOG_STATUS_UUID,
  DOWNLOAD_LOG_STATUS_COMPLETE,
  LOGS_WAIT_TIME,
} from './system.constant';
import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { takeUntil, map, debounceTime, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstants, FILE_TRANSFER_MODE, ALL_UUID } from '@core/constants/app.constant';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { NotificationType, NotificationData } from '@shared/components/notification/notification-model';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ResetPasswordComponent } from '@shared/components/dialog/dialog-content/reset-password/reset-password.component';
import { AppConfig } from '@environment/environment';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { ServiceAdapter } from '@providers/service-adapter';
import { DownloadlogsService } from './downloadlogs.service';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { HttpEventType } from '@angular/common/http';
import { SharedConstants as AppSharedConstants } from '../../../../shared/constants/shared.constants';
import { AppSpinnerModel } from '@shared/components/app-spinner/app-spinner.model';
import { FirmwareConstants } from '../firmware/firmware.constant';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { StatusViewConstant } from 'app/status/status.constant';
import { Logger } from '@core/logger/Logger';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
})
export class SystemComponent implements OnInit, OnDestroy {
  gpiRadio = GPI_RADIO_BUTTON;
  timezoneList = TIME_ZONE_LIST;
  uuid = CONFIGURATION_CONSTANTS.UUID;
  unSubscribe: Subject<void> = new Subject();
  unSubscribeProgress: Subject<void> = new Subject();
  ntpServerVal: string;
  currentTimeZone: string;
  isDesktopApp = AppConfig.isDesktopApp;

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private zone: NgZone,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private router: Router,
    private authService: AuthService,
    private fileAdaptor: FileServiceAdaptor,
    private applicationDataManagerService: ApplicationDataManagerService,
    public serviceAdapter: ServiceAdapter,
    private downloadlogsService: DownloadlogsService,
    private http: HttpClientWrapperService,
    private spinnerService: SpinnerService,
    private loggerService: Logger,
  ) {}

  ngOnInit() {
    this.subscribeControlState();
  }

  subscribeControlState() {
    this.deviceManagerService
      .listenFromDevice(this.uuid.NTP_SERVER)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: string) => {
        this.zone.run(() => {
          this.ntpServerVal = value;
        });
      });

    this.deviceManagerService
      .listenFromDevice(this.uuid.TIME_ZONE)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: string) => {
        this.zone.run(() => {
          this.currentTimeZone = value;
        });
      });
  }

  ntpServerChange(value) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.uuid.NTP_SERVER]: value,
    });
  }

  /**
   * Perform download logs, with one API calls max per 15 seconds
   */
  performDesktopDownload() {
    this.downloadlogsService.showProgressDialog();
    const elapsedDuration = (new Date().getTime() - this.downloadlogsService.lastDownload.getTime()) / 1000;
    if (elapsedDuration > LOGS_WAIT_TIME) {
      this.downloadlogsService.triggerDownloadAPI();
    } else {
      this.applicationDataManagerService.saveToAppData({ LogsDownloadStatus: DOWNLOAD_LOGS_STATUS.WAIT });
      const nextTriggerTime = (LOGS_WAIT_TIME - elapsedDuration) * 1000;
      this.downloadlogsService.triggerDownloadAPI(nextTriggerTime);
    }
  }

  listenToLogFileGeneration() {
    this.deviceManagerService
      .listenFromDevice(DOWNLOAD_LOG_STATUS_UUID)
      .pipe(takeUntil(this.unSubscribeProgress))
      .subscribe((status: any) => {
        if (status === DOWNLOAD_LOG_STATUS_COMPLETE) {
          this.startWebLogDownload();
          this.unSubscribeProgress.next();
        } else if (status === AppSharedConstants.statusfailure) {
          this.applicationDataManagerService.saveToAppData({ CopyProgress: AppSharedConstants.statusfailure });
          this.unSubscribeProgress.next();
        }
      });
  }

  startWebLogDownload() {
    this.http.getDeviceLogs(this.authService.Password).subscribe(
      (data: any) => {
        switch (data.type) {
          case HttpEventType.Response:
            this.applicationDataManagerService.saveToAppData({
              CopyProgress: 100,
            });
            this.saveToDownload(data.body);
            break;
          case HttpEventType.DownloadProgress:
            const percent = Math.round((data.loaded / data.total) * 100);
            if (percent !== 100) {
              this.applicationDataManagerService.saveToAppData({
                CopyProgress: percent,
              });
            }
        }
      },
      () => {
        this.applicationDataManagerService.saveToAppData({ CopyProgress: AppSharedConstants.statusfailure });
      },
    );
  }

  performWebDownload() {
    this.listenToLogFileGeneration();
    this.downloadlogsService.showProgressDialog();
    this.downloadlogsService.listenToCopyProgress();
    this.deviceManagerService.sendToDevice(AppConstants.Action.Subscribe, {
      [DOWNLOAD_LOG_STATUS_UUID]: '',
    });
    this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
      [DOWNLOAD_LOG_UUID]: 'ip',
    });
    this.applicationDataManagerService.saveToAppData({ LogsDownloadStatus: DOWNLOAD_LOGS_STATUS.COPY });
  }

  /**
   * Returns the current timestamp
   */
  getTimeStamp() {
    const date = new Date();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);
    const fullDate = [date.getFullYear(), month, day].join('');
    const fullTime = [hours, minutes, seconds].join('');
    return [fullDate, fullTime].join('_');
  }

  /**
   * Returns the device serial number, also invalid characters are replaced with underscore(_)
   */
  getDeviceSerial() {
    return this.deviceManagerService.listenFromDevice(StatusViewConstant.UUID.SYSTEM_SERIAL_NUMBER).pipe(
      take(1),
      map((data: string) => {
        return data.replace(/[:\\/*?"<>|]/g, '_');
      }),
    );
  }

  /**
   * Returns the log file name with current timestamp & device serial number
   */
  getLogFileName() {
    return this.getDeviceSerial().pipe(
      take(1),
      map((serial: any) => {
        return `logs-${this.getTimeStamp()}-${serial}.zip`;
      }),
    );
  }

  triggerUSBDownload() {
    this.getLogFileName().subscribe((logFileName: any) => {
      const options = {
        defaultPath: `${this.serviceAdapter.remote.app.getPath('downloads')}/${logFileName}`,
      };
      if (this.serviceAdapter.remote.getCurrentWindow().getTitle() !== 'background') {
        this.serviceAdapter.remote.dialog
          .showSaveDialog(null, options)
          .then((result: any) => {
            if (!result.canceled && result.filePath) {
              this.fileAdaptor.send(result.filePath);
              this.performDesktopDownload();
            }
          })
          .catch((err: any) => {
            this.loggerService.error(`Can't save the file ${err}`);
          });
      }
    });
  }

  getUserConfirmation() {
    const downloadLogsConfirmDialogModel = new ConfirmationDialogModel();
    downloadLogsConfirmDialogModel.title = DIALOG_TEXTS.LOGS_HEADER;
    downloadLogsConfirmDialogModel.content = DIALOG_TEXTS.LOGS_CONFIRM_DIALOG_CONTENT;
    downloadLogsConfirmDialogModel.confirmButtonLabel = FirmwareConstants.DIALOG_TEXTS.OLDFIRMWARE_CONFIRM_TEXT;

    this.confirmationDialogService
      .openConfirmationDialog(downloadLogsConfirmDialogModel)
      .then((resultConfirmDialog: boolean) => {
        if (resultConfirmDialog) {
          this.triggerUSBDownload();
        }
      });
  }

  downloadLogs() {
    if (this.isDesktopApp) {
      this.getUserConfirmation();
    } else {
      this.performWebDownload();
    }
  }

  saveToDownload(data) {
    this.getLogFileName().subscribe((logFileName: any) => {
      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise it works only in chrome
      const newBlob = new Blob([data], { type: 'application/zip' });

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }

      // This is for other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const file = window.URL.createObjectURL(newBlob);

      const link = document.createElement('a');
      link.href = file;
      link.download = logFileName;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(file);
      link.remove();
    });
  }

  changePassword() {
    this.dialogService.openDialog(
      ResetPasswordComponent,
      DIALOG_TEXTS.CHANGE_PASSWORD_HEADER,
      '',
      {
        confirmButtonLabel: DIALOG_TEXTS.CHANGE_PASSWORD_CONFIRM_TEXT,
        RefuteButtonLabel: DIALOG_TEXTS.CHANGE_PASSWORD_CANCEL_TEXT,
      },
      '',
      true,
    );
  }

  updateTimeZone(item) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.uuid.TIME_ZONE]: item.value,
    });
  }

  restoreDefaults() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = DIALOG_TEXTS.RESTORE_DEFAULT_DIALOG_HEADER;
    confirmationDialogModel.content = DIALOG_TEXTS.RESTORE_DEFAULT_DIALOG_CONTENT;
    confirmationDialogModel.confirmButtonLabel = DIALOG_TEXTS.RESTORE_DEFAULT_CONFIRM_TEXT;

    this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel).then((result: boolean) => {
      if (result) {
        this.deviceManagerService.sendToDevice(AppConstants.Action.Delete, ALL_UUID);
        const notificationData = new NotificationData();
        notificationData.message = DIALOG_TEXTS.DEFAULT_RESTORED;
        notificationData.messageType = NotificationType.success;
        this.notificationService.showNotification(notificationData);
      }
    });
  }

  restartDevice() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = DIALOG_TEXTS.RESTART_DEVICE_DIALOG_HEADER;
    confirmationDialogModel.content = DIALOG_TEXTS.RESTART_DEVICE_DIALOG_CONTENT;
    confirmationDialogModel.confirmButtonLabel = DIALOG_TEXTS.RESTART_DEVICE_CONFIRM_TEXT;

    this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel).then((result: boolean) => {
      if (result) {
        const restartDialog = new AppSpinnerModel();
        restartDialog.title = FirmwareConstants.DIALOG_TEXTS.RESTART_DIALOG_HEADER;
        this.spinnerService.openSpinnerDialog(restartDialog, FirmwareConstants.DIALOG_TEXTS.RESTART_DIALOG_HEADER);
        this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
          [this.uuid.RESTART_DEVICE]: '',
        });
        if (!AppConfig.isDesktopApp) {
          this.authService.setAdminAccess(false);
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.unSubscribeProgress.next();
    this.unSubscribeProgress.complete();
  }
}
