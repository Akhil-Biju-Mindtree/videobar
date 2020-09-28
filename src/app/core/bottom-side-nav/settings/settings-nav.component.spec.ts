import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNavComponent } from './settings-nav.component';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SettingsComponent', () => {
  let component: SettingsNavComponent;
  let fixture: ComponentFixture<SettingsNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsNavComponent],
      providers: [
        { provide: Router, useValue: {
          events: {
            pipe : () => {
              return of('');
            },
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
    fixture = TestBed.createComponent(SettingsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
