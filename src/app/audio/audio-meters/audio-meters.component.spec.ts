import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AudioMetersComponent } from './audio-meters.component';

import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs/internal/observable/of';

describe('AudioMetersComponent', () => {
  let component: AudioMetersComponent;
  let fixture: ComponentFixture<AudioMetersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioMetersComponent],
      imports: [],
      providers: [
        { provide: DeviceDataManagerService, useValue: { sendToDevice: () => of('') } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioMetersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
