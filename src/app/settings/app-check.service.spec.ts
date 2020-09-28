import { inject, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { AppCheckService } from './app-check.service';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';
import { ConnectionDetectionService } from '@core/services/connection-detection.service';
import { Logger } from '@core/logger/Logger';

let mockService;
describe('app check service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppCheckService,
        {
          provide: ConnectionDetectionService,
          useValue: {
            getConnectionStatus: () => {
              return of('');
            },
          },
        },
        {
          provide: HttpClientWrapperService,
          useValue: {
            fetchVersionedLink: () => {
              return of('');
            },
          },
        },
        { provide: Logger, useValue: {} },
      ],
    });
  });

  beforeEach(inject([AppCheckService], (service, mockhttp) => {
    mockService = service;
  }));

  it('Should have app check service', () => {
    expect(mockService).toBeTruthy();
  });

  it('Should call checkApp method', () => {
    const spyObj = jest.spyOn(TestBed.get(HttpClientWrapperService), 'fetchVersionedLink');
    mockService.checkApp();
    expect(spyObj).toHaveBeenCalled();
  });

  it('Should call compareAppVersion method', () => {
    const resData = mockService.compareAppVersion();
    expect(resData).toEqual(false);
  });

  it('Should call compareAppVersion method when version v1 are not string', () => {
    const resData = mockService.compareAppVersion(1, '2');
    expect(resData).toEqual(false);
  });

  it('Should call compareAppVersion method when version v2 are not string', () => {
    const resData = mockService.compareAppVersion('1', 2);
    expect(resData).toEqual(false);
  });

  it('Should call compareAppVersion method when version are not string', () => {
    const resData = mockService.compareAppVersion('1.10.0', '1.10.1');
    expect(resData).toEqual(-1);
  });

  it('Should call compareAppVersion method when v1 > v2 ', () => {
    const resData = mockService.compareAppVersion('1.10.2', '1.10.1');
    expect(resData).toEqual(1);
  });

  it('Should call compareAppVersion method when versions are valid', () => {
    const resData = mockService.compareAppVersion('0.9.0_a1c011e', '0.9.0_a1c011e');
    expect(resData).toEqual(0);
  });

  it('Should call isAppUpToDate method ', () => {
    const isUpdateSpy: BehaviorSubject<Object> = new BehaviorSubject<Object>({
      isUpToDate: true,
      noConnection: true,
      details: null,
    });
    const resData = mockService.isAppUpToDate();
    expect(resData).toEqual(isUpdateSpy.asObservable());
  });
});
