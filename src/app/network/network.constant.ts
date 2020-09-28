import { NavigationItem } from '@shared/models/navigation.model';

export const NetworkConstant = {
  UUID: {
    STATUS_BEHAVIOR_ETHERNET: '7a6c7304-3601-49e8-9644-15cc1164941e',
    STATUS_STATE: '9f25f37d-e8e7-4c2e-8006-3143a32e4f73',

    WIRED: {
      IP_CONFIGURATION: '0cd50186-515b-4049-89b2-dd00f1b7fb74',
      DHCP: {
        IP_ADDRESS: 'd217d6c0-8871-4a2a-ac4c-1ac706774ea5',
        SUBNET_MASK: '51eb65df-93e9-46a2-89a0-b268449c438c',
        DEFAULT_GATEWAY: '62a69b35-ef0a-4aea-b979-acddb9d98229',
        PRIMARY_DNS: '48c576d3-0220-45c3-bf2d-1a3ea257337c',
        SECONDARY_DNS: 'ad12a668-bf8a-44a6-aa08-026504058b64',
      },

      STATIC: {
        IP_ADDRESS: '511205e2-8d8b-49c4-a6c7-fb6ff28f3fa8',
        SUBNET_MASK: '5dd53d94-11f4-4e8d-b0bf-b87c82ae9b92',
        DEFAULT_GATEWAY: 'e308960a-0506-4cbf-abc4-36c75155c3f9',
        PRIMARY_DNS: 'd73da7f5-546c-493c-be69-0e80bb002594',
        SECONDARY_DNS: 'da32607d-528e-4a7e-851d-e20be0783bf0',
      },
      MAC_ADDRESS: 'de35204f-3551-4fc1-b4df-020d3dc10a8b',
    },

    WIFI_STATUS_BEHAVIOR: '0bb3d802-464e-4440-b2d0-4e991bb7e634',
    WIFI_STATUS_STATE: 'bc357a98-f196-43ab-9d51-c25ffe132dd5',
    WIRELESS: {
      IP_CONFIGURATION: 'ceffa67f-3173-4bb2-8bae-6f015e6ccf64',
      DHCP: {
        IP_ADDRESS: '9407d453-e3b0-455f-8435-9ea5eef42351',
        SUBNET_MASK: '37646bb0-0db8-4837-b247-b67dda36bbcc',
        DEFAULT_GATEWAY: 'd7e045e2-6a73-4f63-9758-de9bd7386d92',
        PRIMARY_DNS: 'fb3577ed-0065-4f1f-8329-517176ce3852',
        SECONDARY_DNS: '92ee9680-4278-4c87-87c7-cbc4fcbcca21',
      },
      STATIC: {
        IP_ADDRESS: 'def218aa-a9db-4d68-881f-3ad9b8cc1ca3',
        SUBNET_MASK: '94064c9d-0243-4c93-8ecb-5f72c6a0deb3',
        DEFAULT_GATEWAY: 'b77b54d2-043e-44f8-8704-2cd1f76dc3f8',
        PRIMARY_DNS: '394bef4c-4940-4978-bfd9-23d2f22394c9',
        SECONDARY_DNS: '134a1831-0dfb-4d37-9054-e015117e90e1',
      },
      MAC_ADDRESS: '42534f0c-cecc-4140-be2d-c0e728be4039',
    },
    WIFI: {
      WIFI_SCAN: 'f142b729-c78f-47dc-9e27-acdf9b5acd28',
      WIFI_NETWORKFOUND: '4d8502a1-ef87-442f-a95b-59b9576b2ec9',
      WIFI_AUTOCONNECT: '4399257e-a39b-4813-ae73-41d9079902a8',
      WIFI_SSID: 'db8af48e-7e03-4b22-8e15-5e3779474365',
      WIFI_JOIN: 'e90154d7-b192-415b-be66-ed13f83e1844',
      WIFI_PASSWORD: '7fda441d-0362-474b-818b-33edeb6382fc',
      WIFI_SECURITY: 'e7048b74-2971-468b-9d8d-1c73085bd3b7',
    },
  },

  DIALOG_TEXTS: {
    RESTORE_DEFAULT_DIALOG_HEADER: 'Restore Factory Defaults?',
    RESTORE_DEFAULT_DIALOG_CONTENT:
      '<p>Restoring the factory defaults will override all current network values.</p><p>Are you sure you want to proceed?</p>',
    RESTORE_DEFAULT_CONFIRM_TEXT: 'Restore',
    DEFAULT_RESTORED: 'Factory defaults restored.',
    CONNECTION_FAILED: 'Unable to connect. Please try again.',
    NETWORK_APPLY_DIALOG_HEADER: 'Apply Network Settings?',
    NETWORK_APPLY_CONTENT: `Changing network settings may cause the web interface to disconnect.
    To restore access, connect to device via USB and use the Bose Work Configuration application.`,
    NETWORK_APPLY_CONFIRM_TEXT: 'Apply',
  },

  ICON: {
    ETHERNET: 'assets/images/svg/network/ethernet.svg',
    WIFI: 'assets/images/svg/network/wifi.svg',
    LOCK: 'assets/images/svg/network/lock.svg',
    STRENGTH: {
      LOW: 'assets/images/svg/network/signal-strength/low-strength.svg',
      LOW_MEDIUM: 'assets/images/svg/network/signal-strength/medium-low.svg',
      MEDIUM: 'assets/images/svg/network/signal-strength/medium-high.svg',
      HIGH: 'assets/images/svg/network/signal-strength/full-strength.svg',
    },
  },

  TEXT: {
    HIDDEN_NETWORK: 'Hidden Network',
    WIFI: 'wifi',
    WIFI_SCAN: 'wifi.scan',
    WIFI_SCAN_READ: 'AF',
    WIFI_NETWORKFOUND: 'wifi.networkFound',

    DEFAULT_SSID: '',

    EAP: 'EAP',
    PSK: 'PSK',
    WEP: 'WEP',
  },

  ERROR: {
    NAME_FORMAT: '\\x00',
    MESSAGE: 'Invalid Format',
  },
  SCAN_INTERVAL: 10000,
  CONNECTION__BUFFER_TIME: 15000,
};

