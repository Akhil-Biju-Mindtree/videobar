import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionDetectionService {
  private connectionStatus: Subject<string> = new Subject<string>();

  constructor() {}

  setConnectionStatus(value: string) {
    this.connectionStatus.next(value);
  }

  getConnectionStatus(): Observable<string> {
    return this.connectionStatus.asObservable();
  }
}
