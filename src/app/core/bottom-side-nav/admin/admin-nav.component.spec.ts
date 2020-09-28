import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavComponent } from './admin.-nav.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';
import { ServiceAdapter } from '@providers/service-adapter';
import { MediaObserver } from '@angular/flex-layout';

describe('Admin', () => {
  let component: AdminNavComponent;
  let fixture: ComponentFixture<AdminNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNavComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } },
        { provide: ServiceAdapter, useValue: { getDeviceConnectionStatus: {
          subscribe : () => {
            return of('attach');
          },
        } } },
        { provide: MediaObserver, useValue: {
          asObservable: () => {
            return of();
          },
        } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
