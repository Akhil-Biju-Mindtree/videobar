import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CameraViewConstant } from '../camera-view.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ContextMenuConfig, ContextMenuData } from '@shared/components/context-menu/context.menu.model';
import { NotificationService } from '@shared/components/notification/notification.service';
import {
  NotificationData,
  NotificationType,
  NotificationVposition,
  NotificationHposition,
} from '@shared/components/notification/notification-model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-camera-controls',
  templateUrl: './camera-controls.component.html',
  styleUrls: ['./camera-controls.component.scss'],
})
export class CameraControlsComponent implements OnInit, OnDestroy {
  containerWidthStyle = {};
  uuid = CameraViewConstant.UUID;
  svgZoomIconMinus = CameraViewConstant.ICON.CAMERA_SLIDER_ZOOM_MINUS_ICON;
  svgZoomIconPlus = CameraViewConstant.ICON.CAMERA_SLIDER_ZOOM_PLUS_ICON;
  svgVolumeIconMinus = CameraViewConstant.ICON.VOLUME_SLIDER_MINUS_ICON;
  svgVolumeIconPlus = CameraViewConstant.ICON.VOLUME_SLIDER_PLUS_ICON;
  svgVolumeIconMute = CameraViewConstant.ICON.VOLUME_SLIDER_MUTE_ICON;
  svgVolumeIconSpeaker = CameraViewConstant.ICON.VOLUME_SLIDER_SPEAKER_ICON;
  menuItems = CameraViewConstant.CONTEXT_MENU_ITEMs;
  contextMenuConfig = new ContextMenuConfig();
  contextMenuData = new ContextMenuData();
  isPanTiltDisabled = false;
  toolTipZoomStatus = 'Zoom';
  toolTipVolumeStatus = 'Volume';
  toolTipDelay = AppConstants.ToolTipDelay;
  volumeMute = false;
  volumeLoadedFirstTime = true;
  unsubscribe = new Subject<void>();

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private notificationService: NotificationService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.contextMenuConfig.showMenu = false;
    this.containerWidthStyle = {
      width: CameraViewConstant.CAMERA_SLIDER_ZOOM_WIDTH,
    };
    this.deviceManagerService.listenFromDevice(CameraViewConstant.UUID.SPEAKER_MUTE)
    .pipe(takeUntil(this.unsubscribe)).subscribe((muteValue: any) => {
      this.ngZone.run(() => {
        if (muteValue === AppConstants.StateOff) {
          this.volumeMute = false;
        } else {
          this.volumeMute = true;
        }
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onRightClick(event: MouseEvent, presetId) {
    /*Detect mouse right click */
    if (event.button === CameraViewConstant.MOUSE_RIGHT_BUTTON) {
      event.preventDefault();
      const target = <HTMLElement>event.currentTarget;
      const parent = <HTMLElement>target.offsetParent;
      this.contextMenuConfig.yPos = target.offsetTop + target.offsetHeight - 6;
      this.contextMenuConfig.xPos = parent.offsetLeft + target.offsetLeft + target.offsetWidth - 6;
      this.contextMenuConfig.showMenu = true;
      this.contextMenuData.params = { presetId };
    }
  }

  contextMenuSelect(event: ContextMenuData) {
    if (event.selectedItem.value === 0) {
      this.activatePreset(event.params.presetId);
    } else if (event.selectedItem.value === 1) {
      if (event.params.presetId === AppConstants.PRESET_ONE_VALUE) {
        this.savePreset(this.uuid.SAVE_PRESET_FIRST, CameraViewConstant.TEXT.PRESET1_SAVE_SUCCESS);
      } else if (event.params.presetId === AppConstants.PRESET_TWO_VALUE) {
        this.savePreset(this.uuid.SAVE_PRESET_SECOND, CameraViewConstant.TEXT.PRESET2_SAVE_SUCCESS);
      }
    }
  }

  activatePreset(presetId) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.uuid.ACTIVE_PRESET_UUID]: presetId,
    });

    this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
      [this.uuid.APPLY_ACTIVE_PRESET_UUID]: '',
    });
  }

  savePreset(savePresetUuid, successMessage) {
    this.deviceManagerService
      .sendToDevice(AppConstants.Action.Perform, {
        [savePresetUuid]: '',
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.showSuccessWithAutoClose(successMessage);
      });
  }

  showSuccessWithAutoClose(message) {
    const notificationData = new NotificationData();
    notificationData.message = message;
    notificationData.messageType = NotificationType.success;
    notificationData.showButton = false;
    notificationData.verticalPosition = NotificationVposition.bottom;
    notificationData.horizontalPosition = NotificationHposition.left;
    this.notificationService.showNotification(notificationData);
  }

  handleZoomChange(value) {
    this.ngZone.run(() => {
      if (+value === 1) {
        this.isPanTiltDisabled = true;
      } else if (+value > 1 && value !== undefined) {
        this.isPanTiltDisabled = false;
      }
    });
  }

  handleVolumeChange(value) {
    this.ngZone.run(() => {
      const volume = value === undefined ? undefined : parseInt(value, 10);
      if (volume !== undefined) {
        if (volume && !this.volumeLoadedFirstTime) {
          this.volumeMute = false;
        } else if (volume === 0 && !this.volumeLoadedFirstTime) {
          this.volumeMute = true;
        } else {
          this.volumeLoadedFirstTime = false;
        }
      }
    });
  }

  volumeAction(value) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [CameraViewConstant.UUID.SPEAKER_MUTE]: value,
    });
    if (value === AppConstants.StateOff) {
      this.volumeMute = false;
    } else {
      this.volumeMute = true;
    }
  }
}
