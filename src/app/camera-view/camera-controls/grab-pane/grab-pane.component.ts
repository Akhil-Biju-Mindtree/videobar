import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { CameraViewConstant } from 'app/camera-view/camera-view.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grab-pane',
  templateUrl: './grab-pane.component.html',
  styleUrls: ['./grab-pane.component.scss'],
})
export class GrabPaneComponent implements OnInit, OnChanges, OnDestroy {
  updateAction = AppConstants.Action.Update;
  performAction = AppConstants.Action.Perform;
  ptHome = AppConstants.COLORS.LIGHT_GREY;
  tiltDown = AppConstants.COLORS.LIGHT_GREY;
  tiltUp = AppConstants.COLORS.LIGHT_GREY;
  panLeft = AppConstants.COLORS.LIGHT_GREY;
  panRight = AppConstants.COLORS.LIGHT_GREY;
  panArrow = AppConstants.COLORS.BLACK;
  panFill = AppConstants.COLORS.WHITE;
  panCir = AppConstants.COLORS.NERO;
  homeArrow = AppConstants.COLORS.BLACK;
  @Input() isPanTiltDisabled: boolean;
  cancelUpdate = new Subject();
  intervalUpdateObs = interval(CameraViewConstant.UPDATE_INTERVAL).pipe(takeUntil(this.cancelUpdate));
  constructor(private deviceManagerService: DeviceDataManagerService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.isPanTiltDisabled) {
      this.tiltDown = AppConstants.COLORS.VERY_LIGHT_GREY;
      this.tiltUp = AppConstants.COLORS.VERY_LIGHT_GREY;
      this.panLeft = AppConstants.COLORS.VERY_LIGHT_GREY;
      this.panRight = AppConstants.COLORS.VERY_LIGHT_GREY;
      this.panArrow = AppConstants.COLORS.BROWNISH_GREY;
    } else {
      this.tiltDown = AppConstants.COLORS.LIGHT_GREY;
      this.tiltUp = AppConstants.COLORS.LIGHT_GREY;
      this.panLeft = AppConstants.COLORS.LIGHT_GREY;
      this.panRight = AppConstants.COLORS.LIGHT_GREY;
      this.panArrow = AppConstants.COLORS.BLACK;
    }
  }

  ngOnDestroy() {
    this.cancelUpdate.next();
    this.cancelUpdate.complete();
  }

  public onControlPadClick(elementRef, event: MouseEvent) {
    /*Detect mouse left click*/
    if (event.button === CameraViewConstant.MOUSE_LEFT_BUTTON) {
      if (elementRef === CameraViewConstant.TEXT.CAMERA_PAN_TILT_HOME_AREA_ID || !this.isPanTiltDisabled) {
        this[elementRef] = AppConstants.COLORS.DARK_GREY;
      }
      switch (elementRef) {
        case CameraViewConstant.TEXT.CAMERA_PAN_TILT_HOME_AREA_ID:
          this.deviceManagerService.sendToDevice(this.updateAction, {
            [CameraViewConstant.UUID.ACTIVE_PRESET_UUID]: AppConstants.PRESET_HOME_VALUE,
          });
          this.deviceManagerService.sendToDevice(this.performAction, {
            [CameraViewConstant.UUID.APPLY_ACTIVE_PRESET_UUID]: '',
          });
          break;
        case CameraViewConstant.TEXT.CAMERA_PAN_RIGHT_AREA_ID:
          this.handlePanTiltUpdate(CameraViewConstant.UUID.CAMERA_PAN_RIGHT_UUID);
          break;
        case CameraViewConstant.TEXT.CAMERA_TILT_DOWN_AREA_ID:
          this.handlePanTiltUpdate(CameraViewConstant.UUID.CAMERA_TILT_DOWN_UUID);
          break;
        case CameraViewConstant.TEXT.CAMERA_PAN_LEFT_AREA_ID:
          this.handlePanTiltUpdate(CameraViewConstant.UUID.CAMERA_PAN_LEFT_UUID);
          break;
        case CameraViewConstant.TEXT.CAMERA_TILT_UP_AREA_ID:
          this.handlePanTiltUpdate(CameraViewConstant.UUID.CAMERA_TILT_UP_UUID);
          break;
        default:
      }
    }
  }

  public onContolPadClickReleased(presetId) {
    this.cancelUpdate.next();
    if (presetId === CameraViewConstant.TEXT.CAMERA_PAN_TILT_HOME_AREA_ID || !this.isPanTiltDisabled) {
      this[presetId] = AppConstants.COLORS.MEDIUM_LIGHT_GREY;
    }
  }

  public onOverContolPad(elementRef) {
    if (elementRef === CameraViewConstant.TEXT.CAMERA_PAN_TILT_HOME_AREA_ID || !this.isPanTiltDisabled) {
      this[elementRef] = AppConstants.COLORS.MEDIUM_LIGHT_GREY;
    }
  }

  public onOutControlPad(elementRef) {
    this.cancelUpdate.next();
    if (elementRef === CameraViewConstant.TEXT.CAMERA_PAN_TILT_HOME_AREA_ID || !this.isPanTiltDisabled) {
      this[elementRef] = AppConstants.COLORS.LIGHT_GREY;
    }
  }

  handlePanTiltUpdate(uuid) {
    this.sendUpdate(uuid);
    this.intervalUpdateObs.subscribe(() => {
      this.sendUpdate(uuid);
    });
  }

  sendUpdate(uuid) {
    if (!this.isPanTiltDisabled) {
      this.deviceManagerService.sendToDevice(this.performAction, {
        [uuid]: '',
      });
    }
  }
}
