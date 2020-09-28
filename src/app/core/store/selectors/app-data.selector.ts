import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { MapperService } from '@core/services/mapper.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppDataSelector {
  appSatate = (state: IAppState) => state.appData;

  constructor(private mapperService: MapperService) {}

  public getState = (data: string) => {
    return createSelector(
        this.appSatate,
        state => state[data],
    );
  }
}
