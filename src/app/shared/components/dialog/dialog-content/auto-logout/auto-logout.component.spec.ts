import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLogoutComponent } from './auto-logout.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@core/auth/auth.service';
import { AuthServiceMock } from '../../../../../../mocks/auth.service.mock';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { TimeCounterPipe } from '@shared/pipes/time-counter.pipe';

describe('AutoLogoutComponent', () => {
  let component: AutoLogoutComponent;
  let fixture: ComponentFixture<AutoLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoLogoutComponent, TimeCounterPipe],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {},
          },
        },
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: [],
        },
        {
          // I was expecting this will pass the desired value
          provide: AuthService,
          useValue: AuthServiceMock,
        },
        {
          // I was expecting this will pass the desired value
          provide: DeviceDataManagerService,
          useValue: { sendToDevice: () => of('') },
        },
        {
          // I was expecting this will pass the desired value
          provide: Router,
          useValue: {},
        },
        {
          // I was expecting this will pass the desired value
          provide: Idle,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLogoutComponent);
    component = fixture.componentInstance;
    component.timeCountDown = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
