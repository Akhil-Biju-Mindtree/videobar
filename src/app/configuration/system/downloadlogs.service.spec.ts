import { TestBed } from '@angular/core/testing';

import { DownloadlogsService } from './downloadlogs.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { of } from 'rxjs';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { SharedConstants as AppSharedConstants } from '../../../../shared/constants/shared.constants';
import { LOG_TIMEOUT } from '@core/constants/app.constant';
import { DOWNLOAD_LOGS_STATUS } from './system.constant';

const mockAppDataManager = { saveToAppData: jest.fn(), listenForAppData: jest.fn() };
const mockNotifyService = { showNotification: jest.fn() };
const mockSpinnerService = { openSpinnerDialog: jest.fn() };

describe('DownloadlogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: mockAppDataManager },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: NotificationService, useValue: mockNotifyService },
        { provide: FileServiceAdaptor, useValue: { send: () => {}, setTransferMode: () => {} } },
        { provide: DeviceDataManagerService, useValue: { sendToDevice: () => {} } },
      ],
    });
  });

  it('should be created', () => {
    const service: DownloadlogsService = TestBed.get(DownloadlogsService);
    expect(service).toBeTruthy();
  });

  it('should callDownloadLogUSB', () => {
    const service: DownloadlogsService = TestBed.get(DownloadlogsService);
    mockAppDataManager.listenForAppData.mockImplementation(() => of(100));
    service.callDownloadLogUSB();
    spyOn(service, 'showErrorDialog').and.callThrough();
    service.isDesktopApp = false;
    mockAppDataManager.listenForAppData.mockImplementation(() => of(AppSharedConstants.statusfailure));
    service.callDownloadLogUSB();
    mockAppDataManager.listenForAppData.mockImplementation(() => of(LOG_TIMEOUT));
    service.callDownloadLogUSB();
    expect(service.showErrorDialog).toBeCalledTimes(2);
  });

  it('should call notifications', () => {
    const service: DownloadlogsService = TestBed.get(DownloadlogsService);
    const spy = jest.spyOn(mockNotifyService, 'showNotification');
    service.showSuccessMessage();
    expect(spy).toBeCalled();
  });

  it('should resetLogState', () => {
    const service: DownloadlogsService = TestBed.get(DownloadlogsService);
    const spy = jest.spyOn(mockAppDataManager, 'saveToAppData');
    service.isSetTimer = true;
    service.resetLogState();
    expect(spy).toBeCalledWith({ LogsDownloadStatus: DOWNLOAD_LOGS_STATUS.NONE });
  });

  it('should triggerDownloadAPI', () => {
    const service: DownloadlogsService = TestBed.get(DownloadlogsService);
    spyOn(service, 'callDownloadLogUSB');
    service.triggerDownloadAPI();
    expect(service.callDownloadLogUSB).toBeCalled();
  });

  it('should showProgressDialog', () => {
    const service: DownloadlogsService = TestBed.get(DownloadlogsService);
    const spy = jest.spyOn(mockSpinnerService, 'openSpinnerDialog');
    service.showProgressDialog();
    expect(spy).toBeCalled();
  });
});
