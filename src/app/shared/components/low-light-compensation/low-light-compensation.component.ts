import { Component, OnInit } from '@angular/core';
import { CameraViewConstant } from 'app/camera-view/camera-view.constant';
import { AppConstants } from '@core/constants/app.constant';
import { FabMiniModel } from '@shared/models/fab.model';
import { LowLightConstant } from './low-light-compensation.constant';

@Component({
  selector: 'app-low-light-compensation',
  templateUrl: './low-light-compensation.component.html',
  styleUrls: ['./low-light-compensation.component.scss'],
})
export class LowLightCompensationComponent implements OnInit {
  toolTipDelay: number;
  fabMiniStyles: FabMiniModel;
  elementID: string;
  toolTipText: { onText: string; offText: string };

  constructor() {}

  ngOnInit() {
    this.elementID = CameraViewConstant.UUID.LOW_LIGHT_CORRECTION_UUID;
    this.toolTipDelay = AppConstants.ToolTipDelay;
    this.fabMiniStyles = new FabMiniModel(
      LowLightConstant.lowLightCorrectionOnStyles,
      LowLightConstant.lowLightCorrectionOffStyles,
      LowLightConstant.lowLightDirectvieStyles,
    );
    this.toolTipText = {
      onText: CameraViewConstant.TEXT.LOW_LIGHT_CORRECTION_ON,
      offText: CameraViewConstant.TEXT.LOW_LIGHT_CORRECTION_OFF,
    };
  }
}
