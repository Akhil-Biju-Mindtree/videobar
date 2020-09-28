import { TestBed, inject } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { of } from 'rxjs';
import { ErrorService } from '@core/error/error.service';
import { SpinnerService } from './app-spinner.service';
import { AppSpinnerComponent } from './app-spinner.component';
import { NotificationService } from '../notification/notification.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

let mockService;
let dialogSpy;
class ErrorServiceMock {
  showError(data) {
    return true;
  }
}
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

describe('SpinnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog,
          useClass: MatDialogStub,
        },
        { provide: ErrorService, useClass: ErrorServiceMock },
        { provide: ApplicationDataManagerService, useValue: {} },
        { provide: NotificationService, useValue: { showNotification: () => {} } },
      ],
    });
    mockService = TestBed.get(SpinnerService);
  });

  beforeEach(() => {
    dialogSpy = jest.spyOn(TestBed.get(MatDialog), 'open');
  });

  beforeEach(inject([SpinnerService], (service) => {
    mockService = service;
  }));
  it('Should call openConfirmationDialog method', () => {
    mockService.spinnerInvokedCount = 0;
    mockService.timerInvokedCount = 0;
    const modelData = {
      width: '180px',
      height: '148px',
      data: {},
      disableClose: true,
      restoreFocus: false,
      position: {
        top: '3px',
        left: '31%',
      },
    };
    mockService.openSpinnerDialog({});
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(AppSpinnerComponent, modelData);
  });
});
