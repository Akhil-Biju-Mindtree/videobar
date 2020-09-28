import { Component, OnInit, OnDestroy, NgZone, AfterViewInit, HostListener } from '@angular/core';
import {
  NetworkConstant,
  IP_CONFIGURATION_ITEMS,
  WIRELESS_IP_STATIC_ITEMS,
} from '../network.constant';
import { Subject } from 'rxjs';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { map, takeUntil, throttleTime } from 'rxjs/operators';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { WirelessPasswordComponent } from '@shared/components/dialog/dialog-content/wireless-password/wireless-password.component';
import { WirelessEapPasswordComponent } from '@shared/components/dialog/dialog-content/wireless-eap-password/wireless-eap-password.component';
import { Logger } from '@core/logger/Logger';
import { WirelessOtherNetworkComponent } from '@shared/components/dialog/dialog-content/wireless-other-network/wireless-other-network.component';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';
import { AppConfig } from '@environment/environment';
import { NetworkService } from '../network.service';
import { UtilitiesService } from '@providers/utilities.service';
import { FormGroup } from '@angular/forms';
import { SecuritiesType, NetworkFound } from '../network-found.model';

@Component({
  selector: 'app-wireless',
  templateUrl: './wireless.component.html',
  styleUrls: ['./wireless.component.scss'],
})
export class WirelessComponent implements OnInit, AfterViewInit, OnDestroy {
  ipConfigurationValues: { text: string; value: string }[];
  isWirelessEnabled: boolean;
  ipStatic: { label: string; uuid: string; isRequired: boolean; value: string }[] = [];
  ipSettingUUID = NetworkConstant.UUID.WIRELESS;

  wifiNameForm: FormGroup = new FormGroup({});
  wifiNameUuid = NetworkConstant.UUID.WIFI.WIFI_SSID;

  ethernetIcon: string;
  unSubscribe: Subject<void> = new Subject();
  dropDownOpenEvent = new Subject();
  dropDownOpenEventSource = this.dropDownOpenEvent.asObservable();

  wirelessStatusUUID = NetworkConstant.UUID.WIFI_STATUS_BEHAVIOR;
  connectionStatusStateUUID = NetworkConstant.UUID.WIFI_STATUS_STATE;
  networkFoundItems: NetworkFound[] = [];
  isWirelessipSettingsEnabled: boolean;
  isAutomaticConnectChecked: boolean;

