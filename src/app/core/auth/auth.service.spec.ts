import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { CachingService } from '@core/services/caching.service';
import { CookieService } from 'ngx-cookie-service';
import { Injector } from '@angular/core';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { MapperService } from '@core/services/mapper.service';
import { AppCheckService } from 'app/settings/app-check.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ApplicationDataManagerService, useValue: {} },
      { provide: CachingService, useValue: {} },
      { provide: CookieService, useValue: {} },
      { provide: Injector, useValue: {} },
      { provide: SpinnerService, useValue: {} },
      { provide: MapperService, useValue: {} },
      { provide: AppCheckService, useValue: {} },
    ],
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
