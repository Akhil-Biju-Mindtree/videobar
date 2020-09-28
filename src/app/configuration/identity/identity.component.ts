import { Component, OnInit, OnDestroy, NgZone, ElementRef } from '@angular/core';
import { IDENTITY_FIELDS } from './identity.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent implements OnInit, OnDestroy {
  deviceIdentityFields = IDENTITY_FIELDS;
  unSubscribe = new Subject<void>();

  constructor(private deviceManagerService: DeviceDataManagerService, private zone: NgZone, private element: ElementRef) {}

  ngOnInit() {
    this.initializeFields();
  }

  initializeFields() {
    this.deviceIdentityFields.forEach((field: any) => {
      this.deviceManagerService
        .listenFromDevice(field.uuid)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((value: string) => {
          this.zone.run(() => {
            field.value = value;
          });
        });
    });
  }

  updateValue(value: string, uuid: string, index: number) {
    if (this.deviceIdentityFields[index].value !== value) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [uuid]: value,
      });
    }
  }

  handleKeyDown(event: KeyboardEvent, uuid: string, index: number) {
    if (event.key === CONFIGURATION_CONSTANTS.KEY.ENTER || event.key === CONFIGURATION_CONSTANTS.KEY.TAB) {
      event.preventDefault();
      this.focusNextTabable(event);
    }
  }

  focusNextTabable(event) {
    let currentIndex = +event.target.closest('.text-field').id;
    if (event.shiftKey) {
      currentIndex = currentIndex - 1;
      currentIndex = currentIndex === -1 ? this.deviceIdentityFields.length - 1 : currentIndex;
    } else {
      currentIndex = currentIndex + 1;
      currentIndex = currentIndex === this.deviceIdentityFields.length ? 0 : currentIndex;
    }
    const focusElement = this.element.nativeElement.querySelector(`.text-field[id='${currentIndex}'] input`);
    focusElement.focus();
    focusElement.select();
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