  connectionStatus: string;
  previousNetworkConnected: string;
  connectedDeviceName: string;
  isWebsocketDisconnected: boolean;
  isJoinToNetworkClicked = false;

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.ngOnDestroy();
  }

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private dialogService: DialogService,
    private loggerService: Logger,
    private applicationDataManagerService: ApplicationDataManagerService,
    private authService: AuthService,
    private router: Router,
    private networkService: NetworkService,
    private utilityService: UtilitiesService,
  ) {}

  ngOnInit() {
    this.isWirelessipSettingsEnabled = false;
    this.ipConfigurationValues = IP_CONFIGURATION_ITEMS;
    this.ipStatic = WIRELESS_IP_STATIC_ITEMS;
    this.ethernetIcon = NetworkConstant.ICON.WIFI;

    this.intialize();
    if (!AppConfig.isDesktopApp) {
      this.applicationDataManagerService
        .listenForAppData(AppConstants.WEBSOCKET_DISCONNECTED)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((value: boolean) => {
          this.isWebsocketDisconnected = value;
          if (value && !this.isWirelessEnabled) {
            this.authService.setAdminAccess(false);
            this.deviceManagerService.sendToDevice(AppConstants.Action.Retrieve, AppConstants.HOME_SCREEN_UUIDS);
            this.router.navigateByUrl('/login');
          }
        });
    }
  }

  ngAfterViewInit() {
    this.listenToNetworkServices();
    if (this.previousNetworkConnected !== '' && this.connectionStatus !== AppConstants.CONNECTION_STATE.DISCONNECTED) {
      this.connectedDeviceName = this.previousNetworkConnected;
    } else {
      this.connectedDeviceName = NetworkConstant.TEXT.DEFAULT_SSID;
    }
    this.wifiNameForm.get(this.wifiNameUuid).setValue(this.connectedDeviceName);
  }

  onToggleWiredStatus(event) {
    this.isWirelessEnabled = event;
  }

  intialize() {
    this.listenOperation();
  }

  isJsonString(networkItems) {
    try {
      JSON.parse(networkItems);
    } catch {
      return false;
    }
    return true;
  }

  addJoinOtherNetworkToDropDown(latestNetworks): NetworkFound[] {
    if (!latestNetworks.length || latestNetworks[latestNetworks.length - 1].name !== 'joinOtherNetwork') {
      latestNetworks.push({
        label: 'Join Other Network',
        address: '',
        signalStrength: 0,
        securityType: '',
        name: 'joinOtherNetwork',
        value: 'joinOtherNetwork',
        securityCategory: 'otherNetwork',
      });
    }
    return latestNetworks;
  }

  listenOperation() {
    this.deviceManagerService
      .listenFromDevice(NetworkConstant.UUID.WIFI.WIFI_SSID)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((previousNetworkConnected: any) => {
        this.ngZone.run(() => {
          this.previousNetworkConnected = previousNetworkConnected;
        });
      });

    this.deviceManagerService
      .listenFromDevice(NetworkConstant.UUID.WIFI.WIFI_NETWORKFOUND)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((networkItems: any) => {
        this.ngZone.run(() => {
          if (this.isJsonString(networkItems) && Object.keys(JSON.parse(networkItems)).length) {
            let network: NetworkFound;
            const latestNetworks: NetworkFound[] = [];
            const networkList = JSON.parse(networkItems);
            for (const key in networkList) {
              if (networkList.hasOwnProperty(key) && this.validateSSIDvalue(key, networkList)) {
                network = this.getNetworkAndProperties(key, networkList);
                latestNetworks.push(network);
              }
            }
            this.sortBasedOnSignalStrength(latestNetworks);
            this.networkFoundItems = latestNetworks;
          }
          this.networkFoundItems = this.addJoinOtherNetworkToDropDown(this.networkFoundItems);
        });
      });

    // Currently auto-connect is not working from EVK Device, required for future
    this.deviceManagerService
      .listenFromDevice(NetworkConstant.UUID.WIFI.WIFI_AUTOCONNECT)
      .pipe(
        takeUntil(this.unSubscribe),
        map((autoConnect: any) => autoConnect !== AppConstants.StateOff),
      )
      .subscribe((isAutoConnectChecked: boolean) => {
        this.ngZone.run(() => {
          this.isAutomaticConnectChecked = isAutoConnectChecked;
        });
      });

    // perform scan on dropdown open and with a throttle time of 10secs
    this.dropDownOpenEventSource.pipe(throttleTime(NetworkConstant.SCAN_INTERVAL)).subscribe(() => {
      this.performScanOperation();
    });
  }

  validateSSIDvalue(key, networkList): boolean {
    return !networkList[key][2].includes(NetworkConstant.ERROR.NAME_FORMAT);
  }

  listenToNetworkServices() {
    this.networkService
      .getIsClosedClicked()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((isClosedClicked: boolean) => {
        if (isClosedClicked) {
          this.networkService.setIsClosedClicked(false);
        } else {
          this.connectedDeviceName =
            this.connectionStatus === AppConstants.CONNECTION_STATE.DISCONNECTED
              ? NetworkConstant.TEXT.DEFAULT_SSID
              : this.previousNetworkConnected;
        }
        this.setConnectedDeviceName();
      });
    this.networkService
      .getIsJoinToNetworkClicked()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((isJoinToNetworkClicked: boolean) => {
        this.isJoinToNetworkClicked = isJoinToNetworkClicked;
        if (isJoinToNetworkClicked) {
          this.connectedDeviceName = this.previousNetworkConnected;
          this.wifiNameForm.get(this.wifiNameUuid).setValue(this.connectedDeviceName);
          const resetNetworkServiceFlags = this.resetNetworkServiceFlags.bind(this);
          this.utilityService.debounce(resetNetworkServiceFlags, NetworkConstant.CONNECTION__BUFFER_TIME);
        } else {
          this.setConnectedDeviceName();
        }
      });
  }

  resetNetworkServiceFlags() {
    this.networkService.setIsJoinToNetworkClicked(false);
    /** Notfy somthing wen wrong if network disconnects after buffer time
    if (this.connectionStatus === AppConstants.CONNECTION_STATE.DISCONNECTED) {
      this.notifySomthingWrongInConnection();
    }
    */
  }

  setConnectedDeviceName() {
    setTimeout(() => {
      this.ngZone.run(() => {
        if (
          this.connectedDeviceName === '' ||
          this.connectedDeviceName === NetworkConstant.TEXT.DEFAULT_SSID ||
          this.connectionStatus === AppConstants.CONNECTION_STATE.DISCONNECTED
        ) {
          this.connectedDeviceName = NetworkConstant.TEXT.DEFAULT_SSID;
        }
        this.wifiNameForm.get(this.wifiNameUuid).setValue(this.connectedDeviceName);
      });
    });
  }

  getNetworkAndProperties(key, networkList) {
    let security;
    if (networkList[key][1]) {
      security = this.securityCategorizing(networkList[key]);
    }

    const network = {
      address: key,
      signalStrength: +networkList[key][0],
      securityType: networkList[key][1],
      name: networkList[key][2],
      value: networkList[key][2],
      label: networkList[key][2],
      securityCategory: security,
    };

    this.transformation(network);
    return network;
  }

  private sortBasedOnSignalStrength(latestNetworks: NetworkFound[]) {
    latestNetworks.sort(
      (firstItem: NetworkFound, secondItem: NetworkFound) => secondItem.signalStrength - firstItem.signalStrength,
    );
  }

  performScanOperation() {
    if (this.isWirelessEnabled) {
      this.deviceManagerService
        .sendToDevice(AppConstants.Action.Perform, {
          [NetworkConstant.UUID.WIFI.WIFI_SCAN]: '',
        })
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((data: any) => {
          if (
            data[NetworkConstant.TEXT.WIFI][NetworkConstant.TEXT.WIFI_SCAN_READ].codePointAt(0).toString(16) ===
            AppConstants.SUCCESS
          ) {
            // flush the array
            this.loggerService.info(
              `flush the array ${data[NetworkConstant.TEXT.WIFI][NetworkConstant.TEXT.WIFI_SCAN]}`,
            );
          }
        });
    }
  }

  transformation(networkItem) {
    if (!networkItem.label) {
      // If label is empty then, updating with "Hidden Network"
      networkItem.label = NetworkConstant.TEXT.HIDDEN_NETWORK;
    }

    if (networkItem.securityType) {
      this.addLockForSecurity(networkItem);
    }

    if (networkItem.signalStrength) {
      // Adding Singal Strength Icon based on the decibel values
      this.addSignalStrengthInDecibel(networkItem);
    }
  }

  private securityCategorizing(networkItem): SecuritiesType {
    if (networkItem[1].includes(NetworkConstant.TEXT.EAP)) {
      return 'eap';
    }

    if (networkItem[1].includes(NetworkConstant.TEXT.PSK)) {
      return 'wpa';
    }

    if (networkItem[1].includes(NetworkConstant.TEXT.WEP)) {
      return 'wep';
    }

    return 'none';
  }

  private addLockForSecurity(item) {
    if (item.securityCategory === AppConstants.NONE) {
      item.firstIcon = '';
      return;
    }
    item.firstIcon = NetworkConstant.ICON.LOCK;
  }

  private addSignalStrengthInDecibel(item: any) {
    if (item.signalStrength <= -90) {
      // Unusable Signal Strength
      item.secondIcon = NetworkConstant.ICON.STRENGTH.LOW;
    } else if (item.signalStrength > -90 && item.signalStrength <= -70) {
      // Not Good Signal Strength
      item.secondIcon = NetworkConstant.ICON.STRENGTH.LOW_MEDIUM;
    } else if (item.signalStrength >= -70 && item.signalStrength <= -30) {
      // Very Good Signal Strength and Okay Signal Strength
      item.secondIcon = NetworkConstant.ICON.STRENGTH.MEDIUM;
    } else if (item.signalStrength > -30) {
      // Amazing Signal Strength
      item.secondIcon = NetworkConstant.ICON.STRENGTH.HIGH;
    }
  }

  onSelectNetworkList(selectedNetwork) {
    switch (selectedNetwork.securityCategory) {
      case 'none':
        // Open network Scenario
        this.isWirelessipSettingsEnabled = true;

        this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
          [NetworkConstant.UUID.WIFI.WIFI_SSID]: selectedNetwork.name,
        });

        this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
          [NetworkConstant.UUID.WIFI.WIFI_SECURITY]: AppConstants.NONE,
        });

        this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
          [NetworkConstant.UUID.WIFI.WIFI_PASSWORD]: '',
        });

        this.deviceManagerService.sendToDevice(AppConstants.Action.Perform, {
          [NetworkConstant.UUID.WIFI.WIFI_JOIN]: '',
        });
        break;
      case 'wpa':
        // wireless network scenario
        this.isWirelessipSettingsEnabled = false;
        this.openPasswordDialog(selectedNetwork);
        break;
      case 'eap':
        // Advance wireless network scenario
        this.isWirelessipSettingsEnabled = false;
        this.openEapFormDialog(selectedNetwork);
        break;
      case 'wep':
        this.isWirelessipSettingsEnabled = false;
        this.openWepFormDialog(selectedNetwork);
        break;
      case 'otherNetwork':
        this.isWirelessipSettingsEnabled = false;
        this.openDialogForOtherNetwork(selectedNetwork);
        break;
      default:
        break;
    }
  }

  onAutoConnectSelect(selectedOption) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_AUTOCONNECT]: selectedOption ? AppConstants.StateOn : AppConstants.StateOff,
    });
  }
  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  openPasswordDialog(selectedNetwork) {
    this.dialogService.openDialog(
      WirelessPasswordComponent,
      `The Wireless network "${selectedNetwork.name}" requires a WPA2 password.`,
      NetworkConstant.ICON.WIFI,
      {
        RefuteButtonLabel: AppConstants.CANCEL,
        confirmButtonLabel: AppConstants.JOIN,
      },
      selectedNetwork,
      true,
    );
  }
  openEapFormDialog(selectedNetwork) {
    this.dialogService.openDialog(
      WirelessEapPasswordComponent,
      `The Wireless network "${selectedNetwork.name}" requires a 802.1 x EAP password.`,
      NetworkConstant.ICON.WIFI,
      {
        RefuteButtonLabel: AppConstants.CANCEL,
        confirmButtonLabel: AppConstants.JOIN,
      },
      selectedNetwork,
      true,
    );
  }

  openWepFormDialog(selectedNetwork) {
    this.dialogService.openDialog(
      WirelessPasswordComponent,
      `The Wireless network "${selectedNetwork.name}" requires a WEP password.`,
      NetworkConstant.ICON.WIFI,
      {
        RefuteButtonLabel: AppConstants.CANCEL,
        confirmButtonLabel: AppConstants.JOIN,
      },
      selectedNetwork,
      true,
    );
  }

  openDialogForOtherNetwork(selectedNetwork) {
    this.dialogService.openDialog(
      WirelessOtherNetworkComponent,
      `Find and join a Wireless Network.`,
      NetworkConstant.ICON.WIFI,
      {
        RefuteButtonLabel: AppConstants.CANCEL,
        confirmButtonLabel: AppConstants.JOIN,
      },
      selectedNetwork,
      true,
    );
  }

  onStatusChange(status) {
    this.connectionStatus = status;
    if (
      this.wifiNameForm.get(this.wifiNameUuid) &&
      status === AppConstants.CONNECTION_STATE.DISCONNECTED &&
      !this.isJoinToNetworkClicked
    ) {
      this.connectedDeviceName = NetworkConstant.TEXT.DEFAULT_SSID;
      this.wifiNameForm.get(this.wifiNameUuid).setValue(this.connectedDeviceName);
      /** show toast message if disconnects beyond flag join connection flags reset
      this.notifySomthingWrongInConnection(); */
    } else if (this.wifiNameForm.get(this.wifiNameUuid)) {
      this.connectedDeviceName = this.previousNetworkConnected;
      this.wifiNameForm.get(this.wifiNameUuid).setValue(this.connectedDeviceName);
    }
  }

  /** toast message for something went wrong RAP-
 * delare a unbleToConnectSnakerShown. Reset it to false once user clicks on Join.
  notifySomthingWrongInConnection() {
    if (!this.unbleToConnectSnakerShown) {
      const notificationData = new NotificationData();
      notificationData.message = NetworkConstant.DIALOG_TEXTS.CONNECTION_FAILED;
      notificationData.messageType = NotificationType.success;
      this.notificationService.showNotification(notificationData);
      this.unbleToConnectSnakerShown = true;
    }
  }
*/

  getNetworkList(isMenuOpened) {
    if (isMenuOpened) {
      this.dropDownOpenEvent.next(isMenuOpened);
    }
  }
}
