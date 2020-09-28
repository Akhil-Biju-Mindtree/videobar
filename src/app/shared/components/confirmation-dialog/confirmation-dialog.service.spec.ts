import { TestBed, inject } from '@angular/core/testing';

import { ConfirmationDialogService } from './confirmation-dialog.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { of } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

let dialogSpy;
let mockService;
export class MatDialogStub {
  result = true;

  setResult(val: boolean) {
    this.result = val;
  }

  open() {
    return { afterClosed: () => of(this.result) };
  }
  close() {
    return { afterClosed: () => of(this.result) };
  }
  afterClosed() {
    return of(true);
  }
}

describe('ConfirmationDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog,
          useClass: MatDialogStub,
        },
      ],
    });
    mockService = TestBed.get(ConfirmationDialogService);
  });

  beforeEach(() => {
    dialogSpy = jest.spyOn(TestBed.get(MatDialog), 'open');
  });

  beforeEach(inject([ConfirmationDialogService], (service) => {
    mockService = service;
  }));
  it('Should call openConfirmationDialog method', () => {
    const modelData = {
      width: '356px',
      data: {},
      disableClose: true,
      restoreFocus: false,
      panelClass: 'custom-overlay-panel',
      position: {
        top: '3px',
        left: '17%',
      },
    };
    mockService.openConfirmationDialog({});
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, modelData);
  });
});
