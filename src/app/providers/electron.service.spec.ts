import { TestBed, inject } from '@angular/core/testing';
import { ElectronService } from './electron.service';
import { ErrorService } from '@core/error/error.service';
import { Logger } from '@core/logger/Logger';
import { UtilitiesService } from './utilities.service';
import { DeviceRepository } from '@core/services/deviceRepository.service';
import { ProcessJsonResponseService } from './process-json-response.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

describe('ElectronService', () => {
  let mockService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorService, useValue: {
          showError: () => {},
        } },
        { provide: Logger, useValue: {} },
        { provide: UtilitiesService, useValue: {} },
        { provide: DeviceRepository, useValue: {} },
        { provide: ProcessJsonResponseService, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: {} },
        ElectronService,
      ],
    }),
  );

  beforeEach(inject([ElectronService], (service) => {
    mockService = service;
  }));

  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });
});
