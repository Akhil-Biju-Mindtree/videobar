import { Component, OnInit, NgZone, OnDestroy, AfterContentInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SnmpSettings } from '../network.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedConstants } from '@shared/shared.constants';
@Component({
  selector: 'app-snmp',
  templateUrl: './snmp.component.html',
  styleUrls: ['./snmp.component.scss'],
})
export class SnmpComponent implements OnInit, AfterContentInit, OnDestroy {
  snmpForm: FormGroup = new FormGroup({});
  authenticationType = SnmpSettings.AUTHENTICATION_TYPES;
  encryptionType = SnmpSettings.ENCRYPTION_TYPES;
  snmpSettingUuid = SnmpSettings.LABEL_UUID;
  initialSnmpSettings = {};
  unSubscribe = new Subject<void>();
  isPasswordShown = false;
  isPrivacyPassphraseShown = false;
  passwordValue: string;
  privacyPassphase: string;
  containerWidthStyle;
  constructor(private deviceManagerService: DeviceDataManagerService, private zone: NgZone) {}

  ngOnInit() {
    this.containerWidthStyle = {
      width: SharedConstants.INPUT.WIDTH.LARGE,
    };
  }

  ngAfterContentInit() {
    this.initializeSnmpFormFields();
  }

  initializeSnmpFormFields() {
    this.snmpSettingUuid.forEach((setting: any, index: number) => {
      this.deviceManagerService
        .listenFromDevice(setting.uuid)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((deviceSettingValues: string) => {
          this.zone.run(() => {
            this.snmpFormInitandUpdateValidity(setting, deviceSettingValues);
          });
        });
    });
  }

  snmpFormInitandUpdateValidity(setting, deviceSettingValues) {
    setTimeout(() => {
      if (!this.snmpForm.dirty || this.snmpForm.get(setting.uuid).pristine || this.isValueChange()) {
        setting.value = deviceSettingValues;
        if (setting.label === this.snmpSettingUuid[2].label) {
          this.passwordValue = deviceSettingValues;
        } else if (setting.label === this.snmpSettingUuid[4].label) {
          this.privacyPassphase = deviceSettingValues;
        }
        this.checkAndUpdateValidity(setting.label);
      }
      this.initialSnmpSettings = { ...this.initialSnmpSettings, [setting.uuid]: deviceSettingValues };
    });
  }

  checkAndUpdateValidity(label) {
    if (this.snmpSettingUuid[0].label === label) {
      this.updateAuthenticationDependentFields(this.snmpSettingUuid[0].value !== 'none');
    } else if (this.snmpSettingUuid[3].label === label) {
      this.updateEncryptionDependentFields(this.snmpSettingUuid[3].value !== 'none');
    }
  }

  updateAuthenticationDependentFields(isRequired: boolean) {
    this.snmpSettingUuid[1].isRequired = isRequired;
    this.snmpSettingUuid[2].isRequired = isRequired;
    this.snmpSettingUuid[1].value = this.snmpForm.get(this.snmpSettingUuid[1].uuid).value;
    this.passwordValue = this.snmpForm.get(this.snmpSettingUuid[2].uuid).value;
    if (isRequired) {
      this.snmpForm.get(this.snmpSettingUuid[1].uuid).setValidators(Validators.required);
      this.snmpForm.get(this.snmpSettingUuid[1].uuid).updateValueAndValidity();
      this.snmpForm.get(this.snmpSettingUuid[2].uuid).setValidators(Validators.required);
      this.snmpForm.get(this.snmpSettingUuid[2].uuid).updateValueAndValidity();
    } else {
      this.snmpForm.get(this.snmpSettingUuid[1].uuid).clearValidators();
      this.snmpForm.get(this.snmpSettingUuid[1].uuid).updateValueAndValidity();
      this.snmpForm.get(this.snmpSettingUuid[2].uuid).clearValidators();
      this.snmpForm.get(this.snmpSettingUuid[2].uuid).updateValueAndValidity();
    }
  }

  updateEncryptionDependentFields(isRequired: boolean) {
    this.snmpSettingUuid[4].isRequired = isRequired;
    this.privacyPassphase = this.snmpForm.get(this.snmpSettingUuid[4].uuid).value;
    this.snmpSettingUuid[5].value = this.snmpForm.get(this.snmpSettingUuid[5].uuid).value;
    if (isRequired) {
      this.snmpForm.get(this.snmpSettingUuid[4].uuid).setValidators(Validators.required);
      this.snmpForm.get(this.snmpSettingUuid[4].uuid).updateValueAndValidity();
    } else {
      this.snmpForm.get(this.snmpSettingUuid[4].uuid).clearValidators();
      this.snmpForm.get(this.snmpSettingUuid[4].uuid).updateValueAndValidity();
    }
  }

  onDropdownReceive(event, i) {
    this.snmpSettingUuid[i].value = event.value;
    this.checkAndUpdateValidity(this.snmpSettingUuid[i].label);
  }

  resetSnmp() {
    this.snmpForm.markAsPristine();
    this.snmpForm.markAsUntouched();
    this.initializeSnmpFormFields();
  }

  applySnmp() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, this.snmpForm.value);
    this.snmpForm.markAsPristine();
    this.snmpForm.markAsUntouched();
  }

  onCheckShowPassword() {
    this.zone.run(() => {
      this.passwordValue = this.snmpForm.get(this.snmpSettingUuid[2].uuid).value;
      this.isPasswordShown = !this.isPasswordShown;
    });
  }

  onCheckShowPrivacyPassphrase() {
    this.zone.run(() => {
      this.privacyPassphase = this.snmpForm.get(this.snmpSettingUuid[4].uuid).value;
      this.isPrivacyPassphraseShown = !this.isPrivacyPassphraseShown;
    });
  }

  isValueChange() {
    let returnValue = true;
    for (const [uuid, value] of Object.entries(this.initialSnmpSettings)) {
      if (value !== this.snmpForm.get(uuid).value) {
        returnValue = false;
      }
    }
    return returnValue;
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
