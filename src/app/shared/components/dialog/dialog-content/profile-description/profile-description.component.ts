import { Component, OnInit, Inject, NgZone, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { DialogComponent } from '../../dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppSpinnerModel } from '@shared/components/app-spinner/app-spinner.model';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceAdapter } from '@providers/service-adapter';
import { Logger } from '@core/logger/Logger';
import { NotificationService } from '@shared/components/notification/notification.service';
import { SharedConstants } from '@shared/shared.constants';
import { NotificationData, NotificationType } from '@shared/components/notification/notification-model';
import { AppConfig } from '@environment/environment';
import { ErrorService } from '@core/error/error.service';
import { CachingService } from '@core/services/caching.service';
import { MapperService } from '@core/services/mapper.service';

@Component({
  selector: 'app-profile-description',
  templateUrl: './profile-description.component.html',
  styleUrls: ['./profile-description.component.scss'],
})
export class ProfileDescriptionComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  descriptionControl: FormControl;
  wordsTyped = 0;
  retrieveAction = AppConstants.Action.Retrieve;
  unsubscribe = new Subject<void>();
  profileDownloaded: string;
  deviceProfile: { [key: string]: string } = {};

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    private deviceManagerService: DeviceDataManagerService,
    private spinnerService: SpinnerService,
    private ngZone: NgZone,
    public serviceAdapter: ServiceAdapter,
    private loggerService: Logger,
    private notificationService: NotificationService,
    private errorService: ErrorService,
    private cachingService: CachingService,
    private mapperService: MapperService,
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      descriptionControl: [''],
    });
    this.formGroup.controls['descriptionControl'].setValue(
      this.data.value.DESCRIPTION.replace(SharedConstants.NEW_LINE_REG, SharedConstants.NEWLINE_TAG),
    );
    this.wordsTyped = this.formGroup.controls.descriptionControl.value.length;
    this.getWordsTypedLength();
    this.cachingService
      .getAllFromCache()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value: any) => {
        Object.keys(value.deviceData).forEach((eachCommanId: string) => {
          const object = this.mapperService.findObjectFromJSONMapperByCommandId(eachCommanId);
          if (object.provision === 'yes') {
            this.deviceProfile[object.canonical_name] = value.deviceData[eachCommanId];
          }
        });
      });
  }

  getWordsTypedLength() {
    return this.formGroup.controls.descriptionControl.value.length;
  }

  onSubmitDialog() {
    this.dialogRef.close();
    const appSpinnerDialog = new AppSpinnerModel();
    appSpinnerDialog.title = SharedConstants.TEXT.DOWNLOAD_PROFILE_HEADER;
    this.spinnerService.openSpinnerDialog(appSpinnerDialog);
    this.deviceProfile['system.profileDescription'] = this.formGroup.controls.descriptionControl.value.replace(
      SharedConstants.NEWLINE_REGEX,
      SharedConstants.NEW_LINE_TAG,
    );
    this.profileDownloaded = JSON.stringify(this.deviceProfile);
    this.spinnerService.closeSpinnerDialog();
    if (AppConfig.isDesktopApp) {
      this.saveProfile();
    } else {
      this.saveProfileWeb();
    }
  }

  saveProfile() {
    const options = {
      defaultPath: `${this.serviceAdapter.remote.app.getPath('downloads')}/${
        JSON.parse(this.profileDownloaded)['system.profileName']
      }.json`,
      filters: [
        { name: SharedConstants.FILE_TYPE_TEXT.JSON_FILE, extensions: ['json'] },
        { name: SharedConstants.FILE_TYPE_TEXT.ALL_FILES, extensions: ['*'] },
      ],
    };
    if (this.serviceAdapter.remote.getCurrentWindow().getTitle() !== 'background') {
      this.serviceAdapter.remote.dialog.showSaveDialog(null, options).then((result: any) => {
        if (!result.canceled && result.filePath) {
          this.serviceAdapter.fs.writeFile(result.filePath, this.profileDownloaded, (err: any) => {
            if (err) {
              this.loggerService.debug(`Profile Save Error :::::: ${JSON.stringify(err)}`);
              this.errorService.showError(SharedConstants.TEXT.PROFILE_SAVE_FAILED);
            }
          });
          const notificationDataSuccess = new NotificationData();
          notificationDataSuccess.message = SharedConstants.TEXT.PROFILE_SAVED_SUCCESS;
          notificationDataSuccess.messageType = NotificationType.success;
          this.notificationService.showNotification(notificationDataSuccess);
        }
      }).catch((err: any) => {
        this.loggerService.error(`Can't save the file ${err}`);
      });
    }
  }

  saveProfileWeb() {
    const blob = new Blob([this.profileDownloaded], { type: 'data:text/json' });
    // output file name
    const file = `${JSON.parse(this.profileDownloaded)['system.profileName']}.json`;

    // detect whether the browser is IE/Edge or another browser
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // To IE or Edge browser, using msSaveorOpenBlob method to download file.
      window.navigator.msSaveOrOpenBlob(blob, file);
    } else {
      // To another browser, create a tag to downlad file.
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = file;
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

  onEvent(event) {
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