export const SnmpSettings = {
  LABEL_UUID: [
    {
      label: 'Authentication Protocol',
      uuid: '3be4fd3a-a329-4ea5-b846-d4b07520dc89',
      isRequired: true,
      value: '',
      valueLabel: '',
    },
    {
      label: 'Username',
      uuid: '90be449e-1be4-4d63-95fe-b8c14da586c7',
      isRequired: false,
      value: '',
    },
    {
      label: 'Password',
      uuid: '8d20fab2-65ab-44fe-85d1-2df6fd5de885',
      isRequired: false,
      value: '',
    },
    {
      label: 'Encryption Protocol',
      uuid: '749732aa-daab-4259-aa81-364156e1a29c',
      isRequired: true,
      value: '',
      valueLabel: '',
    },
    {
      label: 'Privacy Passphrase',
      uuid: 'e981b26d-f8e1-4558-81e8-06b71f18a363',
      isRequired: false,
      value: '',
    },
    {
      label: 'Trap Server',
      uuid: '2459f842-3842-43d3-8e4b-f3980e183e41',
      isRequired: false,
      value: '',
    },
  ],

  AUTHENTICATION_TYPES: [
    { label: 'MD5', value: 'md5' },
    { label: 'SHA', value: 'sha' },
    { label: '128SHA224', value: 'sha224' },
    { label: '192SHA256', value: 'sha256' },
    { label: '256SHA384', value: 'sha384' },
    { label: '384SHA512', value: 'sha512' },
    { label: 'None', value: 'none' },
  ],
  ENCRYPTION_TYPES: [
    { label: 'DES', value: 'des' },
    { label: '3DESEDE', value: '3des' },
    { label: 'AesCfb128', value: 'aes128' },
    { label: 'AesCfb192', value: 'aes192' },
    { label: 'AesCfb256', value: 'aes256' },
    { label: 'None', value: 'none' },
  ],
};

export const NETWORK_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Wired', link: 'wired' },
  { label: 'Wireless', link: 'wireless' },
  { label: 'SNMP Setting', link: 'snmp' },
];

export const WIRED_IP_STATIC_ITEMS = [
  {
    label: 'IP Address',
    uuid: NetworkConstant.UUID.WIRED.STATIC.IP_ADDRESS,
    isRequired: true,
    value: '',
  },
  {
    label: 'Subnet Mask',
    uuid: NetworkConstant.UUID.WIRED.STATIC.SUBNET_MASK,
    isRequired: true,
    value: '',
  },
  {
    label: 'Default Gateway',
    uuid: NetworkConstant.UUID.WIRED.STATIC.DEFAULT_GATEWAY,
    isRequired: false,
    value: '',
  },
  {
    label: 'Primary DNS',
    uuid: NetworkConstant.UUID.WIRED.STATIC.PRIMARY_DNS,
    isRequired: false,
    value: '',
  },
  {
    label: 'Secondary DNS',
    uuid: NetworkConstant.UUID.WIRED.STATIC.SECONDARY_DNS,
    isRequired: false,
    value: '',
  },
];

export const IP_CONFIGURATION_ITEMS = [
  { text: 'DHCP', value: '1' },
  { text: 'Static', value: '0', abandonEmit: true },
];

export const FACTORY_RESTORE_UUIDS_WIRED_NETWORK = {
  [NetworkConstant.UUID.STATUS_BEHAVIOR_ETHERNET]: '',
  [NetworkConstant.UUID.WIRED.IP_CONFIGURATION]: '',
  [NetworkConstant.UUID.WIRED.STATIC.IP_ADDRESS]: '',
  [NetworkConstant.UUID.WIRED.STATIC.SUBNET_MASK]: '',
  [NetworkConstant.UUID.WIRED.STATIC.DEFAULT_GATEWAY]: '',
  [NetworkConstant.UUID.WIRED.STATIC.PRIMARY_DNS]: '',
  [NetworkConstant.UUID.WIRED.STATIC.SECONDARY_DNS]: '',
};

