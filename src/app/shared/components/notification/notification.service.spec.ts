import { NotificationService } from './notification.service';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('Service: NotificationService', () => {
  let mockService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    mockService = TestBed.get(NotificationService);
  });
  it('NotificationService', () => {
    expect(mockService).toBeTruthy();
  });
});
