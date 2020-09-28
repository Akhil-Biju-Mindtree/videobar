import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkIpSettingsComponent } from './network-ip-settings.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { Logger } from '@core/logger/Logger';
import { of } from 'rxjs';
import { NetworkConstant } from 'app/network/network.constant';

describe('NetworkIpSettingsComponent', () => {
  let component: NetworkIpSettingsComponent;
  let fixture: ComponentFixture<NetworkIpSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkIpSettingsComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
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
        { provide: Logger, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkIpSettingsComponent);
    component = fixture.componentInstance;
    component.ipSettingUUID = NetworkConstant.UUID.WIRED;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
