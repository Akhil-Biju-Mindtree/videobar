import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { IAppState } from '../state/app.state';
import { deviceDataReducer } from './device-data.reducer';
import { appDataReducer } from './app-data.reducer';

// !Define/Register all reducer in the NgRx Store
export const appReducer: ActionReducerMap<IAppState, any> = {
  router: routerReducer,
  deviceData: deviceDataReducer,
  appData: appDataReducer,
};
