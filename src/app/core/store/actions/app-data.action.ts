import { Action } from '@ngrx/store';

// ! Define the action type as named constant using enum
export enum ApplicationActionTypes {
  SET_APPLICATION_DATA = '[SET_APPLICATION_DATA] Notification from Application',
}

// !To update cache from application action
export class SaveAppDataAction implements Action {
  readonly type = ApplicationActionTypes.SET_APPLICATION_DATA;
  constructor(public payload: any) {}
}

export type ApplicationActions = SaveAppDataAction;
