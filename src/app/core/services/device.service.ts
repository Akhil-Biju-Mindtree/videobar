import { Injectable } from '@angular/core';
import { Observable, Subject, EMPTY, Subscription } from 'rxjs';
import { DeviceModel, DeviceModelSubscribeAll } from '@shared/models/device.model';
import { MapperService } from '@core/services/mapper.service';
import { ServiceAdapter } from 'app/providers/service-adapter';
import { SendReqModel } from '@shared/models/send-request.model';
import { Logger } from '@core/logger/Logger';
import { AppConstants, ALL_UUID, CacheStates } from '@core/constants/app.constant';
import { ErrorService } from '@core/error/error.service';
import * as errorConstants from '@core/error/error.constants';
import { UIMapperModel } from '@shared/models/ui-mapper.model';
import * as uuid from 'uuid/v4';
import { AuthService } from '@core/auth/auth.service';
import { ADMIN_CONST } from 'app/admin/admin.constant';
import { ProcessJsonResponseService } from '@providers/process-json-response.service';
import { AppConfig } from '@environment/environment';
import { ApplicationDataManagerService } from './app-data-manager.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  requestIdArray = [];
  apiBlackList = ['B5', '70']; // API command list which has sensitive data (Passwords), to exclude from logs
  constructor(
    private serviceAdapter: ServiceAdapter,
    private mapperService: MapperService,
    private loggerService: Logger,
    private errorService: ErrorService,
    private authService: AuthService,
    private processJsonResponseService: ProcessJsonResponseService,
    private applicationDataManagerService: ApplicationDataManagerService,
  ) {}

  send(sendRequestModel: SendReqModel): Observable<{}> {
    let devicePayload;
    let transactionId = AppConfig.isDesktopApp ? `USB-${uuid().substring(0, 6)}` : `WEB-${uuid().substring(0, 6)}`;
    transactionId = sendRequestModel.action === AppConstants.Action.Delete ? `${transactionId}-restore` : transactionId;
    this.requestIdArray.push(transactionId);
    this.applicationDataManagerService.saveToAppData({
      RequestIds: this.requestIdArray,
    });
    if (sendRequestModel.data === ALL_UUID) {
      devicePayload = this.mapperService.getAllGroupName();
    } else {
      const fetchedSettings: UIMapperModel[] = this.mapperService.fetchingSettingsFromJsonUIMapper(
        sendRequestModel.data,
      );
      if (sendRequestModel.action !== AppConstants.Action.Authenticate) {
        let actionsMatched = true;
        // !Checking if the actions passed are correct or not
        fetchedSettings.forEach((element: UIMapperModel) => {
          if (!this.checkActionsMatched(sendRequestModel.action, element.actions)) {
            actionsMatched = false;
          }
        });
        // !If action is correct than call service request else show error message
        if (!actionsMatched) {
          this.errorService.showError(errorConstants.ExceptionOccured);
          return EMPTY;
        }
      }

      devicePayload = this.mapperService.generateDynamicPayloadForDeviceData(fetchedSettings);
    }
    return this.sendRequestToServiceAdapter(sendRequestModel, devicePayload, transactionId);
  }

  sendRequestToServiceAdapter(sendRequestModel, devicePayload, transactionId) {
    const subject = new Subject<any>();
    let deviceModel;
    if (sendRequestModel.action === AppConstants.Action.Authenticate) {
      devicePayload.system[AppConstants.SYSTEM_PASSWORD] = '';
      deviceModel = new DeviceModel(
        AppConstants.Action.Retrieve,
        transactionId,
        devicePayload,
        sendRequestModel.data[ADMIN_CONST.UUID.SYSTEM_PASSWORD],
      );
    } else if (this.authService.IsAuthenticated) {
      if (sendRequestModel.action === AppConstants.Action.SubscribeAll) {
        deviceModel = new DeviceModelSubscribeAll(sendRequestModel.action, transactionId, this.authService.Password);
      } else {
        deviceModel = new DeviceModel(sendRequestModel.action, transactionId, devicePayload, this.authService.Password);
      }
    } else {
      deviceModel = new DeviceModel(sendRequestModel.action, transactionId, devicePayload);
    }
    const reqString = JSON.stringify(deviceModel);
    // Save logs only if the content doesn't contain passwords
    if (!this.apiBlackList.some((element: any) => reqString.includes(`"${element}"`))) {
      this.loggerService.trace(
        `sendRequestToParticularMethod::before this.serviceAdapter.send::deviceModel ${reqString}`,
      );
    }
    // save to cache for all actions except retrive --update cache and then request device
    if (
      sendRequestModel.action !== AppConstants.Action.Retrieve &&
      sendRequestModel.action !== AppConstants.Action.Authenticate &&
      sendRequestModel.action !== AppConstants.Action.Delete
    ) {
      this.processJsonResponseService.saveDataToCache(deviceModel);
    }
    this.serviceAdapter.send(deviceModel);
    this.serviceAdapter.requestMap[transactionId] = subject;
    return this.serviceAdapter.requestMap[transactionId].asObservable();
  }

  private checkActionsMatched(currentAction, actions) {
    return actions.includes(currentAction);
  }
}
