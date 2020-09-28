import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { UIMapperModel } from '@shared/models/ui-mapper.model';
import { MapperService } from '@core/services/mapper.service';
import { CameraViewConstant } from 'app/camera-view/camera-view.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements OnInit, OnDestroy {
  notification$: Subscription;
  performAction = AppConstants.Action.Perform;
  updateAction = AppConstants.Action.Update;
  toolTipDelay = AppConstants.ToolTipDelay;
  cameraMinRange: number;
  cameraMaxRange: number;
  defaultZoomValue: number;
  cameraRangeStep: number;
  toolTipZoomStatus: string;
  autoFrameStatus = false;
  svgZoomIcon = CameraViewConstant.ICON.CAMERA_SLIDER_ZOOM_ICON;

  constructor(
    private mapperService: MapperService,
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.onInitRetrieveDefaultValue();
    this.onInitListenForNotification();
  }

  onInitListenForNotification() {
    this.notification$ = this.deviceManagerService
      .listenFromDevice(CameraViewConstant.UUID.CAMERA_ZOOM_UUID)
      .subscribe((notification: {}) => {
        if (notification) {
          this.ngZone.run(() => this.updateUIOnChangeOfState(notification));
        }
      });
  }

  updateUIOnChangeOfState(notification) {
    this.defaultZoomValue = +notification;
    this.toolTipZoomStatus = `Zoom: ${this.defaultZoomValue * 10}%`;
  }

  onInitRetrieveDefaultValue() {
    const device: UIMapperModel = this.mapperService.findObjectFromJSONMapper(CameraViewConstant.UUID.CAMERA_ZOOM_UUID);
    this.defaultZoomValue = +device.default;
    this.cameraMinRange = +device.range_min;
    this.cameraMaxRange = +device.range_max;
    this.cameraRangeStep = +device.range_step;
    this.toolTipZoomStatus = `Zoom: ${this.defaultZoomValue * 10}%`;
  }

  onZoomSliderChange(event: MatSliderChange) {
    /** if (this.defaultZoomValue > event.value) {
      this.deviceManagerService.sendToDevice(this.performAction, CAMERA_ZOOM_IN_UUID, event.value.toString());
    } else {
      this.deviceManagerService.sendToDevice(this.performAction, CAMERA_ZOOM_OUT_UUID, event.value.toString());
    } */
    this.deviceManagerService.sendToDevice(this.updateAction, {
      [CameraViewConstant.UUID.CAMERA_ZOOM_UUID]: event.value.toString(),
    });
    this.defaultZoomValue = event.value;
    this.toolTipZoomStatus = `Zoom: ${event.value * 10}%`;
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.notification$.unsubscribe();
  }
}