export const WIRELESS_IP_STATIC_ITEMS = [
  {
    label: 'IP Address',
    uuid: NetworkConstant.UUID.WIRELESS.STATIC.IP_ADDRESS,
    isRequired: true,
    value: '',
  },
  {
    label: 'Subnet Mask',
    uuid: NetworkConstant.UUID.WIRELESS.STATIC.SUBNET_MASK,
    isRequired: true,
    value: '',
  },
  {
    label: 'Default Gateway',
    uuid: NetworkConstant.UUID.WIRELESS.STATIC.DEFAULT_GATEWAY,
    isRequired: false,
    value: '',
  },
  {
    label: 'Primary DNS',
    uuid: NetworkConstant.UUID.WIRELESS.STATIC.PRIMARY_DNS,
    isRequired: false,
    value: '',
  },
  {
    label: 'Secondary DNS',
    uuid: NetworkConstant.UUID.WIRELESS.STATIC.SECONDARY_DNS,
    isRequired: false,
    value: '',
  },
];

export const WIRELESS_EAP_PASSWORD_ITEMS = [
  {
    label: 'EAP Method',
    uuid: 'f02c82c9-5e3d-4660-8bec-1f681bc78e6d',
    labelValue: 'PEAP',
    initialValue: 'PEAP',
  },
  {
    label: 'Phase 2 Authentication',
    uuid: 'ebf3918c-cab9-4f03-aecf-7f39c49cbaca',
    labelValue: 'None',
    initialValue: 'none',
  },
  {
    label: 'CA Certificate',
    uuid: 'df25477d-24a4-4854-9126-41c02537d122',
    labelValue: 'None',
    initialValue: 'none',
  },
  {
    label: 'Identity',
    uuid: '1f25d5b2-4971-4510-9f24-2c3d4a21d7e4',
  },
  {
    label: 'Anonymous Identity',
    uuid: 'da834c3f-452b-4137-bc42-cfce883bcfa1',
  },
  {
    label: 'Password',
    uuid: '7fda441d-0362-474b-818b-33edeb6382fc',
  },
];

export const EAM_METHOD_LIST = [
  { label: 'PEAP', value: 'PEAP' },
  { label: 'TLS', value: 'TLS' },
  { label: 'TTLS', value: 'TTLS' },
];

export const PHASE_AUTHENTICATION_LIST = [
  { label: 'None', value: 'none' },
  { label: 'CHAP', value: 'CHAP' },
  { label: 'PAP', value: 'PAP' },
  { label: 'MSCHAPV2', value: 'MSCHAPV2' },
  { label: 'MSCHAP', value: 'MSCHAP' },
  { label: 'MD5', value: 'MD5' },
];

export const CA_CERTIFICATE_LIST = [
  { label: 'Do Not Validate', value: 'none' },
  { label: 'System', value: 'system' },
];

export const SECURITY_LIST = [
  { label: 'None', value: 'none' },
  { label: 'WEP', value: 'wep' },
  { label: 'WPA/WPA2/FT PSK', value: 'psk' },
  { label: '802.1 x EAP', value: 'eap' },
];

export const OTHER_NETWORK = [
  {
    label: 'Network Name',
    uuid: 'db8af48e-7e03-4b22-8e15-5e3779474365',
  },
  {
    label: 'Security',
    uuid: 'e7048b74-2971-468b-9d8d-1c73085bd3b7',
    labelValue: 'None',
  },
];

export const FACTORY_RESTORE_UUIDS_WIRELESS_NETWORK = {
  [NetworkConstant.UUID.WIFI_STATUS_BEHAVIOR]: '',
  [NetworkConstant.UUID.WIFI.WIFI_AUTOCONNECT]: '',
  [NetworkConstant.UUID.WIRELESS.IP_CONFIGURATION]: '',
  [NetworkConstant.UUID.WIRELESS.STATIC.IP_ADDRESS]: '',
  [NetworkConstant.UUID.WIRELESS.STATIC.SUBNET_MASK]: '',
  [NetworkConstant.UUID.WIRELESS.STATIC.DEFAULT_GATEWAY]: '',
  [NetworkConstant.UUID.WIRELESS.STATIC.PRIMARY_DNS]: '',
  [NetworkConstant.UUID.WIRELESS.STATIC.SECONDARY_DNS]: '',
  [NetworkConstant.UUID.WIFI.WIFI_SSID]: '',
  [NetworkConstant.UUID.WIFI.WIFI_PASSWORD]: '',
  [NetworkConstant.UUID.WIFI.WIFI_SECURITY]: '',
  [WIRELESS_EAP_PASSWORD_ITEMS[0].uuid]: '',
  [WIRELESS_EAP_PASSWORD_ITEMS[1].uuid]: '',
  [WIRELESS_EAP_PASSWORD_ITEMS[2].uuid]: '',
  [WIRELESS_EAP_PASSWORD_ITEMS[3].uuid]: '',
  [WIRELESS_EAP_PASSWORD_ITEMS[4].uuid]: '',
};
