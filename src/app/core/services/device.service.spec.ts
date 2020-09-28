import { inject, TestBed } from '@angular/core/testing';
import { DeviceService } from './device.service';
import { ServiceAdapter } from '@providers/service-adapter';
import { MapperService } from './mapper.service';
import { Logger } from '@core/logger/Logger';
import { ErrorService } from '@core/error/error.service';
import { ProcessJsonResponseService } from '@providers/process-json-response.service';
import { ApplicationDataManagerService } from './app-data-manager.service';
import { AuthService } from '@core/auth/auth.service';

let mockService;
describe('DeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceService,
        { provide: ServiceAdapter, useValue: {} },
        { provide: MapperService, useValue: {} },
        { provide: ErrorService, useValue: {} },
        { provide: Logger, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: ProcessJsonResponseService, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: {} },
      ],
    });
  });

  beforeEach(inject([DeviceService], (service) => {
    mockService = service;
  }));

  it('Should have Device service', () => {
    expect(mockService).toBeTruthy();
  });
});
