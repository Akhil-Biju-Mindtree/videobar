import {
  Component,
  OnInit,
  Inject,
  Input,
  NgZone,
  OnChanges,
} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DialogComponent } from '../../dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstants } from '@core/constants/app.constant';
import { NetworkConstant } from 'app/network/network.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { INPUT_ERRORS } from '@core/error/error.constants';
import { NetworkService } from 'app/network/network.service';

@Component({
  selector: 'app-wireless-password',
  templateUrl: './wireless-password.component.html',
  styleUrls: ['./wireless-password.component.scss'],
})
export class WirelessPasswordComponent implements OnInit, OnChanges {
  inputType = 'password';
  formControl = new FormControl();
  defaultErrorMessage = INPUT_ERRORS.INVALID_VALUE_ERROR;

  passwordUuid = NetworkConstant.UUID.WIFI.WIFI_PASSWORD;
  minLength;
  maxLength;

  @Input() securityType: string;
  @Input() formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private networkService: NetworkService,
  ) {}

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = new FormGroup({});
      this.initFormField();
    }
  }

  initFormField() {
    this.minLength =
      (this.securityType ? this.securityType : this.securityCategorizing(this.data.value.securityType)) === 'wep'
        ? 1
        : 8;
    this.maxLength =
      (this.securityType ? this.securityType : this.securityCategorizing(this.data.value.securityType)) === 'wep'
        ? 20
        : 64;
    const validatorsGroup = [];
    validatorsGroup.push(Validators.required);
    validatorsGroup.push(Validators.minLength(this.minLength));
    validatorsGroup.push(Validators.maxLength(this.maxLength));
    this.formControl.setValidators(validatorsGroup);
    this.formGroup.addControl(this.passwordUuid, this.formControl);
    this.formGroup.controls[this.passwordUuid].reset();
  }

  ngOnChanges() {
    if (this.securityType) {
      this.ngZone.run(() => {
        this.initFormField();
        this.formGroup.updateValueAndValidity();
      });
    }
    this.formGroup.updateValueAndValidity();
  }

  isInValid() {
    return this.formControl.invalid && this.formControl.dirty && this.formControl.touched;
  }

  onCheckShowPassword() {
    this.ngZone.run(() => {
      this.inputType = this.inputType === 'password' ? 'text' : 'password';
    });
  }

  securityCategorizing(networkItem) {
    if (networkItem.includes(NetworkConstant.TEXT.PSK)) {
      return 'psk';
    }
    return 'wep';
  }

  onSubmitDialog() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SSID]: this.data.value.name,
    });

    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SECURITY]: this.securityCategorizing(this.data.value.securityType),
    });

    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_PASSWORD]: this.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_PASSWORD).value,
    });
    this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
      [NetworkConstant.UUID.WIFI.WIFI_JOIN]: '',
    });

    this.networkService.setIsJoinToNetworkClicked(true);
    this.dialogRef.close();
  }

  onCloseDialog() {
    this.networkService.setIsClosedClicked(true);
    this.dialogRef.close();
  }
}
