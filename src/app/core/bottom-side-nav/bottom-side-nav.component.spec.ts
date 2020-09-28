import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSideNavComponent } from './bottom-side-nav.component';
import { AuthService } from '@core/auth/auth.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BottomSideNavComponent', () => {
  let component: BottomSideNavComponent;
  let fixture: ComponentFixture<BottomSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BottomSideNavComponent],
      providers: [
        { provide: AuthService, useValue: {
          subscribeAdminAuth: () => {
            return of('');
          },
        } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
