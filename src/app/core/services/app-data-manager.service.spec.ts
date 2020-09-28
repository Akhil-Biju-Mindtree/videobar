import { inject, TestBed } from '@angular/core/testing';
import { ApplicationDataManagerService } from './app-data-manager.service';
import { of } from 'rxjs';
import { CachingService } from './caching.service';
import { ServiceAdapter } from '@providers/service-adapter';

class MockCacheService {
  setToCache(data) {
    return true;
  }
  getFromCache(key) {
    const data = { key: '123' };
    return of(data);
  }
}

let mockService;
describe('App data manager service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationDataManagerService,
        { provide: CachingService, useClass: MockCacheService },
      ],
    });
  });

  beforeEach(inject([ApplicationDataManagerService], (service) => {
    mockService = service;
  }));

  it('Should have app manager service', () => {
    expect(mockService).toBeTruthy();
  });
  it('Should call saveToApplicationData method', () => {
    const spyObjCacheService = jest.spyOn(TestBed.get(CachingService), 'setToCache');
    mockService.saveToAppData({ firmwareVersion: '123' });
    expect(spyObjCacheService).toHaveBeenCalled();
  });
  it('Should call listenForApplicationData method', () => {
    mockService.listenForAppData('firmwareVersion').subscribe((data) => {
      expect(data).toEqual({ firmwareVersion: '123' });
    });
  });
});
