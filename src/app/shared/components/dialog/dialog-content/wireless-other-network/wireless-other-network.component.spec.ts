import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WirelessOtherNetworkComponent } from './wireless-other-network.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { NetworkService } from 'app/network/network.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { NetworkConstant } from 'app/network/network.constant';

describe('WirelessOtherNetworkComponent', () => {
  let component: WirelessOtherNetworkComponent;
  let fixture: ComponentFixture<WirelessOtherNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WirelessOtherNetworkComponent],
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
    fixture = TestBed.createComponent(WirelessOtherNetworkComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({ 'db8af48e-7e03-4b22-8e15-5e3779474365': new FormControl('') });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on security type change from none to psk should change the security type', () => {
    component.onSecurityType({ value: 'psk' }, component.otherNetwork[1].uuid);
    expect(component.formGroup.get(component.otherNetwork[1].uuid).value).toEqual('psk');
  });

  it('on security type change from eap to psk should change the security type', () => {
    component.eapSettings.forEach((setting: any) => {
      component.formGroup.addControl(setting.uuid, new FormControl({}));
    });
    component.onSecurityType({ value: 'psk' }, component.otherNetwork[1].uuid);
    expect(component.formGroup.get(component.otherNetwork[1].uuid).value).toEqual('psk');
  });

  it('on form submit for none network should save in the form', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.onSubmitDialog();
    expect(spySendToDevice).toBeCalledTimes(3);
  });

  it('on form submit for wep network should save in the form', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_SECURITY).setValue('wep');
    component.formGroup.addControl(NetworkConstant.UUID.WIFI.WIFI_PASSWORD, new FormControl('abcd'));
    component.onSubmitDialog();
    expect(spySendToDevice).toBeCalledTimes(4);
  });

  it('on form submit for eap network should save in the form', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.formGroup.get(NetworkConstant.UUID.WIFI.WIFI_SECURITY).setValue('eap');
    component.eapSettings.forEach((setting: any) => {
      component.formGroup.addControl(setting.uuid, new FormControl(''));
    });
    component.onSubmitDialog();
    expect(spySendToDevice).toBeCalledTimes(9);
  });

  it('on form close should close the form', () => {
    const spyDialogClose = spyOn(TestBed.get(MatDialogRef), 'close');
    component.onCloseDialog();
    expect(spyDialogClose).toBeCalledTimes(1);
  });
});
