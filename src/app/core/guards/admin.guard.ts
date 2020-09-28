import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { AppConstants, CacheStates } from '@core/constants/app.constant';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private cookieService: CookieService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
    if (
      !AppConfig.isDesktopApp &&
      !this.authService.IsAuthenticated &&
      this.cookieService.get(AppConstants.APP_SESSION) &&
      +localStorage.getItem(AppConstants.APP_SESSION_TIMEOUT) > Date.now()
    ) {
      return this.authService.login(this.cookieService.get(AppConstants.APP_SESSION), true);
    }
    if (!this.authService.IsAuthenticated) {
      this.router.navigateByUrl('/login');
    }
    return this.authService.subscribeAdminAuth();
  }
}
