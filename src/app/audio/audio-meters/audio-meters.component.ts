import { Component, OnInit, OnDestroy } from '@angular/core';
import { INPUT_LEVEL_METERS, OUTPUT_LEVEL_METERS } from './audio-meters.constant';
import { AUDIO_CONSTANTS } from '../audio.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';

@Component({
  selector: 'app-audio-meters',
  templateUrl: './audio-meters.component.html',
  styleUrls: ['./audio-meters.component.scss'],
})
export class AudioMetersComponent implements OnInit, OnDestroy {
  inputLevelMeters = INPUT_LEVEL_METERS;
  outputLevelMeters = OUTPUT_LEVEL_METERS;
  enableMeteringUUID = AUDIO_CONSTANTS.UUID.ENABLE_METERING_EVENTS;
  disableMeteringUUID = AUDIO_CONSTANTS.UUID.ENABLE_METERING_EVENTS;

  constructor(private deviceManagerService: DeviceDataManagerService) {}

  ngOnInit() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
      [this.enableMeteringUUID]: '1',
    });
  }

  ngOnDestroy() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
      [this.disableMeteringUUID]: '0',
    });
  }
}
