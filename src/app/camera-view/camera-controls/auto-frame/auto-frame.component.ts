import { Component, OnInit, NgZone, OnDestroy, Input } from '@angular/core';
import { CameraViewConstant } from 'app/camera-view/camera-view.constant';
import { AppConstants } from '@core/constants/app.constant';
import { FabMiniModel } from '@shared/models/fab.model';
import { AutoFrameConstant } from './auto-frame.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-auto-frame',
  templateUrl: './auto-frame.component.html',
  styleUrls: ['./auto-frame.component.scss'],
})
export class AutoFrameComponent implements OnInit, OnDestroy {
  toolTipDelay: number;
  fabMiniStyles: FabMiniModel;
  elementID: string;
  toolTipText: { onText: string; offText: string };
  isDisabled: boolean;
  unsubscribe = new Subject<void>();
  @Input() disableTooltip;

  constructor(private deviceManagerService: DeviceDataManagerService, private ngZone: NgZone) {}

  ngOnInit() {
    this.onInitListenForNotification();
    this.elementID = CameraViewConstant.UUID.AUTOFRAMING_STATE_UUID;
    this.toolTipDelay = AppConstants.ToolTipDelay;
    this.fabMiniStyles = new FabMiniModel(
      AutoFrameConstant.autoframeOnStyles,
      AutoFrameConstant.autoframeOffStyles,
      AutoFrameConstant.autoframeDirectvieStyles,
      AutoFrameConstant.autoframeDisabledStyles,
    );
    this.toolTipText = {
      onText: CameraViewConstant.TEXT.AUTOFRAME_TOOLTIP_TEXT_ON,
      offText: CameraViewConstant.TEXT.AUTOFRAME_TOOLTIP_TEXT_OFF,
    };
  }

  onInitListenForNotification() {
    this.deviceManagerService
      .listenFromDevice(CameraViewConstant.UUID.AUTOFRAME_ENABLED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((autoframeEnabled: string) => {
        this.ngZone.run(() => {
          if (autoframeEnabled === AppConstants.StateOn) {
            this.isDisabled = false;
          } else {
            this.isDisabled = true;
          }
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
