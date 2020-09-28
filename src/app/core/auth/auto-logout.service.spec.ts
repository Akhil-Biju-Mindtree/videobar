import { TestBed } from '@angular/core/testing';

import { AutoLogoutService } from './auto-logout.service';
import { Idle } from '@ng-idle/core';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { Injector } from '@angular/core';
import { of } from 'rxjs';

describe('AutoLogoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: Idle, useValue: {
        setIdle: () => {},
        setTimeout: () => {},
        setInterrupts: () => {},
        onTimeout: {
          subscribe: () => {
            return of('');
          },
        },
      } },
      { provide: DialogService, useValue: {} },
      { provide: Injector, useValue: {} },
    ],
  }));

  it('should be created', () => {
    const service: AutoLogoutService = TestBed.get(AutoLogoutService);
    expect(service).toBeTruthy();
  });
});
