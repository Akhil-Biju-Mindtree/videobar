import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { USB_APP_LINKS, SettingsConstants, WEB_APP_LINKS, SETTINGS_DIALOG_TEXTS } from './settings.constant';
import { APP_INFO, AppConstants } from '@core/constants/app.constant';
import { AppConfig } from '@environment/environment';
import { AppCheckService } from './app-check.service';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirmwareCheckService } from 'app/configuration/firmware/firmware-check.service';
import { AuthService } from '@core/auth/auth.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  usbLinks = USB_APP_LINKS;
  webLinks = WEB_APP_LINKS;
  appInfo = APP_INFO;
  isDesktopApp = AppConfig.isDesktopApp;
  isUpToDate: boolean;
  isUpToDateFirmware: boolean;
  appDownloadURL;
  detailsKey = 'details';
  firmwareVersion;
  cameraVersion;
  latestAppVersion;
  latestFirmwareVersion;
  isLoggedIn;
  constructor(
    private ngZone: NgZone,
    private appCheckService: AppCheckService,
    private http: HttpClientWrapperService,
    private deviceManagerService: DeviceDataManagerService,
    private firmwareCheckService: FirmwareCheckService,
    private authService: AuthService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit() {
    this.authService
      .subscribeAdminAuth()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value: boolean) => {
        this.ngZone.run(() => {
          this.isLoggedIn = value;
        });
      });
    this.checkForUpdate();
    this.deviceManagerService
      .listenFromDevice(SettingsConstants.UUID.FIRMWARE_VERSION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((currentFirmwareVersion: string) => {
        this.ngZone.run(() => {
          this.firmwareVersion = currentFirmwareVersion;
        });
      });
    this.deviceManagerService
      .listenFromDevice(SettingsConstants.UUID.CAMERA_VERSION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((currentCameraVersion: string) => {
        this.ngZone.run(() => {
          if (currentCameraVersion) {
            this.cameraVersion = currentCameraVersion.replace('V', '');
          }
        });
      });
  }

  checkForUpdate() {
    this.firmwareCheckService.isFirmwareUpToDate().pipe(takeUntil(this.unsubscribe)).subscribe((firmwareStatus: Object) => {
      this.ngZone.run(() => {
        this.isUpToDateFirmware = firmwareStatus[AppConstants.APP_DATA_KEYS.IS_UP_TO_DATE_KEY];
        if (!this.isUpToDateFirmware) {
          this.latestFirmwareVersion = firmwareStatus[this.detailsKey].latestFirmwareVersion;
        }
      });
    });
    this.appCheckService.isAppUpToDate().pipe(takeUntil(this.unsubscribe)).subscribe((appStatus: Object) => {
      this.ngZone.run(() => {
        this.isUpToDate = appStatus[AppConstants.APP_DATA_KEYS.IS_UP_TO_DATE_KEY];
        if (!this.isUpToDate) {
          this.latestAppVersion = appStatus[this.detailsKey].latestAppVersion;
          if (navigator.appVersion.indexOf('Win') !== -1) {
            this.appDownloadURL =
              AppConstants.SERVER_BASE_URL.replace('{version}', appStatus[this.detailsKey].pathVersion) +
              appStatus[this.detailsKey].downloadUrlWindows;
          }
          if (navigator.appVersion.indexOf('Mac') !== -1) {
            this.appDownloadURL =
              AppConstants.SERVER_BASE_URL.replace('{version}', appStatus[this.detailsKey].pathVersion) +
              appStatus[this.detailsKey].downloadUrlMac;
          }
        }
      });
    });
  }

  downloadLatestApp() {
    window.open(this.appDownloadURL, '_blank');
  }

  openNewTab(url: string) {
    window.open(url, '_blank');
  }

  openDynamicLink(url: string) {
    this.http.fetchVersionedLink(url, true).pipe(takeUntil(this.unsubscribe)).subscribe(
      (link: any) => {
        this.openNewTab(link);
      },
      () => {
        this.showConnectionError();
      },
    );
  }

  showConnectionError() {
    const errorDialogModel = new ConfirmationDialogModel();
    errorDialogModel.title = SETTINGS_DIALOG_TEXTS.NETWORK_ERROR_TITLE;
    errorDialogModel.content = SETTINGS_DIALOG_TEXTS.NETWORK_ERROR_CONTENT;
    errorDialogModel.dialogType = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_TYPE;
    errorDialogModel.confirmButtonLabel = CONFIGURATION_CONSTANTS.DIALOG_TEXTS.ERROR_DIALOG_CONFIRM_TEXT;
    this.confirmationDialogService.openConfirmationDialog(errorDialogModel);
  }

  setRedirectAfterLogin() {
    if (!this.isLoggedIn) {
      this.applicationDataManagerService.saveToAppData({ RedirectToFirmware: true });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
