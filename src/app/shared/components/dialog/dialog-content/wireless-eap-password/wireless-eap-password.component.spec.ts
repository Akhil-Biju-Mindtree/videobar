import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WirelessEapPasswordComponent } from './wireless-eap-password.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NetworkService } from 'app/network/network.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

describe('WirelessEapPasswordComponent', () => {
  let component: WirelessEapPasswordComponent;
  let fixture: ComponentFixture<WirelessEapPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WirelessEapPasswordComponent],
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
          useValue: { value: { DESCRIPTION: '' } },
        },
        {
          // I was expecting this will pass the desired value
          provide: DeviceDataManagerService,
          useValue: { sendToDevice: () => {} },
        },
        {
          // I was expecting this will pass the desired value
          provide: NetworkService,
          useValue: { setIsJoinToNetworkClicked: () => {}, setIsClosedClicked: () => {} },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WirelessEapPasswordComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({ 'f02c82c9-5e3d-4660-8bec-1f681bc78e6d': new FormControl('') });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
