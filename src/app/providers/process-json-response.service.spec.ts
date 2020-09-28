import { TestBed } from '@angular/core/testing';
import { ProcessJsonResponseService } from './process-json-response.service';
import { ErrorService } from '@core/error/error.service';
import { Logger } from '@core/logger/Logger';
import { CachingService } from '@core/services/caching.service';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { AuthService } from '@core/auth/auth.service';
import { MapperService } from '@core/services/mapper.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { of } from 'rxjs/internal/observable/of';

describe('ProcessJsonResponseService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: Logger, useValue: {} },
        { provide: CachingService, useValue: {} },
        { provide: SpinnerService, useValue: {} },
        { provide: ErrorService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: MapperService, useValue: {} },
        { provide: ErrorService, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: { listenForAppData: () => of('') } },
        ProcessJsonResponseService,
      ],
    }),
  );

  it('should be created', () => {
    const service: ProcessJsonResponseService = TestBed.get(ProcessJsonResponseService);
    expect(service).toBeTruthy();
  });
});
