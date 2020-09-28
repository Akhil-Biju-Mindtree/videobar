import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { DialogComponent } from '../../dialog.component';
import { WIRELESS_EAP_PASSWORD_ITEMS, NetworkConstant } from 'app/network/network.constant';
import { AppConstants } from '@core/constants/app.constant';
import { FormGroup } from '@angular/forms';
import { NetworkService } from 'app/network/network.service';

@Component({
  selector: 'app-wireless-eap-password',
  templateUrl: './wireless-eap-password.component.html',
  styleUrls: ['./wireless-eap-password.component.scss'],
})
export class WirelessEapPasswordComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({});
  eapSettings = WIRELESS_EAP_PASSWORD_ITEMS;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    private deviceManagerService: DeviceDataManagerService,
    private networkService: NetworkService,
  ) {}

  ngOnInit() {}

  onSubmitDialog() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SSID]: this.data.value.name,
    });

    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SECURITY]: 'eap',
    });

    this.eapSettings.forEach((eapsetting: any) => {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [eapsetting.uuid]: this.formGroup.get(eapsetting.uuid).value,
      });
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
