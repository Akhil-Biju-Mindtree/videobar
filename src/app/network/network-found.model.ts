export type SecuritiesType = 'wep' | 'eap' | 'wpa' | 'none' | 'otherNetwork';

export interface NetworkFound {
  label: string;
  address: string;
  signalStrength: number;
  securityType: string;
  name: string;
  securityCategory: SecuritiesType;
}
