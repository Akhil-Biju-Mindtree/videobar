import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabSmartButtonComponent } from './fab-smart-button.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';
import { FabMiniModel } from '@shared/models/fab.model';
import { LowLightConstant } from '../low-light-compensation/low-light-compensation.constant';

describe('FabSmartButtonComponent', () => {
  let component: FabSmartButtonComponent;
  let fixture: ComponentFixture<FabSmartButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FabSmartButtonComponent],
      providers: [{ provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } }],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabSmartButtonComponent);
    component = fixture.componentInstance;
    component.fabMiniStyles = new FabMiniModel(
      LowLightConstant.lowLightCorrectionOnStyles,
      LowLightConstant.lowLightCorrectionOffStyles,
      LowLightConstant.lowLightDirectvieStyles,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
