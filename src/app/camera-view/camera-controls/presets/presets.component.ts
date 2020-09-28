import { Component, OnInit, Input, NgZone } from '@angular/core';
import { CameraViewConstant, PRESET_CONST } from 'app/camera-view/camera-view.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { FabMiniModel } from '@shared/models/fab.model';

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.scss'],
})
export class PresetsComponent implements OnInit {
  @Input() parentPreset;
  @Input() disableTooltip;
  toolTipText: { onText: string; offText: string };
  fabMiniStyles: FabMiniModel;
  toolTipDelay = AppConstants.ToolTipDelay;
  actionUpdate = AppConstants.Action.Update;
  actionPerform = AppConstants.Action.Perform;
  presetToolTipText_1 = CameraViewConstant.TEXT.PRESET_1;
  presetToolTipText_2 = CameraViewConstant.TEXT.PRESET_2;
  presetOneToolTipText = CameraViewConstant.TEXT.PRESET_ONE;
  presetUUID;

  constructor(private deviceManagerService: DeviceDataManagerService) {}

  ngOnInit() {
    this.validatePresetParent();
  }

  onPresetClick(): void {
    let presetValue;
    if (this.parentPreset === this.presetOneToolTipText) {
      presetValue = AppConstants.PRESET_ONE_VALUE;
    } else {
      presetValue = AppConstants.PRESET_TWO_VALUE;
    }
    // update activePreset
    this.deviceManagerService.sendToDevice(this.actionUpdate, { [this.presetUUID]: presetValue });
    // Preform applyActivePreset
    this.deviceManagerService.sendToDevice(this.actionPerform, {
      [CameraViewConstant.UUID.APPLY_ACTIVE_PRESET_UUID]: '',
    });
  }

  validatePresetParent() {
    if (this.parentPreset === this.presetOneToolTipText) {
      this.presetUUID = CameraViewConstant.UUID.ACTIVE_PRESET_UUID;
      this.fabMiniStyles = new FabMiniModel(
        PRESET_CONST.presetOneStyles,
        PRESET_CONST.presetOneStyles,
        PRESET_CONST.presetDirectvieStyles,
      );
      this.toolTipText = {
        onText: this.presetToolTipText_1,
        offText: this.presetToolTipText_1,
      };
    } else {
      this.presetUUID = CameraViewConstant.UUID.ACTIVE_PRESET_UUID;
      this.fabMiniStyles = new FabMiniModel(
        PRESET_CONST.presetTwoStyles,
        PRESET_CONST.presetTwoStyles,
        PRESET_CONST.presetDirectvieStyles,
      );
      this.toolTipText = {
        onText: this.presetToolTipText_2,
        offText: this.presetToolTipText_2,
      };
    }
  }
}
