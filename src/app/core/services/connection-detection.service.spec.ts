import { inject, TestBed } from '@angular/core/testing';
import { ConnectionDetectionService } from './connection-detection.service';

let mockService;
describe('ConnectionDetectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectionDetectionService],
    });
  });

  beforeEach(inject([ConnectionDetectionService], (service) => {
    mockService = service;
  }));

  it('Should have ConnectionDetection service', () => {
    expect(mockService).toBeTruthy();
  });
  it('Should call setConnectionStatus method', () => {
    mockService.setConnectionStatus('offline');
    mockService.getConnectionStatus().subscribe((data) => {
      expect(data).toEqual('offline');
    });
  });

  it('Should call setConnectionStatus method', () => {
    const online = 'online';
    mockService.setConnectionStatus(online);
    mockService.getConnectionStatus().subscribe((data) => {
      expect(data).toEqual('online');
    });
  });
});
