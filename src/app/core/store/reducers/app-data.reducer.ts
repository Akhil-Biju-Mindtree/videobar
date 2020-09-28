import { ApplicationActions, ApplicationActionTypes } from '../actions/app-data.action';
import { initialAppData } from '../state/app.state';

// !Using strongly typed actions in the reducer function
export function appDataReducer(state = initialAppData, action: ApplicationActions) {
  if (action.type === ApplicationActionTypes.SET_APPLICATION_DATA) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return { ...state };
}
