import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { VideoConstant, AutoFrameSettingConstant } from 'app/video/video.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FabMiniModel } from '@shared/models/fab.model';
import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';
import { AppConfig } from '@environment/environment';

@Component({
  selector: 'app-autoframe-settings',
  templateUrl: './autoframe-settings.component.html',
  styleUrls: ['./autoframe-settings.component.scss'],
})
export class AutoframeSettingsComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  deleteAction = AppConstants.Action.Delete;
  updateAction = AppConstants.Action.Update;
  autoframeText: string;
  innerHTML = VideoConstant.ICON.AUTOFRAMING_ON_ICON;
  toggleText = VideoConstant.TEXT.ENABLED;
  bboxtoggleText = VideoConstant.TEXT.ENABLED;
  fabMiniStyles: FabMiniModel;
  elementID: string;
  autoframeStateUUID = VideoConstant.UUID.AUTOFRAMING_STATE_UUID;
  headroomAdjustmentUUID = VideoConstant.UUID.HEADROOM_ADJUSTMENT_UUID;
  zoomSpeedUUID = VideoConstant.UUID.ZOOM_SPEED_UUID;
  panTiltSpeedUUID = VideoConstant.UUID.PAN_TILT_SPEED_UUID;
  borderSizeUUID = VideoConstant.UUID.BORDER_SIZE_UUID;
  headroomAdjustmentArray = [
    { text: VideoConstant.TEXT.HEADROOM_SITTING_TEXT, value: VideoConstant.TEXT.HEADROOM_SITTING_TEXT.toLowerCase() },
    { text: VideoConstant.TEXT.HEADROOM_STANDING_TEXT, value: VideoConstant.TEXT.HEADROOM_STANDING_TEXT.toLowerCase() },
  ];
  speedArray = [
    { text: VideoConstant.TEXT.SPEED_SLOW_TEXT, value: VideoConstant.TEXT.SPEED_SLOW_TEXT.toLowerCase() },
    { text: VideoConstant.TEXT.SPEED_NORMAL_TEXT, value: VideoConstant.TEXT.SPEED_NORMAL_TEXT.toLowerCase() },
    { text: VideoConstant.TEXT.SPEED_FAST_TEXT, value: VideoConstant.TEXT.SPEED_FAST_TEXT.toLowerCase() },
  ];
  sizeArray = [
    { text: VideoConstant.TEXT.SIZE_SMALL_TEXT, value: VideoConstant.TEXT.SIZE_SMALL_TEXT.toLowerCase() },
    { text: VideoConstant.TEXT.SIZE_NORMAL_TEXT, value: VideoConstant.TEXT.SIZE_NORMAL_TEXT.toLowerCase() },
    { text: VideoConstant.TEXT.SIZE_LARGE_TEXT, value: VideoConstant.TEXT.SIZE_LARGE_TEXT.toLowerCase() },
  ];
  disable = false;
  autoFrameOn = false;
  toggleChecked = true;
  cameraEnabled = false;
  osdBboxChecked = false;
  isDesktopApp = AppConfig.isDesktopApp;

  constructor(private deviceManagerService: DeviceDataManagerService, private ngZone: NgZone) {}

  ngOnInit() {
    this.elementID = VideoConstant.UUID.AUTOFRAMING_STATE_UUID;
    this.fabMiniStyles = new FabMiniModel(
      AutoFrameSettingConstant.autoframeOnStyles,
      AutoFrameSettingConstant.autoframeOffStyles,
      AutoFrameSettingConstant.autoframeDirectvieStyles,
      AutoFrameSettingConstant.autoframeDisabledStyles,
    );
    this.onInitListenForNotification();
    this.onCameraAccessNotify();
    this.listenOsdBbox();
  }

  onCameraAccessNotify() {
    this.deviceManagerService
      .listenFromDevice(CONFIGURATION_CONSTANTS.UUID.CAMERA_ENABLED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((cameraEnabled: string) => {
        this.ngZone.run(() => {
          if (cameraEnabled === '1') {
            this.cameraEnabled = true;
          } else {
            this.cameraEnabled = false;
          }
        });
      });
  }

  onInitListenForNotification() {
    this.deviceManagerService
      .listenFromDevice(VideoConstant.UUID.AUTOFRAME_ENABLED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((autoframeEnabled: string) => {
        this.ngZone.run(() => {
          if (autoframeEnabled === '1') {
            this.toggleChecked = true;
            this.disable = false;
            this.toggleText = VideoConstant.TEXT.ENABLED;
          } else {
            this.toggleChecked = false;
            this.disable = true;
            this.toggleText = VideoConstant.TEXT.DISABLED;
          }
        });
      });
  }

  updateUIOnChangeOfAutoframe(value: boolean) {
    this.ngZone.run(() => {
      this.autoFrameOn = value;
      if (value) {
        this.autoframeText = VideoConstant.TEXT.AUTOFRAME_ON;
      } else {
        this.autoframeText = VideoConstant.TEXT.AUTOFRAME_OFF;
      }
    });
  }

  onToggleChange(change: MatSlideToggleChange) {
    if (change.checked) {
      this.toggleText = VideoConstant.TEXT.ENABLED;
      this.disable = false;
      this.deviceManagerService.sendToDevice(this.updateAction, {
        [VideoConstant.UUID.AUTOFRAME_ENABLED]: AppConstants.StateOn,
      });
    } else {
      this.toggleText = VideoConstant.TEXT.DISABLED;
      this.disable = true;
      this.deviceManagerService.sendToDevice(this.updateAction, {
        [VideoConstant.UUID.AUTOFRAMING_STATE_UUID]: AppConstants.StateOff,
        [VideoConstant.UUID.AUTOFRAME_ENABLED]: AppConstants.StateOff,
      });
    }
  }

  // OSDBbox is Autoframe Information
  listenOsdBbox() {
    this.deviceManagerService
      .listenFromDevice(VideoConstant.UUID.OSD_BBOX)
      .pipe(
        takeUntil(this.unsubscribe),
        map((value: string) => value !== AppConstants.StateOff),
      )
      .subscribe((osdBboxValue: boolean) => {
        this.ngZone.run(() => {
          this.osdBboxChecked = osdBboxValue;
          if (this.osdBboxChecked) {
            this.bboxtoggleText = VideoConstant.TEXT.ENABLED;
          } else {
            this.bboxtoggleText = VideoConstant.TEXT.DISABLED;
          }
        });
      });
  }

  onBboxToggleChange() {
    this.osdBboxChecked = !this.osdBboxChecked;
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [VideoConstant.UUID.OSD_BBOX]: this.osdBboxChecked ? AppConstants.StateOn : AppConstants.StateOff,
    });
    if (this.osdBboxChecked) {
      this.bboxtoggleText = VideoConstant.TEXT.ENABLED;
    } else {
      this.bboxtoggleText = VideoConstant.TEXT.DISABLED;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
