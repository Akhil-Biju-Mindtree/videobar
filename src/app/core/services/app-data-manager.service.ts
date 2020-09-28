import { Injectable } from '@angular/core';
import { CachingService } from './caching.service';
import { Observable } from 'rxjs';
import { CacheStates } from '@core/constants/app.constant';

// !This is Service is soley Will be injected in all the components
@Injectable({
  providedIn: 'root',
})
export class ApplicationDataManagerService {
  constructor(private cachingService: CachingService) {}
   // !Save app data to Caching Layer
  public saveToAppData(data) {
    return this.cachingService.setToCache(data, CacheStates.Application);
  }

  // !Listening From AppData Caching Layer
  public listenForAppData(data) {
    return this.cachingService.getFromCache(data, CacheStates.Application);
  }
}
