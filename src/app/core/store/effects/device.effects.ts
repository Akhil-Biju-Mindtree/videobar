import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { DeviceService } from '@core/services/device.service';
import { SendReqModel } from '@shared/models/send-request.model';

import {
  DeviceActions,
  DeviceActionTypes,
  SendToDeviceAction,
  SendToDeviceSuccessAction,
  SendToDeviceFailAction,
} from '../actions/device-data.action';

@Injectable()
export class DeviceEffects {
  constructor(private actions$: Actions, private deviceService: DeviceService) {}

  // Commented below Code, Will be need in Future Implementation
  // !Effect for send (Action can be update, subscribe, etc.)
  /**   @Effect()
  sendToDevice$: Observable<DeviceActions> = this.actions$.pipe(
    ofType(DeviceActionTypes.SEND_TO_DEVICE),
    map((action: SendToDeviceAction) => action.payload),
    mergeMap((sendRequestModel: SendReqModel) =>
      this.deviceService.send(sendRequestModel).pipe(
        map((response: {}) => {
          // !Dispatch Action from Effects

          return new SendToDeviceSuccessAction();
        }),
        catchError(err => of(new SendToDeviceFailAction())),
      ),
    ),
  ); */
}
