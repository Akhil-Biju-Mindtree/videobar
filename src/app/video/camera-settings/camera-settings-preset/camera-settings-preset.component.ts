import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit, NgZone } from '@angular/core';
import { PresetControlModel, PresetModel } from './camera-preset.model';
import { FormGroup } from '@angular/forms';
import { VideoConstant } from 'app/video/video.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { delay, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera-settings-preset',
  templateUrl: './camera-settings-preset.component.html',
  styleUrls: ['./camera-settings-preset.component.scss'],
})
export class CameraSettingsPresetComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() preset: PresetModel;
  @Input() controls: PresetControlModel[];
  @Input() restoreDefault: Observable<any>;
  @Output() presetSaved = new EventEmitter();
  @Input() parentForm: FormGroup;
  triggerRestore = new Subject();
  triggerRestoreObservable = this.triggerRestore.asObservable();
  sortedControls: PresetControlModel[];
  activatePresetIcon = VideoConstant.ICON.CAMERA_PRESET_ACTIVATE;
  toolTipDelay = AppConstants.ToolTipDelay;
  unsubscribe = new Subject();

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private confirmationDialogService: ConfirmationDialogService,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    this.restoreDefault.pipe(takeUntil(this.unsubscribe)).subscribe((label: any) => {
      if (label === this.preset.label || label === 'all') {
        this.triggerRestore.next(true);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.subscribePreset();
  }

  subscribePreset() {
    this.deviceManagerService
      .listenFromDevice(this.preset.uuid)
      /*delay(0) added to prevent ExpressionChangedAfterChecked error during init*/
      .pipe(delay(0), takeUntil(this.unsubscribe))
      .subscribe((ptzValue: string) => {
        if (ptzValue) {
          this.setPTZvalue(ptzValue);
        }
      });
  }

  setPTZvalue(ptzValue) {
    this.zone.run(() => {
      const values = ptzValue.split(' ');
      values.forEach((value, i) => {
        this.controls[i].value = value;
      });
      this.parentForm.markAsPristine();
      this.parentForm.markAsUntouched();
    });
  }

  onSavePreset() {
    if (this.preset.presetId === AppConstants.PRESET_HOME_VALUE) {
      this.showDialog(
        VideoConstant.DIALOG_TEXTS.SAVE_HOME_PRESET_DIALOG_HEADER,
        VideoConstant.DIALOG_TEXTS.SAVE_HOME_PRESET_DIALOG_CONTENT,
        VideoConstant.DIALOG_TEXTS.SAVE_HOME_PRESET_CONFIRM_TEXT,
      ).then((res: boolean) => {
        if (res) {
          this.savePreset();
        }
      });
    } else {
      this.savePreset();
    }
  }

  showDialog(title, content, confirm) {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = title;
    confirmationDialogModel.content = content;
    confirmationDialogModel.confirmButtonLabel = confirm;
    return this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel);
  }

  savePreset() {
    let presetValue = '';
    for (const control of this.controls) {
      presetValue = `${presetValue} ${this.parentForm.get(control.uuid).value}`;
    }
    this.deviceManagerService
      .sendToDevice(AppConstants.Action.Update, {
        [this.preset.uuid]: presetValue.trim(),
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.parentForm.markAsPristine();
        this.presetSaved.emit(this.preset.presetId);
      });
  }

  activatePreset() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [VideoConstant.UUID.ACTIVE_PRESET_UUID]: this.preset.presetId,
    });

    this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
      [VideoConstant.UUID.APPLY_ACTIVE_PRESET_UUID]: '',
    });
  }
}
