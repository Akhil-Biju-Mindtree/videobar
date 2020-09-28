import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessComponent } from './user-access.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { of } from 'rxjs';

describe('UserAccessComponent', () => {
  let component: UserAccessComponent;
  let fixture: ComponentFixture<UserAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserAccessComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of() } },
        { provide: ConfirmationDialogService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
