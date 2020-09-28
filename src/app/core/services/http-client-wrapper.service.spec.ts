import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpClientWrapperService } from './http-client-wrapper.service';

describe('HttpClientWrapperService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
    });

  });

  it('should be created', () => {
    const service: HttpClientWrapperService = TestBed.get(HttpClientWrapperService);
    expect(service).toBeTruthy();
  });

  it('get', () => {
    const service: HttpClientWrapperService = TestBed.get(HttpClientWrapperService);
    const obj = service.get('file.txt');
    expect(obj instanceof Observable).toEqual(true);
  });

  it('getFile', () => {
    const service: HttpClientWrapperService = TestBed.get(HttpClientWrapperService);
    const obj = service.getFile('file.txt');
    expect(obj instanceof Observable).toEqual(true);
  });

  it('uploadImageFile', () => {
    const service: HttpClientWrapperService = TestBed.get(HttpClientWrapperService);
    const obj = service.uploadImageFile('file.txt', 'passwd');
    expect(obj instanceof Observable).toEqual(true);
  });

  it('getDeviceLogs', () => {
    const service: HttpClientWrapperService = TestBed.get(HttpClientWrapperService);
    const obj = service.getDeviceLogs('passwd');
    expect(obj instanceof Observable).toEqual(true);
  });

});
