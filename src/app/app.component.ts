import { Component, OnInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ServiceAdapter } from './providers/service-adapter';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { AppConstants, APP_INFO, READY_STATE_UUID, WAKEUP_DEVICE_UUID } from '@core/constants/app.constant';
import { AppConfig } from '@environment/environment';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { initialAppState } from '@core/store/state/app.state';
import { MapperService } from '@core/services/mapper.service';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { ConnectionDetectionService } from '@core/services/connection-detection.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { FirmwareProgressService } from './configuration/firmware/firmware-progress.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { DOWNLOAD_LOGS_STATUS } from './configuration/system/system.constant';
import { DownloadlogsService } from './configuration/system/downloadlogs.service';
import { AppSpinnerModel } from '@shared/components/app-spinner/app-spinner.model';
import { SharedConstants } from '@shared/shared.constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  writeChunkFn: Function;
  isAdminIconHidden: boolean;
  isDeviceAttached: boolean;
  isDesktopApp = AppConfig.isDesktopApp;
  passwordCanonicalName: string;
  unSubscribe = new Subject<void>();
  discoveryRoute = '/discovery';
  microphoneRoute = 'audio/microphones';
  loginRoute = 'login';
  settingsRoute = 'settings';
  statusRoute = 'status';
  configurationRoute = 'configuration';
  networkRoute = 'network';
  firmwareUpdateInProgress;
  firmwareCopyInProgress;
  logsDownloadStatus;
  isAuthenticated: Observable<any>;
  isDeviceEnterLowPowerMode = true;
  isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  @HostListener('window:beforeunload')
  onbeforeunload() {
    this.serviceAdapter.releaseResources();
  }

  @HostListener('mousedown')
  listeningToMouseUp() {
    if (this.isDeviceEnterLowPowerMode) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, { [WAKEUP_DEVICE_UUID]: '0' });
    }
  }

  get isFullScreen() {
    return this.applicationDataManagerService.listenForAppData(AppConstants.AUDIO_BEAMS_EXPANDED);
  }
  constructor(
    public router: Router,
    private ngZone: NgZone,
    public serviceAdapter: ServiceAdapter,
    private translate: TranslateService,
    private authService: AuthService,
    private deviceManagerService: DeviceDataManagerService,
    private mapperService: MapperService,
    private spinnerService: SpinnerService,
    private connectionDetectionService: ConnectionDetectionService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private fileAdaptor: FileServiceAdaptor,
    private firmwareProgressService: FirmwareProgressService,
    private confirmationDialogService: ConfirmationDialogService,
    private downloadlogsService: DownloadlogsService,
  ) {
    translate.setDefaultLang('en');
  }

  initializeData() {
    // TODO: Initial State Should go as disptach action
    window.addEventListener('online', () => {
      this.connectionDetectionService.setConnectionStatus(AppConstants.ONLINE);
    });
    window.addEventListener('offline', () => {
      this.connectionDetectionService.setConnectionStatus(AppConstants.OFFLINE);
    });
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, { [WAKEUP_DEVICE_UUID]: '0' });
    this.deviceManagerService
      .listenFromDevice(WAKEUP_DEVICE_UUID)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((lowPowerModeState: string) => {
        if (lowPowerModeState === AppConstants.StateOn) {
          this.isDeviceEnterLowPowerMode = true;
        } else {
          this.isDeviceEnterLowPowerMode = false;
        }
      });
    this.deviceManagerService
      .listenFromDevice(READY_STATE_UUID)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((readyState: string) => {
        if (
          readyState === AppConstants.StateOn &&
          (this.router.url === '/camera' || this.router.url === '/discovery')
        ) {
          this.subscribeHomeScreenDeviceComponent();
          this.retrieveHomeScreenDeviceComponent();
          this.spinnerService.closeSpinnerDialog();
        }
      });
    initialAppState.deviceData = this.mapperService.initialStateFromJSONMapper();
    this.authService.subscribeCredentials();
    this.applicationDataManagerService
      .listenForAppData(AppConstants.APP_DATA_KEYS.FIRMWARE_COPY_IN_PROGRESS_KEY)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: boolean) => {
        this.firmwareCopyInProgress = value;
      });
    this.applicationDataManagerService
      .listenForAppData(AppConstants.APP_DATA_KEYS.FIRMWARE_UPDATE_IN_PROGRESS_KEY)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: boolean) => {
        this.firmwareUpdateInProgress = value;
      });
    this.applicationDataManagerService
      .listenForAppData(AppConstants.APP_DATA_KEYS.LOGS_DOWNLOAD_IN_PROGRESS_KEY)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: boolean) => {
        this.logsDownloadStatus = value;
      });
    if (!this.isDesktopApp) {
      this.isAdminIconHidden = true;
      window.document.title = APP_INFO.APP_NAME_WEB;
      this.susbscribeFirmwareProgress();
      this.retrieveFirmwareProgress();
      this.subscribeSystemRebootStatus();
    }
    this.checkDeviceStatus();
    this.isAuthenticated = this.authService.subscribeAdminAuth();
  }

  ngOnInit() {
    // Initialize data only when it a web app or the main window process in the desktop app
    if (!this.isDesktopApp || this.serviceAdapter.remote.getCurrentWindow().getTitle() !== 'background') {
      this.initializeData();
    }
    if (this.isDesktopApp) {
      this.addScreenWidthHeightToCache();
    }
  }
  addScreenWidthHeightToCache() {
    this.applicationDataManagerService.saveToAppData({ [AppConstants.SCREEN_WIDTH_HEIGHT]: [-1, -1] });
  }
  // !Scroll Up of the page
  onActivate(event) {
    window.scroll(0, 0);
  }

  handleDettachDuringEvent() {
    this.fileAdaptor.send(null);
    if (this.firmwareCopyInProgress && this.isDesktopApp) {
      this.firmwareProgressService.showFailureDialog(AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_COPY);
      this.firmwareProgressService.resetFirmwareCopyState();
    } else if (this.firmwareUpdateInProgress) {
      this.firmwareProgressService.showFailureDialog(AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_UPDATE);
      this.firmwareProgressService.resetFirmwareUpdateState();
    } else {
      this.downloadlogsService.showErrorDialog(AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_COPY);
      this.downloadlogsService.resetLogState();
    }
    if (this.isDesktopApp) {
      this.authService.setAdminAccess(false);
      this.isAdminIconHidden = false;
      this.isDeviceAttached = false;
      this.ngZone.run(() => this.router.navigateByUrl(this.discoveryRoute));
    }
    if (this.firmwareCopyInProgress || this.firmwareUpdateInProgress) {
      this.firmwareProgressService.setFirmwareOpenDialog(false);
      this.firmwareProgressService.removeAlwaysOnListeners();
    }
  }

  checkDeviceStatus() {
    const STORAGE_DETACH = 'storage-detach';
    this.serviceAdapter.getDeviceConnectionStatus.subscribe((device: string) => {
      if (
        !this.firmwareCopyInProgress &&
        !this.firmwareUpdateInProgress &&
        this.logsDownloadStatus === DOWNLOAD_LOGS_STATUS.NONE
      ) {
        this.navigateTabsOnAttachAndDettachOfDevice(device);
      } else if (
        (this.firmwareCopyInProgress && device === STORAGE_DETACH) ||
        (this.firmwareUpdateInProgress && device === 'detach') ||
        (this.logsDownloadStatus === DOWNLOAD_LOGS_STATUS.COPY && device === STORAGE_DETACH) ||
        (this.logsDownloadStatus === DOWNLOAD_LOGS_STATUS.WAIT && device === 'detach')
      ) {
        this.handleDettachDuringEvent();
      } else if (this.logsDownloadStatus === DOWNLOAD_LOGS_STATUS.CONVERT && device === 'attach') {
        this.downloadlogsService.resetLogState();
      } else if (this.logsDownloadStatus === DOWNLOAD_LOGS_STATUS.CONVERT && device === STORAGE_DETACH) {
        this.navigateTabsOnAttachAndDettachOfDevice('detach');
      }
    });
  }

  navigateTabsOnAttachAndDettachOfDevice(device: string) {
    if (device === 'attach') {
      // !Device is Attached
      if (this.isDesktopApp && this.serviceAdapter.remote.getCurrentWindow().getTitle() !== 'background') {
        if (this.confirmationDialogService.dialogRef) {
          this.confirmationDialogService.closeConfirmationDialog();
          this.firmwareProgressService.setfirmwareErrorDialogOpen(false);
        }
        this.spinnerService.closeSpinnerDialog();
        this.ngZone.run(() => this.router.navigateByUrl('/camera'));
        this.isDeviceAttached = true;
        this.isAdminIconHidden = true;
        const restartDialog = new AppSpinnerModel();
        restartDialog.title = AppConstants.DEVICE_GETTING_READY;
        this.spinnerService.openSpinnerDialog(restartDialog, SharedConstants.TEXT.READY_STATE_TEXT_FLAG);
        this.deviceManagerService.sendToDevice(AppConstants.Action.Retrieve, { [READY_STATE_UUID]: '' });
        this.firmwareProgressService.alwaysListenForFirmwareUpdateStatus();
      } else if (!this.isDesktopApp) {
        if (this.confirmationDialogService.dialogRef) {
          this.confirmationDialogService.closeConfirmationDialog();
          this.firmwareProgressService.setfirmwareErrorDialogOpen(false);
        }
        this.susbscribeFirmwareProgress();
        this.retrieveFirmwareProgress();
        this.firmwareProgressService.alwaysListenForFirmwareUpdateStatus();
      }
    } else if (device === 'detach') {
      // !Device is Dettached
      if (this.isDesktopApp) {
        this.authService.setAdminAccess(false);
        this.isAdminIconHidden = false;
        this.isDeviceAttached = false;
        this.ngZone.run(() => this.router.navigateByUrl(this.discoveryRoute));
      }
      this.firmwareProgressService.setFirmwareOpenDialog(false);
      this.firmwareProgressService.removeAlwaysOnListeners();
    }
  }

  subscribeHomeScreenDeviceComponent() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Subscribe, AppConstants.HOME_SCREEN_UUIDS);
  }

  retrieveHomeScreenDeviceComponent() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Retrieve, AppConstants.HOME_SCREEN_UUIDS);
  }

  susbscribeFirmwareProgress() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Subscribe, AppConstants.FIRMWARE_PROGRESS_UUIDS);
  }

  retrieveFirmwareProgress() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Retrieve, AppConstants.FIRMWARE_PROGRESS_UUIDS);
  }

  subscribeSystemRebootStatus() {
    this.deviceManagerService.listenFromDevice(AppConstants.SYSTEM_REBOOT_UUID).subscribe((value: string) => {
      if (value === 'success') {
        this.authService.setAdminAccess(false);
        this.ngZone.run(() => this.router.navigateByUrl('/login'));
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
