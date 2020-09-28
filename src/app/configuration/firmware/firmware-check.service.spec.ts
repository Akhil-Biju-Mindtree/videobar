import { TestBed } from '@angular/core/testing';
import { FirmwareCheckService } from './firmware-check.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConnectionDetectionService } from '@core/services/connection-detection.service';
import { Logger } from '@core/logger/Logger';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { of } from 'rxjs';

describe('FirmwareCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } },
        { provide: ConnectionDetectionService, useValue: {} },
        { provide: HttpClientWrapperService, useValue: { fetchVersionedLink: () => of({ requestVersion: '0.10.0' }) } },
        { provide: Logger, useValue: {} },
      ],
    });
  });

  it('should be created', () => {
    const service: FirmwareCheckService = TestBed.get(FirmwareCheckService);
    expect(service).toBeTruthy();
  });

  it('should compare versions', () => {
    const service: FirmwareCheckService = TestBed.get(FirmwareCheckService);
    const run1 = service.compareVersion(0, 0);
    expect(run1).toBe(false);
    const run2 = service.compareVersion('0', 0);
    expect(run2).toBe(false);
    const run3 = service.compareVersion('0.12.9', '0.12.6');
    expect(run3).toBe(1);
    const run4 = service.compareVersion('0.12.3', '0.12.6');
    expect(run4).toBe(-1);
    const run5 = service.compareVersion('0.12.3', '0.12.3');
    expect(run5).toBe(0);
    const run6 = service.compareVersion('0.3', '0.12.3');
    expect(run6).toBe(-1);
  });

  it('should check Firmware', () => {
    const service: FirmwareCheckService = TestBed.get(FirmwareCheckService);
    spyOn(service, 'compareVersion');
    service.currentFirmwareVersion = '0.10.1';
    service.checkFirmware();
    expect(service.compareVersion).toHaveBeenCalledWith('0.10.1', '0.10.0');
  });
});
