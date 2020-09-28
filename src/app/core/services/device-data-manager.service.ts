import { Injectable } from '@angular/core';
import { CachingService } from './caching.service';
import { StoresService } from '@core/store/stores.service';
import { SendReqModel } from '@shared/models/send-request.model';
import { Observable } from 'rxjs';
import { DeviceService } from './device.service';
import { CacheStates } from '@core/constants/app.constant';

// !This is Service is soley Will be injected in all the components
@Injectable({
  providedIn: 'root',
})
export class DeviceDataManagerService {
  constructor(private cachingService: CachingService, private deviceService: DeviceService) {}

  // !Send different Actions(update,subscribe,etc) to Device

  public sendToDevice(action: string, data: { [key: string]: any } | 'ALL'): Observable<any> {
    const sendRequestModel: SendReqModel = { action, data };
    return this.deviceService.send(sendRequestModel);
  }

  // !Listening From Caching Layer, and update Component when caching layer is updated
  public listenFromDevice(uuid) {
    return this.cachingService.getFromCache(uuid);
  }
}
