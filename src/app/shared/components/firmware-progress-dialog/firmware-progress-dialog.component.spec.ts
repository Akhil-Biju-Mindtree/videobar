import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmwareProgressDialogComponent } from './firmware-progress-dialog.component';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { of } from 'rxjs';

const model = {};
describe('FirmwareProgressDialogComponent', () => {
  let component: FirmwareProgressDialogComponent;
  let fixture: ComponentFixture<FirmwareProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirmwareProgressDialogComponent],
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
          provide: ApplicationDataManagerService,
          useValue: {
            listenForAppData: () => of(''),
            saveToAppData: () => {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwareProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ngOnInit', () => {
    expect(component.ngOnInit).toBeTruthy();
  });
});
