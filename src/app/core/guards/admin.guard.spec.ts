import { TestBed, async, inject } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: { IsAuthenticated: true, subscribeAdminAuth: () => {}, login: () => {} } },
        { provide: CookieService, useValue: {} },
      ],
    });
  });

  it('should ...', inject([AdminGuard], (guard: AdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
