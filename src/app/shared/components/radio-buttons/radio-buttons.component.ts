import { Component, OnInit, OnDestroy, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
})
export class RadioButtonsComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  @Input() uuid: string;
  @Input() allValues: { text: string; value: string; abandonEmit?: boolean }[];
  @Input() disable: boolean;
  @Input() radioButtonLayout: string;
  @Input() isLabelBold: boolean;
  @Output() valueChecked = new EventEmitter();
  valueSelected: string;

  constructor(private deviceManagerService: DeviceDataManagerService, private zone: NgZone) {}

  ngOnInit() {
    this.onInitListenForNotification();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onInitListenForNotification() {
    this.deviceManagerService
      .listenFromDevice(this.uuid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((stateSelected: string) => {
        this.zone.run(() => {
          this.valueSelected = stateSelected;
        });
      });
  }

  onChange(change: MatRadioChange, abandonEmit: boolean) {
    this.valueChecked.emit(change.value);
    if (abandonEmit) {
      return;
    }
    // undefined -> isEmitted was optional property parent compo has not defined it, true -> Parent component wants to emit data to device
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.uuid]: change.value,
    });
  }
}
