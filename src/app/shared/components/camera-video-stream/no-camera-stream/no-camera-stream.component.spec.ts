import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCameraStreamComponent } from './no-camera-stream.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { MapperService } from '@core/services/mapper.service';
import { of } from 'rxjs';

describe('NoCameraStreamComponent', () => {
  let component: NoCameraStreamComponent;
  let fixture: ComponentFixture<NoCameraStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoCameraStreamComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of(''), sendToDevice: () => {} } },
        {
          provide: MapperService,
          useValue: {
            findObjectFromJSONMapper: () => {
              return { range_min: '', range_max: '' };
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCameraStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
