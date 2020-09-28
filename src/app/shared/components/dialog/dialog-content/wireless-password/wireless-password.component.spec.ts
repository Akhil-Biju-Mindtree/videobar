import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WirelessPasswordComponent } from './wireless-password.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkService } from 'app/network/network.service';
import { FormGroup, FormControl } from '@angular/forms';

describe('WirelessPasswordComponent', () => {
  let component: WirelessPasswordComponent;
  let fixture: ComponentFixture<WirelessPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WirelessPasswordComponent],
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
    fixture = TestBed.createComponent(WirelessPasswordComponent);
    component = fixture.componentInstance;
    component.securityType = 'psk';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on changes show initailize the fields', () => {
    const spyInit = spyOn(component, 'initFormField');
    component.ngOnChanges();
    expect(spyInit).toBeCalledTimes(1);
  });

  it('on form submit for wep network should save in the form', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.data.value.securityType = 'PSK';
    component.onSubmitDialog();
    expect(spySendToDevice).toBeCalledTimes(4);
  });

  it('on form close should close the form', () => {
    const spyDialogClose = spyOn(TestBed.get(MatDialogRef), 'close');
    component.onCloseDialog();
    expect(spyDialogClose).toBeCalledTimes(1);
  });

  it('on wep security type show checnge the input min and max', () => {
    component.securityType = null;
    component.data.value.securityType = 'wep';
    component.initFormField();
    expect(component.minLength).toEqual(1);
    expect(component.maxLength).toEqual(20);
  });

  it('on show password is checcked show switch from password type to text', () => {
    component.inputType = 'password';
    component.onCheckShowPassword();
    expect(component.inputType).toEqual('text');
  });

  it('on show password is uncheccked show switch from text type to password', () => {
    const text = 'text';
    component.inputType = text;
    component.onCheckShowPassword();
    expect(component.inputType).toEqual('password');
  });

  it('show throw invalid if field is dirty invalid and touched', () => {
    component.formControl.markAsDirty();
    component.formControl.markAsUntouched();
    const expectResult = component.isInValid();
    expect(expectResult).toBeFalsy();
  });

  afterAll(() => {
    component.formGroup = new FormGroup({});
    component.securityType = null;
    component.ngOnInit();
    component.ngOnChanges();
  });
});
