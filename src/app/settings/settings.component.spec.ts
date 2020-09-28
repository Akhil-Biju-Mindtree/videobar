import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ServiceAdapter } from '@providers/service-adapter';
import { Logger } from '@core/logger/Logger';
import { AppCheckService } from './app-check.service';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of, Subject } from 'rxjs';
import { FirmwareCheckService } from 'app/configuration/firmware/firmware-check.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from '@core/auth/auth.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AuthServiceMock } from '../../mocks/auth.service.mock';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } },
        { provide: ServiceAdapter, useValue: {} },
        { provide: Logger, useValue: {} },
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: AuthService, useValue: AuthServiceMock },
        { provide: ApplicationDataManagerService, useValue: {} },
        { provide: AppCheckService, useValue: { isAppUpToDate: () => of('') } },
        { provide: HttpClientWrapperService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: FirmwareCheckService, useValue: { isFirmwareUpToDate: () => of('') } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    component.unsubscribe = new Subject<void>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
