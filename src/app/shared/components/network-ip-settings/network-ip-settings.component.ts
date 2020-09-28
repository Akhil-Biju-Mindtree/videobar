import { Component, OnInit, Input, EventEmitter, Output, NgZone, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppConstants } from '@core/constants/app.constant';
import { takeUntil, map } from 'rxjs/operators';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { INPUT_ERRORS } from '@core/error/error.constants';
import { Logger } from '@core/logger/Logger';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { NetworkConstant, WIRELESS_EAP_PASSWORD_ITEMS } from 'app/network/network.constant';
import { AppConfig } from '@environment/environment';

@Component({
  selector: 'app-network-ip-settings',
  templateUrl: './network-ip-settings.component.html',
  styleUrls: ['./network-ip-settings.component.scss'],
})
export class NetworkIpSettingsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isWireless: boolean;
  @Input() ipConfigurationValues: { text: string; value: string; abandonEmit?: boolean }[];
  @Input() ipStatic: { label: string; uuid: string; isRequired: boolean; value: string }[] = [];
  @Input() ipSettingUUID;
  @Input() status;

  parentForm: FormGroup = new FormGroup({});
  isDHCPEnabled: boolean;
  isDeviceHasDHPCSetting: boolean;
  unSubscribe: Subject<void> = new Subject();

  ipAddressDHCP: string;
  subnetMaskDHCP: string;
  defaultGatewayDHCP: string;
  primaryDNSDHCP: string;
  secondaryDNSDHCP: string;

  macAddress: string;
  securityType: string;
  connectedDeviceName: string;
  eapInitialSettings;
  eapSettings = WIRELESS_EAP_PASSWORD_ITEMS;
  errorMessage = INPUT_ERRORS.INVALID_FORMAT_ERROR;
  connectingString = AppConstants.CONNECTION_STATE.CONNECTING;
  connectedString = AppConstants.CONNECTION_STATE.CONNECTED;

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private logger: Logger,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit() {
    this.initializeDHCP();
    this.checkJoinedNetworkIsEap();
  }

  onIPConfigChecked(event) {
    if (event === AppConstants.StateOn) {
      this.isDHCPEnabled = true;
      this.removeDHCPControls();
      if (this.isDHCPEnabled !== this.isDeviceHasDHPCSetting) {
        this.callJoinForWireless();
      }
    } else {
      this.isDHCPEnabled = false;
      this.parentForm.markAsPristine();
      this.parentForm.markAsUntouched();
    }
  }
  removeDHCPControls() {
    if (this.parentForm.get(this.ipSettingUUID.STATIC.IP_ADDRESS)) {
      this.parentForm.removeControl(this.ipSettingUUID.STATIC.IP_ADDRESS);
      this.parentForm.removeControl(this.ipSettingUUID.STATIC.SUBNET_MASK);
      this.parentForm.removeControl(this.ipSettingUUID.STATIC.DEFAULT_GATEWAY);
      this.parentForm.removeControl(this.ipSettingUUID.STATIC.PRIMARY_DNS);
      this.parentForm.removeControl(this.ipSettingUUID.STATIC.SECONDARY_DNS);
    }
  }

  initializeDHCP() {
    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.IP_CONFIGURATION)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((isDHCPEnabled: string) => {
        this.ngZone.run(() => {
          this.isDeviceHasDHPCSetting = (this.isDHCPEnabled = isDHCPEnabled === AppConstants.StateOn);
        });
      });

    // !Listening for DHCP Settings

    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.DHCP.IP_ADDRESS)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((ipAddressDHCP: string) => {
        this.ngZone.run(() => {
          this.logger.info(`DHCP IP Address ${ipAddressDHCP}`);
          this.ipAddressDHCP = ipAddressDHCP;
        });
      });
    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.DHCP.SUBNET_MASK)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((subnetMaskDHCP: string) => {
        this.ngZone.run(() => {
          this.subnetMaskDHCP = subnetMaskDHCP;
        });
      });
    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.DHCP.DEFAULT_GATEWAY)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((defaultGatewayDHCP: string) => {
        this.ngZone.run(() => {
          this.defaultGatewayDHCP = defaultGatewayDHCP;
        });
      });
    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.DHCP.PRIMARY_DNS)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((primaryDNSDHCP: string) => {
        this.ngZone.run(() => {
          this.primaryDNSDHCP = primaryDNSDHCP;
        });
      });
    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.DHCP.SECONDARY_DNS)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((secondaryDNSDHCP: string) => {
        this.ngZone.run(() => {
          this.secondaryDNSDHCP = secondaryDNSDHCP;
        });
      });

    // !Listening for Static Settings

    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.STATIC.IP_ADDRESS)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((staticIpAddress: string) => {
        this.ngZone.run(() => {
          this.updateStaticIpList(staticIpAddress, this.ipSettingUUID.STATIC.IP_ADDRESS);
        });
      });

    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.STATIC.SUBNET_MASK)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((staticSubnetMask: string) => {
        this.ngZone.run(() => {
          this.updateStaticIpList(staticSubnetMask, this.ipSettingUUID.STATIC.SUBNET_MASK);
        });
      });

    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.STATIC.DEFAULT_GATEWAY)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((staticDefaultGateway: string) => {
        this.ngZone.run(() => {
          this.updateStaticIpList(staticDefaultGateway, this.ipSettingUUID.STATIC.DEFAULT_GATEWAY);
        });
      });

    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.STATIC.PRIMARY_DNS)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((staticPrimaryDns: string) => {
        this.ngZone.run(() => {
          this.updateStaticIpList(staticPrimaryDns, this.ipSettingUUID.STATIC.PRIMARY_DNS);
        });
      });

    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.STATIC.SECONDARY_DNS)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((staticSecondaryDns: string) => {
        this.ngZone.run(() => {
          this.updateStaticIpList(staticSecondaryDns, this.ipSettingUUID.STATIC.SECONDARY_DNS);
        });
      });

    // !Listening for Mac Address

    this.deviceManagerService
      .listenFromDevice(this.ipSettingUUID.MAC_ADDRESS)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((macAddress: string) => {
        this.ngZone.run(() => {
          this.macAddress = macAddress;
        });
      });
  }

  checkJoinedNetworkIsEap() {
    this.deviceManagerService
      .listenFromDevice(NetworkConstant.UUID.WIFI.WIFI_SECURITY)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((securityType: string) => {
        this.ngZone.run(() => {
          this.securityType = securityType;
        });
      });
  }

  private updateStaticIpList(value: string, elementId) {
    const index = this.findIndexOfStaticIp(elementId);
    const requiredValue = value === AppConstants.DEFAULT_IP ? '' : value;
    this.ipStatic[index] = {
      ...this.findStaticIp(elementId),
      value: requiredValue,
    };
  }

  findStaticIp(elementId) {
    return this.ipStatic.find((ipStaticValue: any) => ipStaticValue.uuid === elementId);
  }

  findIndexOfStaticIp(elementId) {
    return this.ipStatic.findIndex((ipStaticValue: any) => ipStaticValue.uuid === elementId);
  }

  onValueChange(event: string, uuid: string) {
    this.parentForm.get(uuid).setValue(event);
  }

  eapInitialSettingsUpdate(eapSettings) {
    this.eapInitialSettings = eapSettings;
  }

  isFormValueChanged(): boolean {
    let isFormEdited = false;
    if (!this.isDHCPEnabled && this.status && this.status === this.connectedString && !this.parentForm.pristine) {
      this.ipStatic.forEach((staticID: any) => {
        if (this.parentForm.get(staticID.uuid) && staticID.value !== this.parentForm.get(staticID.uuid).value) {
          isFormEdited = true;
        }
      });
    }
    if (this.securityType === 'eap' && this.status && this.status === this.connectedString && !this.parentForm.pristine) {
      this.eapInitialSettings.forEach((eapSettings: any) => {
        if (
          this.parentForm.get(eapSettings.uuid) &&
          eapSettings.value !== this.parentForm.get(eapSettings.uuid).value
        ) {
          isFormEdited = true;
        }
      });
    }
    if (this.parentForm.pristine || this.isDeviceHasDHPCSetting !== this.isDHCPEnabled) {
      isFormEdited = true;
    }
    return isFormEdited;
  }

  apply() {
    // ! Save :- STATUS_BEHAVIOR_ETHERNET, IP_CONFIGURATION, STATIC.IP_ADDRESS, STATIC.SUBNET_MASK,
    // ! STATIC.DEFAULT_GATEWAY, STATIC.PRIMARY_DNS, STATIC.SECONDARY_DNS
    let dataToSend;
    dataToSend = this.replaceUndefiniedToString(this.parentForm.value);
    if (this.securityType === 'eap') {
      dataToSend[this.eapSettings[4].uuid] =
        dataToSend[this.eapSettings[4].uuid] === AppConstants.DEFAULT_IP ? '' : dataToSend[this.eapSettings[4].uuid];
    }
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, dataToSend);
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.ipSettingUUID.IP_CONFIGURATION]: '0',
    });
    this.callJoinForWireless();
    this.parentForm.markAsPristine();
    this.parentForm.markAsUntouched();
  }

  replaceUndefiniedToString(item) {
    const str = JSON.stringify(item, (key, value) => {
      return value ? value : AppConstants.DEFAULT_IP;
    });
    return JSON.parse(str);
  }

  confirmChange() {
    if (!AppConfig.isDesktopApp) {
      this.showDialog().then((result: boolean) => {
        if (result) {
          this.apply();
        }
      });
    } else {
      this.apply();
    }
  }

  callJoinForWireless() {
    if (this.isWireless) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
        [NetworkConstant.UUID.WIFI.WIFI_JOIN]: '',
      });
    }
  }

  showDialog() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_DIALOG_HEADER;
    confirmationDialogModel.content = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_CONTENT;
    confirmationDialogModel.confirmButtonLabel = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_CONFIRM_TEXT;
    return this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel);
  }

  ngOnChanges() {
    if (this.status && this.status === this.connectingString) {
      this.removeDHCPControls();
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
