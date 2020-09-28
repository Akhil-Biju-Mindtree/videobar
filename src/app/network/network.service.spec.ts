import { TestBed } from '@angular/core/testing';

import { NetworkService } from './network.service';

describe('NetworkService', () => {
  let  service: NetworkService;

  beforeAll(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(NetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get join network clicked subject value', () => {
    const expected = true;
    service.isJoinToNetworkClicked.next(expected);
    const joinClicked = service.getIsJoinToNetworkClicked();
    expect(joinClicked.getValue()).toEqual(expected);
  });

  it('should set join network clicked subject', () => {
    const expected = false;
    service.setIsJoinToNetworkClicked(expected);
    expect(service.isJoinToNetworkClicked.getValue()).toEqual(expected);
  });

  it('should get closed pop-up clicked subject value', () => {
    const expected = true;
    service.isClosedClicked.next(expected);
    const closedClicked = service.getIsClosedClicked();
    expect(closedClicked.getValue()).toEqual(expected);
  });

  it('should set close pop-up clicked subject', () => {
    const expected = false;
    service.setIsClosedClicked(expected);
    expect(service.isClosedClicked.getValue()).toEqual(expected);
  });
});
