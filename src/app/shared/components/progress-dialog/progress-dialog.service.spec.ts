import { TestBed, inject } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { of } from 'rxjs';
import { ProgressDialogService } from './progress-dialog.service';
import { ProgressDialogComponent } from './progress-dialog.component';

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

describe('ProgressDialogService', () => {
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
    mockService = TestBed.get(ProgressDialogService);
  });

  beforeEach(() => {
    dialogSpy = jest.spyOn(TestBed.get(MatDialog), 'open');
  });

  beforeEach(inject([ProgressDialogService], (service) => {
    mockService = service;
  }));
  it('Should call openConfirmationDialog method', () => {
    const modelData = {
      width: '356px',
      data: {},
      disableClose: true,
      restoreFocus: false,
      height: '102px',
      position: {
        top: '3px',
        left: '17%',
      },
    };
    mockService.openProgressDialog({});
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(ProgressDialogComponent, modelData);
  });
});
