import { Injectable } from '@angular/core';
import { Logger } from '@core/logger/Logger';
import { CachingService } from '@core/services/caching.service';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { AuthService } from '@core/auth/auth.service';
import { MapperService } from '@core/services/mapper.service';
import { ErrorService } from '@core/error/error.service';
import { SharedConstants } from '../../../shared/constants/shared.constants';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessJsonResponseService {
  requestIdArray;
  constructor(
    private loggerService: Logger,
    private cachingService: CachingService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private mapperService: MapperService,
    private errorService: ErrorService,
    private applicationDataManagerService: ApplicationDataManagerService,
  ) {
    this.getLatestRequestID();
  }

  getLatestRequestID() {
    this.applicationDataManagerService.listenForAppData('RequestIds').subscribe((value: any) => {
      this.requestIdArray = value;
    });
  }

  processJson(arg) {
    // !Instead of transactionID using canonical name
    if (
      arg.action === 'retrieved' ||
      (arg.action === 'notify' && !this.requestIdArray.includes(arg.id)) ||
      (arg.action === 'notify' &&
        this.requestIdArray.includes(arg.id) &&
        this.requestIdArray[this.requestIdArray.indexOf(arg.id)].indexOf(
          SharedConstants.TRANSACTION_ID_TEXTS.RESTORE,
        ) !== -1)
    ) {
      this.saveDataToCache(arg);
    }
  }

  saveDataToCache(arg) {
    const nonAdminSettings = this.mapperService.getNonAdminSettingsFromJsonUIMapper();
    if (arg && arg.data) {
      const destructuredObject = this.getCanonicalName(arg.data);
      // !admin settings are getting set to device cache when access type is admin
      if (this.authService.IsAuthenticated || destructuredObject.hasOwnProperty('24')) {
        this.cachingService.setToCache(destructuredObject);
      } else {
        // !user settings are getting set to cache when access type is not user
        const notifyFieldKeys = Object.keys(destructuredObject);
        if (notifyFieldKeys.every((item: any) => nonAdminSettings.includes(item))) {
          this.cachingService.setToCache(destructuredObject);
        }
      }
    }
  }

  // !Assumption that 'notify' payload will always return only one canonical_name and value(2 level deep)
  getCanonicalName(object) {
    let destructuredObject = {};
    const groupProp = Object.getOwnPropertyNames(object);
    groupProp.forEach((ele: any) => {
      destructuredObject = { ...destructuredObject, ...object[ele] };
    });
    return destructuredObject;
  }

  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      // ?REPORT Not Getting Proper Response From Device: Scenario Toggle Lowlight recursively
      this.errorService.showError('ERROR OCCURRED WHILE PARSING RESPONSE JSON');
      this.loggerService.error(`Error RESPONSE from Device <- :: -> ${e}`);
      return false;
    }
    return true;
  }

  revertDataFromCacheOnError(arg) {
    const devicePayload = JSON.parse(arg);
    const canonicalNameObj = this.getCanonicalName(devicePayload.data);
    const canonicalName = Object.keys(canonicalNameObj)[0];
    const groupName = Object.keys(canonicalName)[0];
    canonicalNameObj[canonicalName] = canonicalNameObj[canonicalName].split(', current value ')[1];
    devicePayload.data = { [groupName]: canonicalNameObj };
    this.saveDataToCache(devicePayload);
  }
}
