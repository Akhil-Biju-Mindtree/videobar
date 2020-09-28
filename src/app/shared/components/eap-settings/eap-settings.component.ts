import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnDestroy,
  NgZone,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  WIRELESS_EAP_PASSWORD_ITEMS,
  EAM_METHOD_LIST,
  PHASE_AUTHENTICATION_LIST,
  CA_CERTIFICATE_LIST,
} from 'app/network/network.constant';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-eap-settings',
  templateUrl: './eap-settings.component.html',
  styleUrls: ['./eap-settings.component.scss'],
})
export class EapSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  isPasswordShown = false;
  eapSettings = WIRELESS_EAP_PASSWORD_ITEMS;
  eapMethodList = EAM_METHOD_LIST;
  eapPhaseAuthenticationList = PHASE_AUTHENTICATION_LIST;
  eapCertificateList = CA_CERTIFICATE_LIST;
  @Input() isWireless = false;
  @Input() parentForm: FormGroup;
  @Output() eapInitialSettingsEmitter = new EventEmitter();
  passwordValue: string;
  containerWidthStyle = {};
  unSubscribe: Subject<void> = new Subject();

  constructor(private deviceManagerService: DeviceDataManagerService, private ngZone: NgZone) { }

  ngOnInit() {
    this.containerWidthStyle = {
      width: SharedConstants.INPUT.WIDTH.LARGE,
    };
  }

  ngAfterViewInit() {
    if (this.isWireless) {
      this.initializeEAPFields();
    }
  }

  initializeEAPFields() {
    const initialEapForm = [];
    this.eapSettings.forEach((setting: any) => {
      this.deviceManagerService
        .listenFromDevice(setting.uuid)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((settingValue: any) => {
          this.ngZone.run(() => {
            initialEapForm.push({ uuid: setting.uuid, value: settingValue });
            this.parentForm.get(setting.uuid).setValue(settingValue);
          });
        });
    });
    this.eapInitialSettingsEmitter.emit(initialEapForm);
  }

  onCheckShowPassword() {
    this.ngZone.run(() => {
      this.passwordValue = this.parentForm.get(this.eapSettings[5].uuid).value;
      if (this.passwordValue !== '') {
        this.parentForm.markAsTouched();
        this.parentForm.markAsDirty();
      }
      this.isPasswordShown = !this.isPasswordShown;
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
