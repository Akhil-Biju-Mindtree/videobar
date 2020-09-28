import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkIpStatusComponent } from './network-ip-status.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';

describe('NetworkIpStatusComponent', () => {
  let component: NetworkIpStatusComponent;
  let fixture: ComponentFixture<NetworkIpStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkIpStatusComponent],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: DeviceDataManagerService,
          useValue: { sendToDevice: () => {}, listenFromDevice: () => of('') },
        },
        {
          // I was expecting this will pass the desired value
          provide: ConfirmationDialogService,
          useValue: { openConfirmationDialog: () => {} },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkIpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
