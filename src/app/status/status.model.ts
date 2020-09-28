export class NetworkStatusModel {
  networkIp: string;
  networkState: string;
  networkEnabled: string;
  networkDhcpState: string;
  networkDhcpIp: string;
}

export class WiFiStatusModel {
  wifiEnabled: string;
  wifiIp: string;
  wifiDhcpIp: string;
  wifiDhcpState: string;
  wifiState: string;
  wifiSSID: string;
}

export class BluetoothStatusModel {
  bluetoothEnabled: string;
  bluetoothState: string;
  bluetoothPaired: string;
  bluetoothConnetedDevice: string;
  bluetoothCallStatus: string;
  blutoothAudioStatus: boolean;
}

export class StatusModel {
  systemName: string;
  systemProfileName: string;
  systemFirmwareVersion: string;
  cameraFirmwareVersion: string;
  systemSerialNumber: string;
  usbUpAudioStreamStatus: string;
  usbDownAudioStreamStatus: string;
  cameraState: string;
  networkStatus: NetworkStatusModel;
  wifiStatus: WiFiStatusModel;
  bluetoothStatus: BluetoothStatusModel;
}
