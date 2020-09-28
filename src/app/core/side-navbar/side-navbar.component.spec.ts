import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavbarComponent } from './side-navbar.component';
import { AuthService } from '@core/auth/auth.service';
import { FirmwareCheckService } from 'app/configuration/firmware/firmware-check.service';
import { MediaObserver } from '@angular/flex-layout';
import { NgZone, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SideNavbarComponent', () => {
  let component: SideNavbarComponent;
  let fixture: ComponentFixture<SideNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavbarComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: {
          subscribeAdminAuth: () => {
            return of('');
          },
        } },
        { provide: FirmwareCheckService, useValue: {
          isFirmwareUpToDate: () => {
            return of('');
          },
        } },
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
    fixture = TestBed.createComponent(SideNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
