import { TestBed } from '@angular/core/testing';
import { Logger } from '@core/logger/Logger';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { SocketService } from './socket.service';
import { ErrorService } from '@core/error/error.service';
import { ProcessJsonResponseService } from './process-json-response.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { AuthService } from '@core/auth/auth.service';

describe('SocketService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: ProcessJsonResponseService, useValue: {} },
        { provide: Logger, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: { saveToAppData: () => {} } },
        { provide: ErrorService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: AuthService, useValue: {} },
        SocketService,
      ],
    }),
  );

  it('should be created', () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});
