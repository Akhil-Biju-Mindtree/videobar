import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  SECURITY_LIST,
  OTHER_NETWORK,
  NetworkConstant,
  WIRELESS_EAP_PASSWORD_ITEMS,
} from 'app/network/network.constant';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { DialogComponent } from '../../dialog.component';
import { AppConstants } from '@core/constants/app.constant';
import { NetworkService } from 'app/network/network.service';

@Component({
  selector: 'app-wireless-other-network',
  templateUrl: './wireless-other-network.component.html',
  styleUrls: ['./wireless-other-network.component.scss'],
})
export class WirelessOtherNetworkComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({});
  security = SECURITY_LIST;
  otherNetwork = OTHER_NETWORK;
  eapSettings = WIRELESS_EAP_PASSWORD_ITEMS;
  securityType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private networkService: NetworkService,
  ) {}

  ngOnInit() {
    this.initSecurityDropdown();
  }

  initSecurityDropdown() {
    this.formGroup.addControl(this.otherNetwork[1].uuid, new FormControl('none', Validators.required));
    this.otherNetwork[1].labelValue = 'None';
  }

  onSecurityType(event, uuid) {
    this.ngZone.run(() => {
      this.securityType = event.value;
    });
    this.formGroup.get(uuid).setValue(event.value);
    this.removeControls();
  }

  removeControls() {
    this.eapSettings.forEach((setting: any) => {
      if (this.formGroup.get(setting.uuid)) {
        this.formGroup.removeControl(setting.uuid);
      }
    });
  }

  onSubmitDialog() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SSID]: this.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_SSID).value,
    });

    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SECURITY]: this.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_SECURITY).value,
    });
    if (
      this.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_SECURITY).value === 'psk' ||
      this.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_SECURITY).value === 'wep'
    ) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [NetworkConstant.UUID.WIFI.WIFI_PASSWORD]: this.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_PASSWORD).value,
      });
    } else if (this.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_SECURITY).value === 'eap') {
      this.eapSettings.forEach((eapsetting: any) => {
        this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
          [eapsetting.uuid]: this.formGroup.get(eapsetting.uuid).value,
        });
      });
    }

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
