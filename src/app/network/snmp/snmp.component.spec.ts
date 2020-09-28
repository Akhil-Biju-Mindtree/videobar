import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SnmpComponent } from './snmp.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { FormControl, FormBuilder } from '@angular/forms';
import { SnmpSettings } from '../network.constant';

describe('SnmpComponent', () => {
  let component: SnmpComponent;
  let fixture: ComponentFixture<SnmpComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const snmpSettingUuid = SnmpSettings.LABEL_UUID;
  const snmpId = {};
  snmpId[snmpSettingUuid[0].uuid] = 'none';
  snmpId[snmpSettingUuid[1].uuid] = 'bose';
  snmpId[snmpSettingUuid[2].uuid] = '';
  snmpId[snmpSettingUuid[3].uuid] = 'DES';
  snmpId[snmpSettingUuid[4].uuid] = '';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnmpComponent],
      imports: [],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } },
        { provide: FormBuilder, useValue: formBuilder },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnmpComponent);
    component = fixture.componentInstance;
    component.snmpForm = formBuilder.group(snmpId);
    component.initialSnmpSettings = snmpId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is value change method should return true on value not changed in form', () => {
    const expectedResult = component.isValueChange();
    expect(expectedResult).toBeTruthy();
  });

  it('is value change method should return false on value change in form', () => {
    component.snmpForm.get('8d20fab2-65ab-44fe-85d1-2df6fd5de885').setValue('Bose@123');
    const expectedResult = component.isValueChange();
    expect(expectedResult).toBeFalsy();
  });
});
