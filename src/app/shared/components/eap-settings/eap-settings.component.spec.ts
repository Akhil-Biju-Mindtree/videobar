import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EapSettingsComponent } from './eap-settings.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';

describe('EapSettingsComponent', () => {
  let component: EapSettingsComponent;
  let fixture: ComponentFixture<EapSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EapSettingsComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
