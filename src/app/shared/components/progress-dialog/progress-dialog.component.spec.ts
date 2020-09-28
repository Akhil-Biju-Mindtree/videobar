import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressDialogComponent } from './progress-dialog.component';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
const model = {};
describe('FirmwareProgressDialogComponent', () => {
  let component: ProgressDialogComponent;
  let fixture: ComponentFixture<ProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressDialogComponent],
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
          useValue: [],
        },
        {
          provide: DeviceDataManagerService,
          useValue: { listenFromDevice: () => of('') },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressDialogComponent);
    component = fixture.componentInstance;
    component.unsubscribe = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ngOnInit', () => {
    expect(component.ngOnInit).toBeTruthy();
  });
});
