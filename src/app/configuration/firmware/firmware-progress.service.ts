import { Injectable, NgZone } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { CONFIGURATION_CONSTANTS } from '../configuration.constant';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { AppConstants } from '@core/constants/app.constant';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { FirmwareProgressDialogModel } from '@shared/components/firmware-progress-dialog/firmware-progress-dialog.model';
import { FirmwareProgressDialogService } from '@shared/components/firmware-progress-dialog/firmware-progress-dialog.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { AppSpinnerModel } from '@shared/components/app-spinner/app-spinner.model';
import { SharedConstants } from '../../../../shared/constants/shared.constants';
import { FirmwareConstants } from './firmware.constant';
import { AppConfig } from '@environment/environment';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/logger/Logger';
import { TIMER_COUNTDOWN_ERROR } from '@core/error/error.constants';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';

@Injectable({
  providedIn: 'root',
})
export class FirmwareProgressService {
  copyStatusSubscription: Subscription;
  updateStatusSubscription: Subscription;
  alwaysListenUpdateStatusSubscription: Subscription;
  firmwareProgressDialogOpen = false;
  firmwareErrorDialogOpen = false;
  rebootKey = 'reboot';
  noneKey = 'none';
  ipText = 'ip';
  updateStepFileSystemCurrentText = 'Updating filesystem';
  updateStepFileSystem = 1;
  updateStepCamera = 2;
  firmwareUpdateSteps;
  firmwareUpdateStatusAlways;
  totalFirmwareProgress;
  showRestartDialogFlag = false;
  performAction = AppConstants.Action.Perform;
  isDesktopApp = AppConfig.isDesktopApp;
  timeoutTimer = new Subject();

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private confirmationDialogService: ConfirmationDialogService,
    private firmwareProgressDialogService: FirmwareProgressDialogService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private spinnerService: SpinnerService,
    private router: Router,
    private authService: AuthService,
    private loggerService: Logger,
    private fileAdaptor: FileServiceAdaptor,
  ) {}

  startTimeoutTimer() {
    timer(TIMER_COUNTDOWN_ERROR.FIRMWARE_TIME)
      .pipe(takeUntil(this.timeoutTimer), take(1))
      .subscribe(() => {
        if (
          this.firmwareProgressDialogService.dialogRef &&
          this.firmwareProgressDialogService.dialogRef.componentInstance
        ) {
          this.firmwareProgressDialogService.closeProgressDialog();
          this.showFailureDialog(AppConstants.APP_DATA_KEYS.UPDATE_HUNG);
        }
      });
  }

  restartTimeout() {
    this.timeoutTimer.next();
    this.startTimeoutTimer();
  }

  listenToFirmwareCopyStatus() {
    this.restartTimeout();
    this.applicationDataManagerService.saveToAppData({ FirmwareCopyInProgress: true });
    this.firmwareProgressDialogOpen = true;
    this.copyStatusSubscription = this.applicationDataManagerService
      .listenForAppData(AppConstants.APP_DATA_KEYS.COPY_PROGRESS_RESPONSE_KEY)
      .pipe(debounceTime(400))
      .subscribe((progressStatus: any) => {
        this.ngZone.run(() => {
          this.restartTimeout();
          if (progressStatus === SharedConstants.statusfailure) {
            this.showFailureDialog(AppConstants.APP_DATA_KEYS.COPY_FAILURE_ERROR);
          } else {
            this.applicationDataManagerService.saveToAppData({ FirmwareCurrentProgress: progressStatus });
            if (progressStatus === FirmwareConstants.COPY_SUCCESS_STATUS) {
              this.removeCopyListerners();
              this.applicationDataManagerService.saveToAppData({ FirmwareCopyInProgress: false });
              this.firmwareProgressDialogService.dialogRef.componentInstance.updateStep(
                FirmwareConstants.DIALOG_TEXTS.CURRENT_OPERATION_WAITING_FOR_UPDATE,
              );
              this.applicationDataManagerService.saveToAppData({
                FirmwareCurrentProgress: parseInt(FirmwareConstants.UPDATE_STATUS_START, 10),
              });
              if (!this.isDesktopApp) {
                this.deviceManagerService.sendToDevice(this.performAction, {
                  [FirmwareConstants.UUID.FIRMWARE_UPDATE]: this.ipText,
                });
              }
              this.listenToFirmwareUpadteSteps();
            }
          }
        });
      });
  }

  listenToFirmwareUpadteSteps() {
    this.restartTimeout();
    this.applicationDataManagerService.saveToAppData({ FirmwareUpdateInProgress: true });
    this.updateStatusSubscription = this.deviceManagerService
      .listenFromDevice(FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS_STEPS)
      .subscribe((firmwareUpdateSteps: string) => {
        this.ngZone.run(() => {
          this.restartTimeout();
          if (
            firmwareUpdateSteps &&
            firmwareUpdateSteps !== this.noneKey &&
            firmwareUpdateSteps !== this.rebootKey &&
            this.firmwareProgressDialogService.dialogRef &&
            this.firmwareProgressDialogService.dialogRef.componentInstance
          ) {
            this.firmwareProgressDialogService.dialogRef.componentInstance.updateStep(
              `Updating ${firmwareUpdateSteps}`,
            );
          }
          this.firmwareUpdateSteps = firmwareUpdateSteps;
          if (this.firmwareUpdateSteps === this.rebootKey && this.showRestartDialogFlag) {
            this.resetFirmwareStatusAndSteps();
            this.applicationDataManagerService.saveToAppData({ FirmwareUpdateInProgress: false });
            this.firmwareProgressDialogService.closeProgressDialog();
            this.showRestartDialog();
          }
        });
      });
    this.listenToFirmwareUpdateStatus();
  }

  listenToFirmwareUpdateStatus() {
    this.restartTimeout();
    this.updateStatusSubscription = this.deviceManagerService
      .listenFromDevice(FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS)
      .subscribe((firmwareUpdateStatus: string) => {
        this.ngZone.run(() => {
          this.restartTimeout();
          if (
            firmwareUpdateStatus !== FirmwareConstants.UPDATE_SUCCESS_STATUS &&
            this.firmwareUpdateSteps !== this.rebootKey
          ) {
            this.showRestartDialogFlag = true;
          }
          if (firmwareUpdateStatus === SharedConstants.statusfailure) {
            this.showFailureDialog(AppConstants.APP_DATA_KEYS.UPDATE_FAILURE_ERROR);
            this.resetFirmwareStatusAndSteps();
          } else if (this.showRestartDialogFlag) {
            this.applicationDataManagerService.saveToAppData({
              FirmwareCurrentProgress: parseInt(firmwareUpdateStatus, 10),
            });
          }
        });
      });
  }

  showFailureDialog(errorType: string) {
    if (!this.firmwareErrorDialogOpen) {
      this.ngZone.run(() => {
        this.removeCopyListerners();
        this.removeUpdateListerners();
        this.resetDialogBox();
        const errorDialogModel = new ConfirmationDialogModel();
        if (errorType === AppConstants.APP_DATA_KEYS.COPY_FAILURE_ERROR) {
          errorDialogModel.title = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_HEADER_FIRMWARE_DEFAULT;
          errorDialogModel.content = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_CONTENT_FIRMWARE_COPY_FAILURE;
        } else if (errorType === AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_COPY) {
          errorDialogModel.title = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_HEADER_FIRMWARE_DISCONNECT_DURING_UPDATE;
          errorDialogModel.content =
            FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_CONTENT_FIRMWARE_DISCONNECT_DURING_COPY;
        } else if (errorType === AppConstants.APP_DATA_KEYS.UPDATE_FAILURE_ERROR) {
          errorDialogModel.title = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_HEADER_FIRMWARE_DEFAULT;
          errorDialogModel.content = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_CONTENT_FIRMWARE_UPDATE_FAILURE;
        } else if (errorType === AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_UPDATE) {
          errorDialogModel.title = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_HEADER_FIRMWARE_DISCONNECT_DURING_UPDATE;
          errorDialogModel.content =
            FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_CONTENT_FIRMWARE_DISCONNECT_DURING_UPDATE;
        } else if (errorType === AppConstants.APP_DATA_KEYS.DOWNLOAD_FAILURE_ERROR) {
          errorDialogModel.title = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_HEADER_FIRMWARE_DEFAULT;
          errorDialogModel.content = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_CONTENT_FIRMWARE_DOWNLOAD;
        } else if (errorType === AppConstants.APP_DATA_KEYS.UPDATE_HUNG) {
          errorDialogModel.title = FirmwareConstants.DIALOG_TEXTS.UPDATE_TIMEOUT;
          errorDialogModel.content = FirmwareConstants.DIALOG_TEXTS.UPDATE_STUCK_DEVICE;
        } else {
          errorDialogModel.title = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_HEADER_FIRMWARE_DEFAULT;
          errorDialogModel.content = FirmwareConstants.DIALOG_TEXTS.ERROR_DIALOG_CONTENT_FIRMWARE_DEFAULT;
        }
        errorDialogModel.dialogType = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_TYPE;
        errorDialogModel.confirmButtonLabel = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_CONFIRM_TEXT;
        this.confirmationDialogService.openConfirmationDialog(errorDialogModel).then((result: boolean) => {
          if (result) {
            this.firmwareProgressDialogOpen = false;
            this.firmwareErrorDialogOpen = false;
          }
        });
      });
    }
  }

  resetDialogBox() {
    this.firmwareErrorDialogOpen = true;
    this.showRestartDialogFlag = false;
    if (this.firmwareProgressDialogService.dialogRef) {
      this.firmwareProgressDialogService.closeProgressDialog();
    }
    this.applicationDataManagerService.saveToAppData({
      CopyProgress: parseInt(FirmwareConstants.UPDATE_STATUS_START, 10),
    });
    this.resetFirmwareUpdateState();
  }

  resetFirmwareCopyState() {
    this.applicationDataManagerService.saveToAppData({ FirmwareCopyInProgress: false });
  }

  resetFirmwareUpdateState() {
    this.applicationDataManagerService.saveToAppData({ FirmwareUpdateInProgress: false });
  }

  showRestartDialog() {
    this.showRestartDialogFlag = false;
    const restartDialog = new AppSpinnerModel();
    restartDialog.title = FirmwareConstants.DIALOG_TEXTS.RESTART_DIALOG_HEADER;
    this.spinnerService.openSpinnerDialog(restartDialog, FirmwareConstants.DIALOG_TEXTS.RESTART_DIALOG_HEADER);
    this.removeCopyListerners();
    this.removeUpdateListerners();
    this.applicationDataManagerService.saveToAppData({
      CopyProgress: parseInt(FirmwareConstants.UPDATE_STATUS_START, 10),
    });

    setTimeout(() => {
      if (this.router.url !== '/camera') {
        this.spinnerService.closeSpinnerDialog();
      }
      this.firmwareProgressDialogOpen = false;
      this.ngZone.run(() => {
        if (!AppConfig.isDesktopApp) {
          this.authService.setAdminAccess(false);
          this.router.navigateByUrl('/login');
        }
      });
    },         30000);
  }

  alwaysListenForFirmwareUpdateStatus() {
    this.alwaysListenUpdateStatusSubscription = this.deviceManagerService
      .listenFromDevice(FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS)
      .subscribe((firmwareUpdateStatusAlways: string) => {
        this.ngZone.run(() => {
          this.firmwareUpdateStatusAlways = firmwareUpdateStatusAlways;
          if (
            !this.firmwareProgressDialogOpen &&
            this.firmwareUpdateStatusAlways &&
            this.firmwareUpdateStatusAlways !== FirmwareConstants.UPDATE_SUCCESS_STATUS &&
            this.firmwareUpdateStatusAlways !== FirmwareConstants.UPDATE_STATUS_START &&
            this.firmwareUpdateStatusAlways !== SharedConstants.statusfailure
          ) {
            this.firmwareProgressDialogOpen = true;
            const firmwareProgressDialogModel = new FirmwareProgressDialogModel();
            firmwareProgressDialogModel.currentOperationText = this.updateStepFileSystemCurrentText;
            this.firmwareProgressDialogService.openProgressDialog(firmwareProgressDialogModel);
            this.listenToFirmwareUpadteSteps();
          } else if (
            !this.firmwareProgressDialogOpen &&
            this.firmwareUpdateStatusAlways === SharedConstants.statusfailure
          ) {
            this.showFailureDialog(AppConstants.APP_DATA_KEYS.UPDATE_FAILURE_ERROR);
            this.resetFirmwareStatusAndSteps();
          }
        });
      });
  }

  getStartingStep(currentStep) {
    if (currentStep === 'filesystem') {
      return this.updateStepFileSystem;
    }
    return this.updateStepCamera;
  }

  setFirmwareOpenDialog(value: boolean) {
    this.firmwareProgressDialogOpen = value;
  }

  setfirmwareErrorDialogOpen(value: boolean) {
    this.firmwareErrorDialogOpen = value;
  }

  removeCopyListerners() {
    if (this.copyStatusSubscription) {
      this.copyStatusSubscription.unsubscribe();
    }
  }

  removeUpdateListerners() {
    if (this.updateStatusSubscription) {
      this.updateStatusSubscription.unsubscribe();
    }
  }

  removeAlwaysOnListeners() {
    if (this.alwaysListenUpdateStatusSubscription) {
      this.alwaysListenUpdateStatusSubscription.unsubscribe();
    }
  }

  resetFirmwareStatusAndSteps() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Delete, {
      [FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS]: '',
      [FirmwareConstants.UUID.FIRMWARE_UPDATE_STATUS_STEPS]: '',
    });
  }
}
