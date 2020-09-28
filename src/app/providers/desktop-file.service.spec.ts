import { DesktopFileService } from './desktop-file.service';
import { ServiceAdapter } from './service-adapter';
import { TestBed, inject } from '@angular/core/testing';

describe('DesktopFileService', () => {
  let mockService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: ServiceAdapter, useValue: {} },
        DesktopFileService,
      ],
    }),
  );

  beforeEach(inject([DesktopFileService], (service) => {
    mockService = service;
  }));

  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });
});
