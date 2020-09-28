import { TestBed } from '@angular/core/testing';

import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {

  let service: UtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(UtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generateTransactionId: ', () => {
    const expected = 6;
    const transactionId = service.generateTransactionId();
    expect(transactionId.length).toEqual(expected);
  });

  it('generateMd5Hash: ', () => {
    const expected = 'BC8B1628901369D49AA4CEF8E687AF58';
    const passwrd = 'Bose123!';
    const hashStr = service.generateMd5Hash(passwrd);
    expect(hashStr).toEqual(expected);
  });

});
