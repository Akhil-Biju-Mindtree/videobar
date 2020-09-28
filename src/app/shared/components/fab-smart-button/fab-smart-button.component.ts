import { Component, OnInit, Input, NgZone, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { FabMiniModel } from '@shared/models/fab.model';

@Component({
  selector: 'app-fab-smart-button',
  templateUrl: './fab-smart-button.component.html',
  styleUrls: ['./fab-smart-button.component.scss'],
})
export class FabSmartButtonComponent implements OnInit, OnDestroy {
  @Input() elementID: string;
  @Input() fabMiniStyles: FabMiniModel;
  @Input() toolTipText?: { onText: string; offText: string };
  @Input() toolTipDelay?: number;
  @Input() toolTipClass?: string;
  @Input() isDisabled;
  @Input() callParentMethod;
  @Input() disableTooltip;

  @Output() clickEmitter = new EventEmitter<boolean>();

  isButtonOn: boolean;
  notification$: Subscription;
  hideToolTip = false;

  constructor(private deviceManagerService: DeviceDataManagerService, private ngZone: NgZone) {}

  ngOnInit() {
    // Hide ToolTip if calle component pass toolTipText=undefined (doesn't pass value)
    if (!this.toolTipText) {
      this.hideToolTip = true;
    }
    this.onInitListenForNotification();
  }

  onInitListenForNotification() {
    // Default FabButton is On State
    this.isButtonOn = true;
    if (this.elementID) {
      this.notification$ = this.deviceManagerService.listenFromDevice(this.elementID).subscribe((notification: {}) => {
        if (notification) {
          this.ngZone.run(() => this.updateUIOnChangeOfState(notification));
        }
      });
    }
  }

  updateUIOnChangeOfState(notification) {
    notification === AppConstants.StateOn ? (this.isButtonOn = true) : (this.isButtonOn = false);
    if (!this.callParentMethod) {
      this.clickEmitter.emit(this.isButtonOn);
    }
  }

  onButtonClick() {
    this.isButtonOn = !this.isButtonOn;
    // Giving the state of button (on/off) to Parent compone
    this.clickEmitter.emit(this.isButtonOn);
    if (!this.callParentMethod && this.elementID) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [this.elementID]: this.isButtonOn ? AppConstants.StateOn : AppConstants.StateOff,
      });
    }
  }

  ngOnDestroy() {
    if (this.notification$) {
      this.notification$.unsubscribe();
    }
  }
}
