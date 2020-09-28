import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'app/shared/modules/material.module';
import { ToggleButtonComponent } from './toggle-button.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';

describe('ToggleButtonComponent', () => {
  let component: ToggleButtonComponent;
  let fixture: ComponentFixture<ToggleButtonComponent>;
  const expectedInput = {
    uuid: 'uuid',
    label: 'label',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ToggleButtonComponent],
      providers: [
        {
          provide: DeviceDataManagerService,
          useValue: {
            listenFromDevice: () => of(''),
            sendToDevice: () => {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleButtonComponent);
    component = fixture.componentInstance;
    component.uuid = expectedInput.uuid;
    component.label = expectedInput.label;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
