import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Logger } from '@core/logger/Logger';
import { of } from 'rxjs';
import { FirmwareProgressService } from './firmware-progress.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { FirmwareProgressDialogService } from '@shared/components/firmware-progress-dialog/firmware-progress-dialog.service';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';
import { SharedConstants } from '../../../../shared/constants/shared.constants';
import { AppConstants } from '@core/constants/app.constant';

const mockFirmwareProgressDialogService = {
  dialogRef: { componentInstance: { updateStep: () => {} } },
  closeProgressDialog: () => {},
};

const mockConfirmationDialogService = { openConfirmationDialog: jest.fn() };

const mockApplicationDataManagerService = {
  saveToAppData: () => {},
  listenForAppData: jest.fn(),
};

const mockDeviceDataManagerService = { listenFromDevice: jest.fn(), sendToDevice: () => {} };

describe('FirmwareProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: DeviceDataManagerService, useValue: mockDeviceDataManagerService },
        { provide: ConfirmationDialogService, useValue: mockConfirmationDialogService },
        { provide: FirmwareProgressDialogService, useValue: mockFirmwareProgressDialogService },
        { provide: ApplicationDataManagerService, useValue: mockApplicationDataManagerService },
        { provide: SpinnerService, useValue: { openSpinnerDialog: () => {}, closeSpinnerDialog: () => {} } },
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: FileServiceAdaptor, useValue: {} },
        { provide: Logger, useValue: {} },
      ],
    });
  });

  it('should be created', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    expect(service).toBeTruthy();
  });

  it('should startTimeoutTimer', fakeAsync(() => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    spyOn(service, 'showFailureDialog').and.callThrough();
    mockConfirmationDialogService.openConfirmationDialog.mockImplementation(() => Promise.resolve(true));
    service.startTimeoutTimer();
    tick(900001);
    expect(service.showFailureDialog).toBeCalled();
  }));

  it('should listenToFirmwareCopyStatus', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    spyOn(service, 'showFailureDialog');
    mockApplicationDataManagerService.listenForAppData.mockReturnValue(of(SharedConstants.statusfailure));
    service.listenToFirmwareCopyStatus();
    expect(service.showFailureDialog).toBeCalled();

    mockApplicationDataManagerService.listenForAppData.mockReturnValue(of(100));
    service.isDesktopApp = false;
    mockDeviceDataManagerService.listenFromDevice.mockReturnValue(of(100));
    service.listenToFirmwareCopyStatus();
    expect(service.showFailureDialog).toBeCalledTimes(1);
  });

  it('should listenToFirmwareUpadteSteps', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    spyOn(service, 'showFailureDialog');
    service.listenToFirmwareUpadteSteps();
    expect(service.showFailureDialog).not.toBeCalled();
  });

  it('should showFailureDialog on copy disconnect', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    const spy = jest.spyOn(mockConfirmationDialogService, 'openConfirmationDialog');
    service.showFailureDialog(AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_COPY);
    expect(spy).toBeCalled();
  });

  it('should showFailureDialog on update failure', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    const spy = jest.spyOn(mockConfirmationDialogService, 'openConfirmationDialog');
    service.showFailureDialog(AppConstants.APP_DATA_KEYS.UPDATE_FAILURE_ERROR);
    expect(spy).toBeCalled();
  });

  it('should showFailureDialog on update disconnect', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    const spy = jest.spyOn(mockConfirmationDialogService, 'openConfirmationDialog');
    service.showFailureDialog(AppConstants.APP_DATA_KEYS.DISCONNECT_DURING_UPDATE);
    expect(spy).toBeCalled();
  });

  it('should showFailureDialog on download fail', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    const spy = jest.spyOn(mockConfirmationDialogService, 'openConfirmationDialog');
    service.showFailureDialog(AppConstants.APP_DATA_KEYS.DOWNLOAD_FAILURE_ERROR);
    expect(spy).toBeCalled();
  });

  it('should listenToFirmwareUpadteSteps with reboot', fakeAsync(() => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    spyOn(service, 'resetFirmwareStatusAndSteps').and.callThrough();
    service.showRestartDialogFlag = true;
    mockDeviceDataManagerService.listenFromDevice.mockReturnValue(of('reboot'));
    service.listenToFirmwareUpadteSteps();
    tick(999999999);
    expect(service.resetFirmwareStatusAndSteps).toBeCalled();
  }));

  it('should alwaysListenForFirmwareUpdateStatus', () => {
    const service: FirmwareProgressService = TestBed.get(FirmwareProgressService);
    spyOn(service, 'resetFirmwareStatusAndSteps');
    service.alwaysListenForFirmwareUpdateStatus();
    expect(service.resetFirmwareStatusAndSteps).not.toBeCalled();
  });
});
