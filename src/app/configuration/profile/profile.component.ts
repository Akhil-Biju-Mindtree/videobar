import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { NotificationData, NotificationType } from '@shared/components/notification/notification-model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AppSpinnerModel } from '@shared/components/app-spinner/app-spinner.model';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { ProfileDescriptionComponent } from '@shared/components/dialog/dialog-content/profile-description/profile-description.component';
import { NO_CHANGE_EVENT, PROFILE_CANONICAL_NAME } from '../system/system.constant';
import { SharedConstants } from '@shared/shared.constants';
import { AppConfig } from '@environment/environment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  fileType = 'json';
  profileDirty;
  profileName;
  profileDescription;
  profileDescriptionUI;
  uploadFile;
  disableApplyButton = true;
  on = AppConstants.StateOn;
  off = AppConstants.StateOff;
  performAction = AppConstants.Action.Perform;
  updateAction = AppConstants.Action.Update;
  retrieveAction = AppConstants.Action.Retrieve;
  profileUploaded = false;
  showProfileUploadSuccess = false;
  fileUploadActionText = CONFIGURATION_CONSTANTS.TEXT.PROFILE_UPLOAD_ACTION_TEXT;
  isDesktopApp = AppConfig.isDesktopApp;

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.onInitListenForNotification();
  }

  onInitListenForNotification() {
    this.deviceManagerService
      .listenFromDevice(CONFIGURATION_CONSTANTS.UUID.PROFILE_DIRTY_STATE)
      .pipe(takeUntil(this.unsubscribe), debounceTime(500))
      .subscribe((profileDirty: string) => {
        this.ngZone.run(() => {
          this.profileDirty = profileDirty;
        });
      });
    this.deviceManagerService
      .listenFromDevice(CONFIGURATION_CONSTANTS.UUID.PROFILE_DESCRPTION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((profileDescription: string) => {
        this.ngZone.run(() => {
          this.profileDescription = profileDescription;
          this.profileDescriptionUI = this.escapeHTMLTags(profileDescription);
        });
      });
    this.deviceManagerService
      .listenFromDevice(CONFIGURATION_CONSTANTS.UUID.PROFILE_NAME)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((profileName: string) => {
        this.ngZone.run(() => {
          this.profileName = profileName;
        });
      });
    this.deviceManagerService
      .listenFromDevice(CONFIGURATION_CONSTANTS.UUID.PROFILE_IMPORT_STATUS)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((profileImportStatus: string) => {
        this.ngZone.run(() => {
          this.profileUploaded = true;
          if (profileImportStatus === CONFIGURATION_CONSTANTS.TEXT.IMPORT_SUCCESS && this.showProfileUploadSuccess) {
            this.spinnerService.closeSpinnerDialog();
            this.showImportSuccess();
          }
          if (profileImportStatus === CONFIGURATION_CONSTANTS.TEXT.IMPORT_FAILURE && this.showProfileUploadSuccess) {
            this.spinnerService.closeSpinnerDialog();
            const confirmationDialogModel = new ConfirmationDialogModel();
            confirmationDialogModel.dialogType = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_TYPE;
            confirmationDialogModel.title = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_HEADER;
            confirmationDialogModel.content = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_CONTENT;
            confirmationDialogModel.confirmButtonLabel = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_CONFIRM_TEXT;
            this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel);
          }
        });
      });
  }

  escapeHTMLTags(content: string) {
    let replacedString = content.replace(/[<]/g, '&lt;');
    replacedString = replacedString.replace(SharedConstants.NEW_LINE_REG, SharedConstants.BREAK_LINE_TAG);
    return replacedString;
  }

  restoreDefaults() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.PROFILE_DIALOG_HEADER;
    confirmationDialogModel.content = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.PROFILE_DIALOG_CONTENT;
    confirmationDialogModel.confirmButtonLabel = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.PROFILE_CONFIRM_TEXT;

    this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel).then((result: boolean) => {
      if (result) {
        this.performRestoreDefault();
      }
    });
  }

  showImportSuccess() {
    const notificationProfileSuccess = new NotificationData();
    notificationProfileSuccess.message = CONFIGURATION_CONSTANTS.TEXT.PROFILE_UPLOAD_SUCCESS;
    notificationProfileSuccess.messageType = NotificationType.success;
    this.notificationService.showNotification(notificationProfileSuccess);
  }

  performRestoreDefault(isNoChnage?) {
    if (!isNoChnage) {
      const appSpinnerDialog = new AppSpinnerModel();
      appSpinnerDialog.title = CONFIGURATION_CONSTANTS.TEXT.RESTORING_DEFAULTS;
      this.spinnerService.openSpinnerDialog(appSpinnerDialog);
    }
    this.deviceManagerService
      .sendToDevice(this.performAction, {
        [CONFIGURATION_CONSTANTS.UUID.PROFILE_RESTORE]: '',
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.spinnerService.closeSpinnerDialog();
        if (isNoChnage) {
          this.profileUploaded = true;
          this.showImportSuccess();
        }
      });
  }

  downloadProfile() {
    this.dialogService.openDialog(
      ProfileDescriptionComponent,
      CONFIGURATION_CONSTANTS.TEXT.PROFILE_DESCRIPTION,
      '',
      {
        RefuteButtonLabel: AppConstants.CANCEL,
        confirmButtonLabel: AppConstants.CONTINUE,
      },
      {
        UUID: CONFIGURATION_CONSTANTS.UUID.PROFILE,
        DESCRIPTION: this.profileDescription,
      },
      true,
    );
  }

  getFileData(data) {
    if (data) {
      this.profileUploaded = false;
      const reader = new FileReader();
      reader.onload = () => {
        const parsedFileData = JSON.parse(reader.result.toString());
        parsedFileData['system.profileName'] = data.name.split('.')[0];
        this.disableApplyButton = false;
        this.uploadFile = parsedFileData;
      };
      reader.readAsText(data);
    } else {
      this.disableApplyButton = true;
    }
  }

  applyProfile() {
    const appSpinnerDialog = new AppSpinnerModel();
    appSpinnerDialog.title = CONFIGURATION_CONSTANTS.TEXT.UPLOAD_PROFILE;
    this.spinnerService.openSpinnerDialog(appSpinnerDialog);
    this.deviceManagerService
      .sendToDevice(this.updateAction, {
        [CONFIGURATION_CONSTANTS.UUID.PROFILE]: JSON.stringify(this.uploadFile),
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((responseData: any) => {
        if (
          responseData &&
          responseData.system &&
          responseData.system[PROFILE_CANONICAL_NAME].codePointAt(0).toString(16) === NO_CHANGE_EVENT
        ) {
          this.ngZone.run(() => {
            this.performRestoreDefault(true);
          });
        }
      });
    this.showProfileUploadSuccess = true;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
