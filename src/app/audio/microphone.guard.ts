import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppConfig } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MicrophoneGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
    if (!AppConfig.isDesktopApp) {
      this.router.navigateByUrl('/audio/controls');
      return false;
    }
    return true;
  }
}
