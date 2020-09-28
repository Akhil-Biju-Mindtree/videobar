import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import {
  VIDEO_CONTROLS_CAMERA,
  VIDEO_CONTROLS_AUTO_FRAME,
  AUDIO_CONTROLS,
  NETWORK_CONTROLS,
  BLUETOOTH_CONTROLS,
} from './user-access.constant';
import { AppConfig } from '@environment/environment';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { NetworkConstant } from 'app/network/network.constant';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { AppConstants } from '@core/constants/app.constant';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { VideoConstant } from 'app/video/video.constant';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
})
export class UserAccessComponent implements OnInit, OnDestroy {
  videoControlsCamera = VIDEO_CONTROLS_CAMERA;
  videoControlAutoFrame = VIDEO_CONTROLS_AUTO_FRAME;
  audioControls = AUDIO_CONTROLS;
  networkControls = NETWORK_CONTROLS;
  blutoothControls = BLUETOOTH_CONTROLS;
  disableAutoFrame = false;
  unSubscribe: Subject<void> = new Subject();
  isDesktopApp = AppConfig.isDesktopApp;
  prevAF = null;

  constructor(
    private ngZone: NgZone,
    private deviceManagerService: DeviceDataManagerService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit() {
    if (!AppConfig.isDesktopApp) {
      this.initNetworkControlsForWeb();
    }
  }

  initNetworkControlsForWeb() {
    this.networkControls.forEach((controls: any) => {
      controls['toggled'] = true;
      this.deviceManagerService
        .listenFromDevice(controls.uuid)
        .pipe(
          takeUntil(this.unSubscribe),
          map((value: any) => value !== AppConstants.StateOff),
        )
        .subscribe((value: boolean) => {
          this.ngZone.run(() => {
            controls.toggled = value;
          });
        });
    });
  }

  /**
   * Toggle AutoFrame on/off based on the current AF access
   * @param checked - Current AutoFrame access value
   */
  toggleAF(checked) {
    if (!checked && this.prevAF) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [VideoConstant.UUID.AUTOFRAMING_STATE_UUID]: AppConstants.StateOff,
      });
    }
    this.prevAF = checked;
  }

  togglechange(checked) {
    this.ngZone.run(() => (this.disableAutoFrame = !checked));
  }

  onToggle(event, control) {
    if (!AppConfig.isDesktopApp && !event) {
      this.showDialog().then((result: boolean) => {
        if (result) {
          this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
            [control.uuid]: AppConstants.StateOff,
          });
          control.toggled = event;
        } else {
          control.toggled = !event;
        }
      });
    } else if (!AppConfig.isDesktopApp) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [control.uuid]: event ? AppConstants.StateOn : AppConstants.StateOff,
      });
    }
  }

  showDialog() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_DIALOG_HEADER;
    confirmationDialogModel.content = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_CONTENT;
    confirmationDialogModel.confirmButtonLabel = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_CONFIRM_TEXT;
    return this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel);
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
