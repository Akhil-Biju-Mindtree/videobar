export interface PresetControlModel {
  label: string;
  uuid?: string;
  minValue?: number;
  maxValue?: number;
  value?: number;
  preset: string;
}

export interface PresetModel {
  label: string;
  uuid: string;
  successMessage: string;
  presetId: string;
  savePresetuuid: string;
}
