import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { MapperService } from '@core/services/mapper.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceDataSelector {
  deviceState = (state: IAppState) => state.deviceData;

  constructor(private mapperService: MapperService) {}

  public getState = (uuid: string) => {
    const commandId = this.mapperService.findObjectFromJSONMapper(uuid).command_id;
    return createSelector(this.deviceState, state => state[commandId]);
  }
}
