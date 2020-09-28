import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConfig } from '@environment/environment';
import { shareReplay, take, switchAll, switchMap, map } from 'rxjs/operators';
import { AppConstants } from '@core/constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class HttpClientWrapperService {
  private versionCache$: Observable<any>;

  constructor(private httpClient: HttpClient) {}

  private retrieveLinkVersion() {
    if (!this.versionCache$) {
      this.versionCache$ = this.get(AppConstants.SERVER_VERSION_URL).pipe(shareReplay(1), take(1));
    }
    return this.versionCache$;
  }

  public fetchVersionedLink(url: string, noRequest?) {
    return this.retrieveLinkVersion().pipe(
      switchMap((versionData) => {
        const versionedURL = url.replace('{version}', versionData.latestVersion);
        return noRequest
          ? of(versionedURL)
          : this.get(versionedURL).pipe(
              map((data) => {
                return { ...data, requestVersion: versionData.latestVersion.replace(/_/g, '.') };
              }),
            );
      }),
    );
  }

  public get(url: string): Observable<any> {
    return this.httpClient.get(url, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
  }

  public getFile(url: string) {
    return this.httpClient.get(url, {
      responseType: 'arraybuffer',
      reportProgress: true,
      observe: 'events',
    });
  }

  public uploadImageFile(imageFile, password) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Password', password);
    return this.httpClient.put(AppConfig.firmwareUpdateServer, imageFile, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  public getDeviceLogs(password) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Password', password);
    return this.httpClient.get(AppConfig.firmwareUpdateServer, {
      headers,
      responseType: 'blob',
      reportProgress: true,
      observe: 'events',
    });
  }
}
