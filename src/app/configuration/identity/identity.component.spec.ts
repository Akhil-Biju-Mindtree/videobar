import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityComponent } from './identity.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('IdentityComponent', () => {
  let component: IdentityComponent;
  let fixture: ComponentFixture<IdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdentityComponent],
      providers: [{ provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of() } }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
