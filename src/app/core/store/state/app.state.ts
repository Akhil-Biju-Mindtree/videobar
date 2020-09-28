import { RouterReducerState } from '@ngrx/router-store';

/**
 * !global interface which defines the complete state of the application (i.e- complete app state tree)
 * !each property is silce of state for each module
 */
export interface IAppState {
  router?: RouterReducerState; // eagerly loaded module
  deviceData: {};
  appData: AppDataState;
}

export interface AppDataState {
  Authenticated?: boolean;
  DeviceDataRetrieved?: boolean;
  FirmwareUpdateInProgress?: boolean;
  FirmwareCopyInProgress?: boolean;
  FirmwareCurrentProgress?: any;
  LogsDownloadStatus?: any;
  CopyProgress?: any;
  RequestIds?: any;
  RedirectToFirmware?: boolean;
}

export const initialAppData = {
  Authenticated: false,
  DeviceDataRetrieved: false,
  FirmwareUpdateInProgress: false,
  FirmwareCopyInProgress: false,
  FirmwareCurrentProgress: 0,
  LogsDownloadStatus: 'none',
  CopyProgress: 0,
  RequestIds: [],
  RedirectToFirmware: false,
};

export const initialAppState: IAppState = {
  deviceData: {},
  appData: {},
};

export function getInitialAppState(): IAppState {
  return initialAppState;
}
