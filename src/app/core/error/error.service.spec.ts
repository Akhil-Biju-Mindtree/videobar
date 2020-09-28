import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Logger } from '@core/logger/Logger';

describe('ErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: NotificationService, useValue: {} },
      { provide: Logger, useValue: {} },
    ],
  }));

  it('should be created', () => {
    const service: ErrorService = TestBed.get(ErrorService);
    expect(service).toBeTruthy();
  });
});
