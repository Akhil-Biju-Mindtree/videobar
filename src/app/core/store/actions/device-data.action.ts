import { Action } from '@ngrx/store';
import { SendReqModel } from '@shared/models/send-request.model';

// ! Define the action type as named constant using enum
export enum DeviceActionTypes {
  SEND_TO_DEVICE = '[SEND] Send To Device',
  SEND_TO_DEVICE_SUCCESS = '[SEND_SUCCESS] Send To Device Successfully',
  SEND_TO_DEVICE_FAIL = '[SEND_FAIL] Send To Device Failure',
  NOTIFICATION_FROM_DEVICE = '[NOTIFICATION_DEVICE] Notification from Device',
}

// !Build Action Creator
export class SendToDeviceAction implements Action {
  readonly type = DeviceActionTypes.SEND_TO_DEVICE; // Type -> Action Object property
  constructor(public payload: SendReqModel) {} // Payload -> Action Object property
}

export class SendToDeviceSuccessAction implements Action {
  readonly type = DeviceActionTypes.SEND_TO_DEVICE_SUCCESS;
  constructor() {}
}

export class SendToDeviceFailAction implements Action {
  readonly type = DeviceActionTypes.SEND_TO_DEVICE_FAIL;
  constructor() {}
}

export class NotificationFromDeviceAction implements Action {
  readonly type = DeviceActionTypes.NOTIFICATION_FROM_DEVICE;
  constructor(public payload: any) {}
}

// !  Defining a Union Type for action creator
export type DeviceActions =
  | SendToDeviceAction
  | SendToDeviceSuccessAction
  | SendToDeviceFailAction
  | NotificationFromDeviceAction;
