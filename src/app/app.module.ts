import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injectable, Injector, ErrorHandler, Type } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceAdapter } from './providers/service-adapter';
import { FileServiceAdaptor } from './providers/file-service-adaptor';
import { AppConfig } from '@environment/environment';
import { AppInitService } from './app-init.service';
import { WebLoggerService } from './core/logger/web-logger.service';
import { Logger } from '@core/logger/Logger';
import { ElectronLoggerService } from './core/logger/electron-logger.service';
import { GlobalErrorHandler } from './core/error/global-error-handler';

import { DesktopFileService } from './providers/desktop-file.service';
import { WebFileService } from './providers/web-file.service';
import { StoresModule } from '@core/store/stores.module';
import { serviceAdaptorFactory } from 'app/providers/service-adapter-factory';
import { CookieService } from 'ngx-cookie-service';

// TODO: Remove this once read/write delay issue is fixed
// AoT requires an exported function for factories
export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function fileAdaptorFactory(depInjector: Injector) {
  const serviceAdaptor = depInjector.get<ServiceAdapter>(ServiceAdapter as Type<ServiceAdapter>);
  if (AppConfig.isDesktopApp) {
    return new DesktopFileService(serviceAdaptor);
  }
  return new WebFileService();
}

export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.init();
  };
}
export function loggerFactory(injector: Injector) {
  if (AppConfig.isDesktopApp) {
    return new ElectronLoggerService();
  }

  return injector.get(WebLoggerService);
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    StoresModule,
    CoreModule,
    SharedModule,
  ],
  providers: [
    AppInitService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitService], multi: true },
    { provide: Logger, useFactory: loggerFactory, deps: [Injector] },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: ServiceAdapter,
      useFactory: serviceAdaptorFactory,
      deps: [Injector],
    },
    { provide: FileServiceAdaptor, useFactory: fileAdaptorFactory, deps: [Injector] },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
