import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemComponent } from './system.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AuthService } from '@core/auth/auth.service';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { DownloadlogsService } from './downloadlogs.service';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { ServiceAdapter } from '@providers/service-adapter';
import { Router } from '@angular/router';

describe('SystemComponent', () => {
  let component: SystemComponent;
  let fixture: ComponentFixture<SystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of() } },
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: SpinnerService, useValue: {} },
        { provide: DialogService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: FileServiceAdaptor, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: {} },
        { provide: ServiceAdapter, useValue: {} },
        { provide: DownloadlogsService, useValue: {} },
        { provide: HttpClientWrapperService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
