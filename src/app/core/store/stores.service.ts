import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from './state/app.state';
import { NotificationFromDeviceAction, SendToDeviceAction } from './actions/device-data.action';
import { SendReqModel } from '@shared/models/send-request.model';
import { DeviceDataSelector } from './selectors/device-data.selector';
import { SaveAppDataAction } from './actions/app-data.action';
import { CacheStates } from '@core/constants/app.constant';
import { AppDataSelector } from './selectors/app-data.selector';
import { LogoutAction } from './actions/root-store.action';

// !This Store Service is specific to NgRx Store Vendor (Wrapper over NgRx)
@Injectable({
  providedIn: 'root',
})
export class StoresService {
  constructor(
    private _store: Store<IAppState>,
    private deviceDataSelector: DeviceDataSelector,
    private appDataSelector: AppDataSelector,
  ) {}

  // !Getter [Get Value from Slice of State]
  public getFromStore(data, stateType) {
    const selector = this.getStateSelector(stateType);
    const getSliceOfState = selector.getState(data);
    return this._store.pipe(select(getSliceOfState));
  }

  public getAllFromStore() {
    return this._store.pipe((data: any) => data);
  }

  public clearStore() {
    this._store.dispatch(new LogoutAction());
  }

  // !Setter [Set Value to Specific slice in state tree]
  public setToStore(data, stateType) {
    if (stateType === CacheStates.Application) {
      this._store.dispatch(new SaveAppDataAction(data));
    }
    if (stateType === CacheStates.Device) {
      this._store.dispatch(new NotificationFromDeviceAction(data));
    }
  }

  // !Send/Dispatch Actions (ex- Update, Subscribe, delete) which does not store in NgRx-Store
  // !But it uses effects and send Request Payload(as per API-DOC) to device
  public dispatchToDevice(sendRequestModel: SendReqModel) {
    this._store.dispatch(new SendToDeviceAction(sendRequestModel));
  }

  // !get the state selector from which data need to be fetch
  public getStateSelector(stateType) {
    if (stateType === CacheStates.Application) {
      return this.appDataSelector;
    }
    if (stateType === CacheStates.Device) {
      return this.deviceDataSelector;
    }
  }
}
