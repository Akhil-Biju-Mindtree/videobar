import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CachingService } from './caching.service';
import { StoresService } from './../store/stores.service';

let spyObj;
class MockStoreService {
  setToStore(data) {
    return true;
  }
  getFromStore(key) {
    const data = { key: '123' };
    return of(data);
  }
  clearStore() {
    return true;
  }
  getAllFromStore() {
    const data = { key1: '123', key2: '45' };
    return of(data);
  }
}
let mockService;
describe('CachingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CachingService, { provide: StoresService, useClass: MockStoreService }],
    });
    mockService = TestBed.get(CachingService);
  });

  beforeEach(() => {
    spyObj = jest.spyOn(TestBed.get(StoresService), 'clearStore');
  });

  beforeEach(inject([CachingService], (service) => {
    mockService = service;
  }));

  it('Should have cache service', () => {
    expect(mockService).toBeTruthy();
  });
  it('Should call setToCache method', () => {
    expect(mockService.setToCache({ firmwareVersion: '123' }));
  });
  it('Should call getFromCache method', () => {
    mockService.getFromCache('firmwareVersion').subscribe((data) => {
      expect(data).toEqual({ firmwareVersion: '123' });
    });
  });
  it('Should call getAllFromCache methoed', () => {
    mockService.getAllFromCache().subscribe((data) => {
      expect(data).toBeDefined();
    });
  });
  it('Should call clearCache method', () => {
    mockService.clearCache();
    expect(spyObj).toHaveBeenCalled();
  });
});
