import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { StatusViewConstant } from './status.constant';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { StatusModel, NetworkStatusModel, WiFiStatusModel, BluetoothStatusModel } from './status.model';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FirmwareCheckService } from 'app/configuration/firmware/firmware-check.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit, OnDestroy {
  updateFirmWare = StatusViewConstant.FIRMWARE_UPDATE_IMG_SRC;
  wifiIcon = StatusViewConstant.WIFI_ICON;
  ethernetIcon = StatusViewConstant.ETHERNET_ICON;
  bluetoothIcon = StatusViewConstant.BLUETOOTH_ICON;
  connectionStatus = StatusViewConstant.CONNECTION_STATUS;
  appConstants = AppConstants;
  statusModel: StatusModel;
  unsubscribe = new Subject<void>();
  isUpToDate: boolean;
  defaultStaticIp = AppConstants.DEFAULT_IP;

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private zone: NgZone,
    private firmwareCheckService: FirmwareCheckService,
  ) {
    this.statusModel = new StatusModel();
    this.statusModel.networkStatus = new NetworkStatusModel();
    this.statusModel.bluetoothStatus = new BluetoothStatusModel();
    this.statusModel.wifiStatus = new WiFiStatusModel();
  }

  ngOnInit() {
    this.getStatusData();
    this.checkForUpdate();
  }
  getStatusData() {
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.SYSTEM_NAME)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((systemName: string) => {
        this.zone.run(() => {
          this.statusModel.systemName = systemName;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.SYSTEM_FIRMWARE_VERSION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((systemFirmwareVersion: string) => {
        this.zone.run(() => {
          this.statusModel.systemFirmwareVersion = systemFirmwareVersion;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.CAMERA_VERSION)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((cameraVersion: string) => {
        this.zone.run(() => {
          if (cameraVersion) {
            this.statusModel.cameraFirmwareVersion = cameraVersion.replace('V', '');
          }
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.SYSTEM_PROFILE_NAME)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((systemProfileName: string) => {
        this.zone.run(() => {
          this.statusModel.systemProfileName = systemProfileName;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.SYSTEM_SERIAL_NUMBER)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((systemSerialNumber: string) => {
        this.zone.run(() => {
          this.statusModel.systemSerialNumber = systemSerialNumber;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.USB_AUDIO_STREAM_UP)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((usbUpAudioStreamStatus: string) => {
        this.zone.run(() => {
          this.statusModel.usbUpAudioStreamStatus = usbUpAudioStreamStatus;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.USB_AUDIO_STREAM_DOWN)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((usbDownAudioStreamStatus: string) => {
        this.zone.run(() => {
          this.statusModel.usbDownAudioStreamStatus = usbDownAudioStreamStatus;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.CAMERA_STATE)
      .pipe(map(this.mapCameraStreamStatus), takeUntil(this.unsubscribe))
      .subscribe((cameraState: string) => {
        this.zone.run(() => {
          this.statusModel.cameraState = cameraState;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.WIFI_ENABLED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((wifiEnabled: string) => {
        this.zone.run(() => {
          this.statusModel.wifiStatus.wifiEnabled = wifiEnabled;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.WIFI_IP)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((wifiIp: string) => {
        this.zone.run(() => {
          this.statusModel.wifiStatus.wifiIp = wifiIp;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.WIFI_SSID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((wifiSSID: string) => {
        this.zone.run(() => {
          this.statusModel.wifiStatus.wifiSSID = wifiSSID;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.WIFI_STATE)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((wifiState: string) => {
        this.zone.run(() => {
          this.statusModel.wifiStatus.wifiState = wifiState;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.WIFI_DHCP_STATE)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((wifiDhcpState: string) => {
        this.zone.run(() => {
          this.statusModel.wifiStatus.wifiDhcpState = wifiDhcpState;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.WIFI_DHCP_IP)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((wifiDhcpIp: string) => {
        this.zone.run(() => {
          this.statusModel.wifiStatus.wifiDhcpIp = wifiDhcpIp;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.ETHERNET_ENABLED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((ethernetEnabled: string) => {
        this.zone.run(() => {
          this.statusModel.networkStatus.networkEnabled = ethernetEnabled;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.NETWORK_STATE)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((networkState: string) => {
        this.zone.run(() => {
          this.statusModel.networkStatus.networkState = networkState;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.NETWORK_IP)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((networkIp: string) => {
        this.zone.run(() => {
          this.statusModel.networkStatus.networkIp = networkIp;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.NETWORK_DHCP_STATE)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((networkDhcpState: string) => {
        this.zone.run(() => {
          this.statusModel.networkStatus.networkDhcpState = networkDhcpState;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.NETWORK_DHCP_IP)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((networkDhcpIp: string) => {
        this.zone.run(() => {
          this.statusModel.networkStatus.networkDhcpIp = networkDhcpIp;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.BLUETOOTH_ENABLED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((bluetoothEnabled: string) => {
        this.zone.run(() => {
          this.statusModel.bluetoothStatus.bluetoothEnabled = bluetoothEnabled;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.BLUETOOTH_STATE)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((bluetoothState: string) => {
        this.zone.run(() => {
          this.statusModel.bluetoothStatus.bluetoothState = bluetoothState;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.BLUETOOTH_CONNECTED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((bluetoothConnected: string) => {
        this.zone.run(() => {
          this.statusModel.bluetoothStatus.bluetoothConnetedDevice = bluetoothConnected;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.BLUETOOTH_PAIRED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((bluetoothPaired: string) => {
        this.zone.run(() => {
          this.statusModel.bluetoothStatus.bluetoothPaired = bluetoothPaired;
        });
      });
    this.deviceManagerService
      .listenFromDevice(StatusViewConstant.UUID.BLUETOOTH_CALL_STATE)
      .pipe(map(this.mapBTCallStreamStatus), takeUntil(this.unsubscribe))
      .subscribe((bluetoothCallState: string) => {
        this.zone.run(() => {
          this.statusModel.bluetoothStatus.bluetoothCallStatus = bluetoothCallState;
        });
      });
  }

  checkForUpdate() {
    this.firmwareCheckService.checkFirmware();
    this.firmwareCheckService.isFirmwareUpToDate().pipe(takeUntil(this.unsubscribe)).subscribe((firmwareStatus: Object) => {
      this.zone.run(() => {
        this.isUpToDate = firmwareStatus[AppConstants.APP_DATA_KEYS.IS_UP_TO_DATE_KEY];
      });
    });
  }

  mapAudioStreamStatus() {
    if (
      this.statusModel.usbUpAudioStreamStatus === AppConstants.StateOn ||
      this.statusModel.usbDownAudioStreamStatus === AppConstants.StateOn
    ) {
      return AppConstants.STREAMING;
    }
    return AppConstants.NOT_STREMING;
  }

  private mapCameraStreamStatus(cameraStreamStatus) {
    if (cameraStreamStatus === AppConstants.ACTIVE) {
      return AppConstants.STREAMING;
    }
    if (cameraStreamStatus === AppConstants.INACTIVE) {
      return AppConstants.NOT_STREMING;
    }
  }

  private mapBTCallStreamStatus(bluetoothCallStreamStatus) {
    if (bluetoothCallStreamStatus === AppConstants.StateOn) {
      return AppConstants.STREAMING;
    }
    if (bluetoothCallStreamStatus === AppConstants.StateOff) {
      return AppConstants.NOT_STREMING;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getWifiStatus(): string {
    if (this.statusModel.wifiStatus.wifiEnabled === AppConstants.StateOff) {
      return StatusViewConstant.CONNECTION_STATUS.DISABLED;
    }
    if (this.statusModel.wifiStatus.wifiEnabled === AppConstants.StateOn) {
      if (
        (this.statusModel.wifiStatus.wifiState === AppConstants.API_STATE.ONLINE ||
          this.statusModel.wifiStatus.wifiState === AppConstants.API_STATE.READY) &&
        this.statusModel.wifiStatus.wifiSSID
      ) {
        return StatusViewConstant.CONNECTION_STATUS.CONNECTED;
      }
      return StatusViewConstant.CONNECTION_STATUS.DISCONNECTED;
    }
  }

  getNetworkStatus(): string {
    if (this.statusModel.networkStatus.networkEnabled === AppConstants.StateOff) {
      return StatusViewConstant.CONNECTION_STATUS.DISABLED;
    }
    if (this.statusModel.networkStatus.networkEnabled === AppConstants.StateOn) {
      if (
        this.statusModel.networkStatus.networkState === AppConstants.API_STATE.ONLINE ||
        this.statusModel.networkStatus.networkState === AppConstants.API_STATE.READY
      ) {
        return StatusViewConstant.CONNECTION_STATUS.CONNECTED;
      }
      return StatusViewConstant.CONNECTION_STATUS.DISCONNECTED;
    }
  }

  getBluetoothStatus(): string {
    if (this.statusModel.bluetoothStatus.bluetoothEnabled === AppConstants.StateOff) {
      return StatusViewConstant.CONNECTION_STATUS.DISABLED;
    }
    if (this.statusModel.bluetoothStatus.bluetoothEnabled === AppConstants.StateOn) {
      if (
        this.statusModel.bluetoothStatus.bluetoothState === AppConstants.StateOn &&
        this.statusModel.bluetoothStatus.bluetoothConnetedDevice === AppConstants.StateOn &&
        this.statusModel.bluetoothStatus.bluetoothPaired
      ) {
        return StatusViewConstant.CONNECTION_STATUS.CONNECTED;
      }
      return StatusViewConstant.CONNECTION_STATUS.NOT_CONNECTED;
    }
  }

  getWifiIpConfig(): string {
    if (
      this.statusModel.wifiStatus.wifiEnabled === AppConstants.StateOn &&
      (this.statusModel.wifiStatus.wifiState === AppConstants.API_STATE.ONLINE ||
        this.statusModel.wifiStatus.wifiState === AppConstants.API_STATE.READY) &&
      this.statusModel.wifiStatus.wifiSSID
    ) {
      if (
        this.statusModel.wifiStatus.wifiDhcpState === AppConstants.StateOn &&
        this.statusModel.wifiStatus.wifiDhcpIp
      ) {
        return this.statusModel.wifiStatus.wifiDhcpIp;
      }
      if (this.statusModel.wifiStatus.wifiDhcpState === AppConstants.StateOff && this.statusModel.wifiStatus.wifiIp) {
        return this.statusModel.wifiStatus.wifiIp;
      }
    }
    return null;
  }

  getNetworkIpConfig(): string {
    if (
      this.statusModel.networkStatus.networkEnabled === AppConstants.StateOn &&
      (this.statusModel.networkStatus.networkState === AppConstants.API_STATE.ONLINE ||
        this.statusModel.networkStatus.networkState === AppConstants.API_STATE.READY)
    ) {
      if (
        this.statusModel.networkStatus.networkDhcpState === AppConstants.StateOn &&
        this.statusModel.networkStatus.networkDhcpIp
      ) {
        return this.statusModel.networkStatus.networkDhcpIp;
      }
      if (
        this.statusModel.networkStatus.networkDhcpState === AppConstants.StateOff &&
        this.statusModel.networkStatus.networkIp
      ) {
        return this.statusModel.networkStatus.networkIp;
      }
    }
    return null;
  }

  openWebApplication(url) {
    window.open(`${AppConstants.HTTP_TYPE}${url}`);
  }
}
