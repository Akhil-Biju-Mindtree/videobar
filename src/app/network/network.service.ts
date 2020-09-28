import { Injectable } from '@angular/core';
import { NetworkModule } from './network.module';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class NetworkService {
  isJoinToNetworkClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isClosedClicked: BehaviorSubject<boolean> = new BehaviorSubject(true);

  setIsJoinToNetworkClicked(isJoinToNetworkClicked: boolean) {
    this.isJoinToNetworkClicked.next(isJoinToNetworkClicked);
  }
  getIsJoinToNetworkClicked(): BehaviorSubject<boolean> {
    return this.isJoinToNetworkClicked;
  }

  setIsClosedClicked(isClosedCliked: boolean) {
    this.isClosedClicked.next(isClosedCliked);
  }

  getIsClosedClicked(): BehaviorSubject<boolean> {
    return this.isClosedClicked;
  }

  constructor() { }
}
