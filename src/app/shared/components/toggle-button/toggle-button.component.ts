import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstants } from '@core/constants/app.constant';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() uuid: string;
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() toggledValue: boolean;
  @Output() toggle = new EventEmitter<boolean>();
  unSubscribe: Subject<void> = new Subject();
  constructor(private deviceManagerService: DeviceDataManagerService, private zone: NgZone) {}

  ngOnInit() {
    if (this.uuid) {
      this.deviceManagerService
        .listenFromDevice(this.uuid)
        .pipe(
          takeUntil(this.unSubscribe),
          map(value => value !== AppConstants.StateOff),
        )
        .subscribe((value: boolean) => {
          setTimeout(() => {
            this.toggle.emit(value);
          });
          this.zone.run(() => {
            this.toggledValue = value;
          });
        });
    }
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange['disabled'] && this.disabled && this.toggledValue) {
      this.toggledValue = !this.toggledValue;
      this.toggle.emit(this.toggledValue);
      if (!this.toggledValue) {
        this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
          [this.uuid]: AppConstants.StateOff,
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  displayToggleState(value: boolean) {
    return value ? AppConstants.ENABLED : AppConstants.DISABLED;
  }

  toggleState(event) {
    event.source.checked = this.toggledValue;
    if (this.uuid) {
      this.toggledValue = !this.toggledValue;
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [this.uuid]: this.toggledValue ? AppConstants.StateOn : AppConstants.StateOff,
      });
      this.toggle.emit(this.toggledValue);
    } else {
      this.toggle.emit(!this.toggledValue);
    }
  }
}
