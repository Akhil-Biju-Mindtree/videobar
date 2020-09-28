import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwareComponent } from './firmware.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { FirmwareCheckService } from './firmware-check.service';
import { AuthService } from '@core/auth/auth.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { FirmwareProgressDialogService } from '@shared/components/firmware-progress-dialog/firmware-progress-dialog.service';
import { ServiceAdapter } from '@providers/service-adapter';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { FirmwareProgressService } from './firmware-progress.service';
import { Logger } from '@core/logger/Logger';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('FirmwareComponent', () => {
  let component: FirmwareComponent;
  let fixture: ComponentFixture<FirmwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirmwareComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of() } },
        { provide: FileServiceAdaptor, useValue: {} },
        { provide: HttpClientWrapperService, useValue: {} },
        {
          provide: FirmwareCheckService,
          useValue: { isFirmwareUpToDate: () => of({ isUpToDate: true, noConnection: true, details: null }) },
        },
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: FirmwareProgressDialogService, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: {} },
        { provide: ServiceAdapter, useValue: {} },
        { provide: Logger, useValue: {} },
        { provide: FirmwareProgressService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
