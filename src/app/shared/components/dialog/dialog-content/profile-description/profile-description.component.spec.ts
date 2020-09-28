import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDescriptionComponent } from './profile-description.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { ServiceAdapter } from '@providers/service-adapter';
import { Logger } from '@core/logger/Logger';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ErrorService } from '@core/error/error.service';
import { CachingService } from '@core/services/caching.service';
import { MapperService } from '@core/services/mapper.service';

describe('ProfileDescriptionComponent', () => {
  let component: ProfileDescriptionComponent;
  let fixture: ComponentFixture<ProfileDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDescriptionComponent],
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
          provide: SpinnerService,
          useValue: { openSpinnerDialog: () => {}, closeSpinnerDialog: () => {} },
        },
        {
          // I was expecting this will pass the desired value
          provide: ServiceAdapter,
          useValue: {
            remote: {
              app: {
                getPath: () => {
                  return '';
                },
              },
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
        {
          // I was expecting this will pass the desired value
          provide: Logger,
          useValue: {},
        },
        {
          // I was expecting this will pass the desired value
          provide: NotificationService,
          useValue: { showNotification: () => {} },
        },
        {
          // I was expecting this will pass the desired value
          provide: ErrorService,
          useValue: { showError: () => {} },
        },
        {
          // I was expecting this will pass the desired value
          provide: CachingService,
          useValue: { getAllFromCache: () => of('') },
        },
        {
          // I was expecting this will pass the desired value
          provide: MapperService,
          useValue: {},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [[ReactiveFormsModule, FormsModule]],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDescriptionComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      descriptionControl: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
