import { DeviceActions, DeviceActionTypes } from '../actions/device-data.action';

// !Using strongly typed actions in the reducer function
export function deviceDataReducer(state, action: DeviceActions) {
  if (action.type === DeviceActionTypes.NOTIFICATION_FROM_DEVICE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return { ...state };
}
