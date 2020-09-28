import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraSettingsPresetComponent } from './camera-settings-preset.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { MapperService } from '@core/services/mapper.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

describe('CameraSettingsPresetComponent', () => {
  let component: CameraSettingsPresetComponent;
  let fixture: ComponentFixture<CameraSettingsPresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CameraSettingsPresetComponent],
      providers: [
        { provide: MapperService, useValue: {} },
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of(''), sendToDevice: () => of('') } },
        { provide: ConfirmationDialogService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraSettingsPresetComponent);
    component = fixture.componentInstance;
    component.restoreDefault = new Observable<any>();
    component.controls = [{ label: 'preset1', uuid: '', minValue: 1, maxValue: 10, value: 3, preset: 'preset1' }];
    component.preset = {
      label: 'preset1',
      uuid: '',
      successMessage: 'success',
      presetId: 'preset1',
      savePresetuuid: 'preset1',
    };
    component.parentForm = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
