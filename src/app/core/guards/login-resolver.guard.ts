import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConstants } from '@core/constants/app.constant';
import { AppConfig } from '@environment/environment';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginResolverGuard implements Resolve<boolean> {
  constructor(private router: Router, private authService: AuthService, private cookieService: CookieService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (
      !AppConfig.isDesktopApp &&
      !this.authService.IsAuthenticated &&
      this.cookieService.get(AppConstants.APP_SESSION) &&
      +localStorage.getItem(AppConstants.APP_SESSION_TIMEOUT) > Date.now()
    ) {
      return this.authService.login(this.cookieService.get(AppConstants.APP_SESSION)).pipe(
        switchMap((loggedIn: boolean) => {
          if (loggedIn && !this.authService.getCacheInitialized()) {
            return this.authService.initializeCache();
          }
          return of(true);
        }),
      );
    }
    return of(true);
  }
}
