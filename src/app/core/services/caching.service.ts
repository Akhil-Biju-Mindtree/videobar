import { Injectable } from '@angular/core';
import { StoresService } from '@core/store/stores.service';
import { CacheStates } from '@core/constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  // !Currently Injected by Vendor -> StoresService which is wrapper over NgRx Store
  constructor(private storesService: StoresService) {}

  // !Get From Caching Layer
  public getFromCache(data, stateType = CacheStates.Device) {
    return this.storesService.getFromStore(data, stateType);
  }

  public getAllFromCache() {
    return this.storesService.getAllFromStore();
  }

  // !Store to Caching Layer
  public setToCache(data, stateType = CacheStates.Device) {
    this.storesService.setToStore(data, stateType);
  }

  // !clear all slice of store
  public clearCache() {
    this.storesService.clearStore();
  }
}
