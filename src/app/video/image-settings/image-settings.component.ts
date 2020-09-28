import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import {
  VideoConstant,
  SLIDERS_ITEMS,
  ANTIFLICKER_ITEMS,
  BackLightCompensationControl,
  BackLightValueList,
  WHITE_BALANCE,
} from '../video.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { CameraViewConstant } from 'app/camera-view/camera-view.constant';
import { AppConstants } from '@core/constants/app.constant';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { NotificationType, NotificationData } from '@shared/components/notification/notification-model';
import { NotificationService } from '@shared/components/notification/notification.service';
import { FabMiniModel } from '@shared/models/fab.model';
import { Subject } from 'rxjs';
import { LowLightConstant } from '@shared/components/low-light-compensation/low-light-compensation.constant';
import { FormGroup } from '@angular/forms';
import { takeUntil, map } from 'rxjs/operators';
import { AppConfig } from '@environment/environment';

@Component({
  selector: 'app-image-settings',
  templateUrl: './image-settings.component.html',
  styleUrls: ['./image-settings.component.scss'],
})
export class ImageSettingsComponent implements OnInit, OnDestroy {
  cameraUUID;
  antiflicker;
  sliders: {
    label: string;
    uuid: string;
  }[];

  lowLightElementID: string;
  fabMiniStyles: FabMiniModel;
  islowLightCorrectionOn: boolean;
  whiteBalance = WHITE_BALANCE;
  osdResChecked = false;

  factoryRestoreUUIDS = {
    [CameraViewConstant.UUID.LOW_LIGHT_CORRECTION_UUID]: '',
    [VideoConstant.UUID.CAMERA_ANTIFLICKER_UUID]: '',
    [VideoConstant.UUID.CAMERA_BRIGHTNESS_UUID]: '',
    [VideoConstant.UUID.CAMERA_CONTRAST_UUID]: '',
    [VideoConstant.UUID.CAMERA_SATURATION_UUID]: '',
    [VideoConstant.UUID.CAMERA_SHARPNESS_UUID]: '',
    [VideoConstant.UUID.CAMERA_WHITEBALANCE_UUID]: '',
    [VideoConstant.UUID.CAMERA_WHITEBALANCEAUTO_UUID]: '',
    [VideoConstant.UUID.BACKLIGHT_COMPENSATION]: '',
  };

  isDesktopApp = AppConfig.isDesktopApp;
  restoreDefault = new Subject();
  restoreObservable = this.restoreDefault.asObservable();
  backLightControl = BackLightCompensationControl;
  backLightForm: FormGroup = new FormGroup({});
  currentBackLight;
  restoggleText = VideoConstant.TEXT.ENABLED;
  backLightDropDownList = BackLightValueList;
  unSubscribe = new Subject();
  textBoxContainerWidth = {
    width: '46px',
  };

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    this.initializeImageTab();
    this.initializeLowLightCorrection();
    this.listenBackLightChanges();
    this.listenWhiteBalanceAuto();
    this.listenOsdRes();
  }

  initializeImageTab() {
    this.cameraUUID = VideoConstant.UUID.CAMERA_ANTIFLICKER_UUID;
    this.antiflicker = ANTIFLICKER_ITEMS;
    this.sliders = SLIDERS_ITEMS;
  }

  initializeLowLightCorrection() {
    this.lowLightElementID = CameraViewConstant.UUID.LOW_LIGHT_CORRECTION_UUID;
    this.fabMiniStyles = new FabMiniModel(
      {
        ...LowLightConstant.lowLightCorrectionOnStyles,
        width: VideoConstant.BUTTON.SIZE,
        height: VideoConstant.BUTTON.SIZE,
      },
      {
        ...LowLightConstant.lowLightCorrectionOffStyles,
        width: VideoConstant.BUTTON.SIZE,
        height: VideoConstant.BUTTON.SIZE,
      },
      LowLightConstant.lowLightDirectvieStyles,
    );
  }

  restoreDefaults() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = VideoConstant.DIALOG_TEXTS.AUTOFRAME_DIALOG_HEADER;
    confirmationDialogModel.content = VideoConstant.DIALOG_TEXTS.IMAGE_DIALOG_CONTENT;
    confirmationDialogModel.confirmButtonLabel = VideoConstant.DIALOG_TEXTS.AUTOFRAME_CONFIRM_TEXT;

    this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel).then((result: boolean) => {
      if (result) {
        this.deviceManagerService.sendToDevice(AppConstants.Action.Delete, this.factoryRestoreUUIDS);
        const notificationData = new NotificationData();
        notificationData.message = VideoConstant.TEXT.DEFAULT_RESTORED;
        notificationData.messageType = NotificationType.success;
        this.restoreDefault.next(true);
        this.notificationService.showNotification(notificationData);
      }
    });
  }

  onButtonClicked(value: boolean) {
    this.islowLightCorrectionOn = value;
  }

  listenBackLightChanges() {
    this.deviceManagerService
      .listenFromDevice(this.backLightControl.uuid)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((backLightValue: string) => {
        this.zone.run(() => {
          this.currentBackLight = backLightValue;
        });
      });
  }
  onDropdownReceive(data) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.backLightControl.uuid]: `${data.value}`,
    });
  }

  listenWhiteBalanceAuto() {
    this.deviceManagerService
      .listenFromDevice(this.whiteBalance[0].uuid)
      .pipe(
        takeUntil(this.unSubscribe),
        map((value: string) => value !== AppConstants.StateOff),
      )
      .subscribe((whiteBalanceAuto: boolean) => {
        this.zone.run(() => {
          this.whiteBalance[0].value = whiteBalanceAuto;
        });
      });
  }
  onWhiteBalanceAutoChecked(isChecked) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.whiteBalance[0].uuid]: isChecked ? AppConstants.StateOn : AppConstants.StateOff,
    });
  }

  isWhiteBalanceDisabled(): boolean {
    return this.whiteBalance[0].value;
  }

  // OSDRes is Video Resolution Overlay
  listenOsdRes() {
    this.deviceManagerService
      .listenFromDevice(VideoConstant.UUID.OSD_RES)
      .pipe(
        takeUntil(this.unSubscribe),
        map((value: string) => value !== AppConstants.StateOff),
      )
      .subscribe((osdResValue: boolean) => {
        this.zone.run(() => {
          this.osdResChecked = osdResValue;
          if (this.osdResChecked) {
            this.restoggleText = VideoConstant.TEXT.ENABLED;
          } else {
            this.restoggleText = VideoConstant.TEXT.DISABLED;
          }
        });
      });
  }

  onOsdResToggleChange() {
    this.osdResChecked = !this.osdResChecked;
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [VideoConstant.UUID.OSD_RES]: this.osdResChecked ? AppConstants.StateOn : AppConstants.StateOff,
    });
    if (this.osdResChecked) {
      this.restoggleText = VideoConstant.TEXT.ENABLED;
    } else {
      this.restoggleText = VideoConstant.TEXT.DISABLED;
    }
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
