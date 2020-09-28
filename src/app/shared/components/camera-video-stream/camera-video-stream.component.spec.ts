import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraVideoStreamComponent } from './camera-video-stream.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorService } from '@core/error/error.service';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '@providers/utilities.service';
import { MediaObserver } from '@angular/flex-layout';
import { ServiceAdapter } from '@providers/service-adapter';
import { Logger } from '@core/logger/Logger';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

describe('CameraVideoStreamComponent', () => {
  let component: CameraVideoStreamComponent;
  let fixture: ComponentFixture<CameraVideoStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CameraVideoStreamComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } },
        {
          provide: ServiceAdapter,
          useValue: {
            remote: {
              getCurrentWindow: () => {
                return {
                  getTitle: () => {
                    return '';
                  },
                };
              },
            },
          },
        },
        { provide: Logger, useValue: {} },
        { provide: UtilitiesService, useValue: {} },
        { provide: MediaObserver, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: { listenForAppData: () => of('') } },
        { provide: ErrorService, useValue: {} },
        { provide: ActivatedRoute, useValue: { parent: { url: { value: [{ path: '' }] } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraVideoStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
