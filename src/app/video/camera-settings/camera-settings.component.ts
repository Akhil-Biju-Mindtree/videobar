import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { VideoConstant } from 'app/video/video.constant';
import { PresetControlModel, PresetModel } from './camera-settings-preset/camera-preset.model';
import { FormGroup } from '@angular/forms';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { NotificationService } from '@shared/components/notification/notification.service';
import {
  NotificationData,
  NotificationType,
  NotificationVposition,
  NotificationHposition,
} from '@shared/components/notification/notification-model';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'app/video/video-candeactivate-guard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConfig } from '@environment/environment';

const presetcontrols = [
  { label: 'Pan', preset: 'pan', uuid: VideoConstant.UUID.CAMERA_PAN_UUID },
  { label: 'Tilt', preset: 'tilt', uuid: VideoConstant.UUID.CAMERA_TILT_UUID },
  { label: 'Zoom', preset: 'zoom', uuid: VideoConstant.UUID.CAMERA_ZOOM_UUID },
];

const presets = [
  {
    label: 'Preset 1',
    uuid: VideoConstant.UUID.FIRST_PRESET_UUID,
    savePresetuuid: VideoConstant.UUID.CAMERA_SAVE_PRESET_FIRST,
    successMessage: VideoConstant.TEXT.PRESET1SAVED,
    presetId: AppConstants.PRESET_ONE_VALUE,
    value: AppConstants.PRESET_ONE_VALUE,
  },
  {
    label: 'Preset 2',
    uuid: VideoConstant.UUID.SECOND_PRESET_UUID,
    savePresetuuid: VideoConstant.UUID.CAMERA_SAVE_PRESET_SECOND,
    successMessage: VideoConstant.TEXT.PRESET2SAVED,
    presetId: AppConstants.PRESET_TWO_VALUE,
    value: AppConstants.PRESET_TWO_VALUE,
  },
  {
    label: 'Home',
    uuid: VideoConstant.UUID.HOME_PRESET_UUID,
    savePresetuuid: VideoConstant.UUID.CAMERA_SAVE_HOME_PRESET,
    successMessage: VideoConstant.TEXT.HOMEPRESETSAVED,
    presetId: AppConstants.PRESET_HOME_VALUE,
    value: AppConstants.PRESET_HOME_VALUE,
  },
];

@Component({
  selector: 'app-camera-settings',
  templateUrl: './camera-settings.component.html',
  styleUrls: ['./camera-settings.component.scss'],
})
export class CameraSettingsComponent implements CanComponentDeactivate, OnInit, OnDestroy, AfterViewInit {
  cameraUUIDconstants = VideoConstant.UUID;
  presetButtonLabel = VideoConstant.TEXT.PRESET_BUTTON_LABEL;
  currentPresetValue = undefined;
  deleteAction = AppConstants.Action.Delete;
  presetControls: PresetControlModel[] = presetcontrols;
  ptzFormGroup: FormGroup = new FormGroup({});
  showSelectPanel = false;
  presets: PresetModel[] = presets;
  presetsFormGroup = new FormGroup({});
  restoreDefault = new Subject();
  restoreObservable = this.restoreDefault.asObservable();
  controlData = {};
  unSubscribe: Subject<void> = new Subject();
  isZoomedOut = false;
  isDropDownDisabled = true;
  isDesktopApp = AppConfig.isDesktopApp;

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private notificationService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit() {
    this.createPresetsForm();
  }

  ngAfterViewInit() {
    this.subscribeFormState();
  }
  handleSliderUpdate(value, index) {
    setTimeout(() => {
      if (index === 2) {
        if (+value === 1) {
          this.isZoomedOut = true;
        } else {
          this.isZoomedOut = false;
        }
      }
    },         0);
  }

  createPresetsForm() {
    this.presets.forEach((preset: PresetModel) => {
      const presetForm = new FormGroup({});
      this.presetsFormGroup.addControl(preset.uuid, presetForm);
      this.controlData[preset.uuid] = JSON.parse(JSON.stringify(this.presetControls));
    });
  }

  isControlDisabled(index) {
    return this.isZoomedOut && index !== 2;
  }

  toggleSelectPanel() {
    this.showSelectPanel = !this.showSelectPanel;
  }

  onSavePreset(preset: PresetModel) {
    this.restoreDefault.next(preset.label);
    if (preset.presetId === AppConstants.PRESET_HOME_VALUE) {
      this.showDialog(
        VideoConstant.DIALOG_TEXTS.SAVE_HOME_PRESET_DIALOG_HEADER,
        VideoConstant.DIALOG_TEXTS.SAVE_HOME_PRESET_DIALOG_CONTENT,
        VideoConstant.DIALOG_TEXTS.SAVE_HOME_PRESET_CONFIRM_TEXT,
      ).then((res: boolean) => {
        if (res) {
          this.savePreset(preset);
        }
      });
    } else {
      this.savePreset(preset);
    }
    this.currentPresetValue = undefined;
  }

  savePreset(preset) {
    this.deviceManagerService
      .sendToDevice(AppConstants.Action.Perform, {
        [preset.savePresetuuid]: '',
      })
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((reponse: any) => {
        this.showSuccessWithAutoClose(preset.successMessage);
      });
  }

  showNotification(event) {
    switch (event) {
      case AppConstants.PRESET_ONE_VALUE:
        this.showSuccessWithAutoClose(VideoConstant.TEXT.PRESET1SAVED);
        break;

      case AppConstants.PRESET_TWO_VALUE:
        this.showSuccessWithAutoClose(VideoConstant.TEXT.PRESET2SAVED);
        break;

      case AppConstants.PRESET_HOME_VALUE:
        this.showSuccessWithAutoClose(VideoConstant.TEXT.HOMEPRESETSAVED);
        break;
    }
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

  canDeactivate() {
    if (this.checkDirty()) {
      return this.showDialog(
        VideoConstant.DIALOG_TEXTS.UNSAVED_CHANGES_DIALOG_HEADER,
        VideoConstant.DIALOG_TEXTS.UNSAVED_CHANGES_DIALOG_CONTENT,
        VideoConstant.DIALOG_TEXTS.UNSAVED_CHANGES_CONFIRM_TEXT,
      );
    }
    return true;
  }

  checkDirty() {
    let dirty = false;
    for (const preset of this.presets) {
      if (this.presetsFormGroup.get(preset.uuid).dirty) {
        dirty = true;
        return dirty;
      }
    }
    return dirty;
  }

  showDialog(title, content, confirm) {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = title;
    confirmationDialogModel.content = content;
    confirmationDialogModel.confirmButtonLabel = confirm;
    return this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel);
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  subscribeFormState() {
    this.ptzFormGroup.statusChanges.pipe(takeUntil(this.unSubscribe)).subscribe((status: string) => {
      setTimeout(() => {
        this.isDropDownDisabled = status !== AppConstants.VALID;
      },         0);
    });
  }
}
