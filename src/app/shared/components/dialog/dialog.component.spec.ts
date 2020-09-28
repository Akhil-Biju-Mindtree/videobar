import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WirelessEapPasswordComponent } from './dialog-content/wireless-eap-password/wireless-eap-password.component';
import { of } from 'rxjs';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
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
          useValue: {
            componentToLoad: WirelessEapPasswordComponent,
            buttonLabel: { RefuteButtonLabel: '', confirmButtonLabel: '' },
          },
        },
        {
          // I was expecting this will pass the desired value
          provide: ComponentFactoryResolver,
          useValue: { resolveComponentFactory: () => true },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.viewContainerRef = {
      createComponent: () => {
        return { instance: { formGroup: { statusChanges: of('VALID') } } };
      },
    } as any;
    component.isFormInValid = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
