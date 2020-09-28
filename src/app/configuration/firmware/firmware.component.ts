import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CONFIGURATION_CONSTANTS } from '../configuration.constant';
import { AppConstants, FILE_TRANSFER_MODE } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Subject, asyncScheduler } from 'rxjs';
import { takeUntil, debounceTime, throttleTime } from 'rxjs/operators';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { HttpEventType } from '@angular/common/http';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { FirmwareCheckService } from 'app/configuration/firmware/firmware-check.service';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { FirmwareProgressDialogModel } from '@shared/components/firmware-progress-dialog/firmware-progress-dialog.model';
import { FirmwareProgressDialogService } from '@shared/components/firmware-progress-dialog/firmware-progress-dialog.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { ServiceAdapter } from '@providers/service-adapter';
import { Logger } from '@core/logger/Logger';
import { FirmwareProgressService } from './firmware-progress.service';
import { SharedConstants } from '@shared/shared.constants';
import { FirmwareConstants } from './firmware.constant';
import { AppConfig } from '@environment/environment';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-firmware',
  templateUrl: './firmware.component.html',
  styleUrls: ['./firmware.component.scss'],
})
export class FirmwareComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  fileUploadVersion = null;
  currentFirmwareVersion;
  latestFirmwareVersion;
  oldFirmware = false;
  arrowIcon = CONFIGURATION_CONSTANTS.ARROW_ICON;
  fileType = 'swu';
  usb = 'usb';
  noConnectionKey = 'noConnection';
  detailsKey = 'details';
  saveFileName = 'FWfile.swu';
  firmwareURL;
  firmwareUploaded = false;
  disableInstallButton = true;
  fileUploadActionText = CONFIGURATION_CONSTANTS.TEXT.FIRMWARE_UPLOAD_ACTION_TEXT;
  noConnection = true;
  isUpToDate = true;
  relNotesOpenState = false;
  performAction = AppConstants.Action.Perform;
  relNotesUpdates;
  relNotesBugFixes;
  relNotesKnownIssues;
  firmwareUpdateSteps;
  totalFirmwareProgress;
  showRestartDialogFlag = false;
  actionSubscribe = AppConstants.Action.Subscribe;
  imageFile;
  isDesktopApp = AppConfig.isDesktopApp;
  firmwareKey = 'firmware';

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private fileAdaptor: FileServiceAdaptor,
    private http: HttpClientWrapperService,
    private firmwareCheckService: FirmwareCheckService,
    private confirmationDialogService: ConfirmationDialogService,
    private firmwareProgressDialogService: FirmwareProgressDialogService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private serviceAdapter: ServiceAdapter,
    private loggerService: Logger,
    private firmwareProgressService: FirmwareProgressService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.onInitListenForNotification();
    this.checkForUpdate();
  }

  getCopyProgressOnWeb() {
    this.http
      .uploadImageFile(this.imageFile, this.authService.Password)
      .pipe(throttleTime(300, asyncScheduler, { trailing: true, leading: true }), debounceTime(200))
      .subscribe(
        (data: any) => {
          switch (data.type) {
            case HttpEventType.Response:
              this.applicationDataManagerService.saveToAppData({ CopyProgress: FirmwareConstants.COPY_SUCCESS_STATUS });
              break;
            case HttpEventType.UploadProgress:
              const percent = Math.round((data.loaded / data.total) * 100);
              if (percent !== FirmwareConstants.COPY_SUCCESS_STATUS) {
                this.applicationDataManagerService.saveToAppData({ CopyProgress: percent });
              }
          }
        },
        () => {
          this.applicationDataManagerService.saveToAppData({ CopyProgress: FirmwareConstants.STATUS_FAILURE });
        },
      );
  }

  onInitListenForNotification() {
    this.deviceManagerService
      .listenFromDevice(FirmwareConstants.UUID.FIRMWARE_VERSION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((currentFirmwareVersion: string) => {
        this.ngZone.run(() => {
          this.currentFirmwareVersion = currentFirmwareVersion;
        });
      });
  }

  checkForUpdate() {
    this.firmwareCheckService
      .isFirmwareUpToDate()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((firmwareStatus: Object) => {
        this.ngZone.run(() => {
          this.isUpToDate = firmwareStatus[AppConstants.APP_DATA_KEYS.IS_UP_TO_DATE_KEY];
          this.noConnection = firmwareStatus[this.noConnectionKey];
          if (!this.isUpToDate) {
            this.latestFirmwareVersion = firmwareStatus[this.detailsKey].latestFirmwareVersion;
            this.firmwareURL =
              AppConstants.SERVER_BASE_URL.replace('{version}', this.latestFirmwareVersion.replace(/\./g, '_')) +
              firmwareStatus[this.detailsKey].downloadUrl;
            this.getReleaseNotes(firmwareStatus[this.detailsKey].releaseNotes);
          }
        });
      });
  }

  getReleaseNotes(releaseNotes) {
    this.ngZone.run(() => {
      if (releaseNotes.updates instanceof Array && releaseNotes.updates.length) {
        this.relNotesUpdates = releaseNotes.updates;
      }
      if (releaseNotes.bugFixes instanceof Array && releaseNotes.bugFixes.length) {
        this.relNotesBugFixes = releaseNotes.bugFixes;
      }
      if (releaseNotes.knownIssues instanceof Array && releaseNotes.knownIssues.length) {
        this.relNotesKnownIssues = releaseNotes.knownIssues;
      }
    });
  }

  getFileData(data) {
    if (data) {
      this.imageFile = data;
      this.fileAdaptor.send(data.path);
      this.fileAdaptor.setTransferMode(FILE_TRANSFER_MODE.FIRMWARE_UPDATE);
      if (data.name.match(/_\d+(\.\d+)+_/g)) {
        this.fileUploadVersion = data.name.substring(data.name.indexOf('_') + 1, data.name.lastIndexOf('_'));
        const currentFirmwareVersion = this.currentFirmwareVersion.substring(
          0,
          this.currentFirmwareVersion.indexOf('_') === -1
            ? this.currentFirmwareVersion.length
            : this.currentFirmwareVersion.indexOf('_'),
        );
        if (
          this.firmwareCheckService.compareVersion(
            currentFirmwareVersion,
            data.name.substring(data.name.indexOf('_') + 1, data.name.lastIndexOf('_')),
          ) > 0
        ) {
          this.oldFirmware = true;
        } else {
          this.oldFirmware = false;
        }
      } else {
        this.fileUploadVersion = null;
        this.oldFirmware = false;
      }
      this.firmwareUploaded = false;
      this.disableInstallButton = false;
    } else {
      this.disableInstallButton = true;
    }
  }

  installFirmware() {
    if (this.oldFirmware) {
      this.installOlderUpdate();
    } else {
      this.installNewerUpdate();
    }
  }

  installOlderUpdate() {
    const oldFirmwareConfirmDialogModel = new ConfirmationDialogModel();
    oldFirmwareConfirmDialogModel.title = FirmwareConstants.DIALOG_TEXTS.OLDFIRMWARE_DIALOG_HEADER;
    oldFirmwareConfirmDialogModel.content = FirmwareConstants.DIALOG_TEXTS.OLDFIRMWARE_DIALOG_CONTENT;
    oldFirmwareConfirmDialogModel.confirmButtonLabel = FirmwareConstants.DIALOG_TEXTS.OLDFIRMWARE_CONFIRM_TEXT;

    this.confirmationDialogService
      .openConfirmationDialog(oldFirmwareConfirmDialogModel)
      .then((resultOldConfirmDialog: boolean) => {
        if (resultOldConfirmDialog) {
          if (this.isDesktopApp) {
            this.deviceManagerService.sendToDevice(this.performAction, {
              [FirmwareConstants.UUID.FIRMWARE_UPDATE]: this.usb,
            });
          } else {
            this.getCopyProgressOnWeb();
          }
          this.openFirmwareUpdateProgressDialogManual();
        }
      });
  }

  installNewerUpdate() {
    const firmwareConfirmDialogModel = new ConfirmationDialogModel();
    firmwareConfirmDialogModel.title = FirmwareConstants.DIALOG_TEXTS.FIRMWARE_CONFIRM_DIALOG_HEADER;
    firmwareConfirmDialogModel.content = FirmwareConstants.DIALOG_TEXTS.FIRMWARE_CONFIRM_DIALOG_CONTENT;
    firmwareConfirmDialogModel.confirmButtonLabel = FirmwareConstants.DIALOG_TEXTS.OLDFIRMWARE_CONFIRM_TEXT;

    this.confirmationDialogService
      .openConfirmationDialog(firmwareConfirmDialogModel)
      .then((resultConfirmDialog: boolean) => {
        if (resultConfirmDialog) {
          if (this.isDesktopApp) {
            this.deviceManagerService.sendToDevice(this.performAction, {
              [FirmwareConstants.UUID.FIRMWARE_UPDATE]: this.usb,
            });
          } else {
            this.getCopyProgressOnWeb();
          }
          this.openFirmwareUpdateProgressDialogManual();
        }
      });
  }

  openFirmwareUpdateProgressDialogManual() {
    this.firmwareUploaded = true;
    const firmwareProgressDialogModel = new FirmwareProgressDialogModel();
    if (this.fileUploadVersion) {
      firmwareProgressDialogModel.title = `Installing v${this.fileUploadVersion}`;
    } else {
      firmwareProgressDialogModel.title = SharedConstants.TEXT.FIRMWARE_PROGRESS_DIALOG_DEFAULT_TITLE;
    }
    firmwareProgressDialogModel.currentOperationText = FirmwareConstants.DIALOG_TEXTS.CURRENT_OPERATION_COPYING;

    this.firmwareProgressDialogService.openProgressDialog(firmwareProgressDialogModel);
    this.firmwareProgressService.listenToFirmwareCopyStatus();
  }

  directInstallFirmware() {
    const firmwareConfirmDialogModel = new ConfirmationDialogModel();
    firmwareConfirmDialogModel.title = FirmwareConstants.DIALOG_TEXTS.FIRMWARE_CONFIRM_DIALOG_HEADER;
    firmwareConfirmDialogModel.content = FirmwareConstants.DIALOG_TEXTS.FIRMWARE_CONFIRM_DIALOG_CONTENT;
    firmwareConfirmDialogModel.confirmButtonLabel = FirmwareConstants.DIALOG_TEXTS.OLDFIRMWARE_CONFIRM_TEXT;

    this.confirmationDialogService.openConfirmationDialog(firmwareConfirmDialogModel).then((result: boolean) => {
      if (result) {
        const firmwareProgressDialogModel = new FirmwareProgressDialogModel();
        firmwareProgressDialogModel.currentOperationText = FirmwareConstants.DIALOG_TEXTS.CURRENT_OPERATION_DOWNLOADING;
        this.firmwareProgressDialogService.openProgressDialog(firmwareProgressDialogModel);
        this.firmwareProgressService.setFirmwareOpenDialog(true);
        this.http.getFile(this.firmwareURL).pipe(takeUntil(this.unsubscribe)).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.DownloadProgress) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
              this.applicationDataManagerService.saveToAppData({ FirmwareCurrentProgress: percentDone });
            } else if (event.type === HttpEventType.Response) {
              if (this.isDesktopApp) {
                const uint8ArrayContent = new Uint8Array(event.body);
                const storagePath = `${this.serviceAdapter.remote.app.getPath('temp')}/${this.saveFileName}`;
                this.createFileFromArrayBuffer(uint8ArrayContent, storagePath);
              } else {
                this.createFileFromArrayBufferWeb(event.body);
              }
            }
          },
          (error: any) => {
            this.loggerService.trace(`Error in downloading firmware::: ${JSON.stringify(error)}`);
            this.firmwareProgressDialogService.closeProgressDialog();
            this.firmwareProgressService.setFirmwareOpenDialog(false);
            this.firmwareProgressService.showFailureDialog(AppConstants.APP_DATA_KEYS.DOWNLOAD_FAILURE_ERROR);
          },
        );
      }
    });
  }

  createFileFromArrayBufferWeb(fileContent: any) {
    const arrayBufferToFile = new File([fileContent], this.saveFileName);
    this.imageFile = arrayBufferToFile;
    if (this.firmwareProgressDialogService.dialogRef) {
      this.firmwareProgressDialogService.dialogRef.componentInstance.updateStep(
        FirmwareConstants.DIALOG_TEXTS.CURRENT_OPERATION_COPYING,
      );
    }
    this.applicationDataManagerService.saveToAppData({
      FirmwareCurrentProgress: parseInt(FirmwareConstants.UPDATE_STATUS_START, 10),
    });
    this.getCopyProgressOnWeb();
    this.firmwareProgressService.listenToFirmwareCopyStatus();
  }

  createFileFromArrayBuffer(fileContent: any, path: string) {
    this.serviceAdapter.fs.writeFile(path, fileContent, (err: any) => {
      if (err) {
        this.loggerService.debug(`Firmware File Save Error :::::: ${JSON.stringify(err)}`);
      } else {
        this.loggerService.trace('File Saved');
        this.fileAdaptor.send(path);
        if (this.firmwareProgressDialogService.dialogRef) {
          this.firmwareProgressDialogService.dialogRef.componentInstance.updateStep(
            FirmwareConstants.DIALOG_TEXTS.CURRENT_OPERATION_COPYING,
          );
        }
        this.applicationDataManagerService.saveToAppData({
          FirmwareCurrentProgress: parseInt(FirmwareConstants.UPDATE_STATUS_START, 10),
        });
        this.deviceManagerService.sendToDevice(this.performAction, {
          [FirmwareConstants.UUID.FIRMWARE_UPDATE]: this.usb,
        });
        this.firmwareProgressService.listenToFirmwareCopyStatus();
      }
    });
  }

  openCloseRelNotes() {
    if (this.relNotesOpenState) {
      this.relNotesOpenState = false;
    } else {
      this.relNotesOpenState = true;
    }
  }

  openBoseWork() {
    window.open(FirmwareConstants.BOSE_WORK_LINK, '_blank');
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
