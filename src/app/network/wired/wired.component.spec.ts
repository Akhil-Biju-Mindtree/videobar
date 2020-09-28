import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WiredComponent } from './wired.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('WiredComponent', () => {
  let component: WiredComponent;
  let fixture: ComponentFixture<WiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WiredComponent],
      imports: [],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } },
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
