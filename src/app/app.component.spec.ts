import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ServiceAdapter } from '@providers/service-adapter';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@core/auth/auth.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs/internal/observable/of';
import { MapperService } from '@core/services/mapper.service';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { ConnectionDetectionService } from '@core/services/connection-detection.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { FirmwareProgressService } from './configuration/firmware/firmware-progress.service';
import { DownloadlogsService } from './configuration/system/downloadlogs.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [],
      providers: [
        { provide: Router, useValue: {} },
        {
          provide: ServiceAdapter,
          useValue: {
            remote: {
              app: {
                getPath: () => {
                  return '';
                },
              },
              getCurrentWindow: () => {
                return {
                  getTitle: () => {
                    return '';
                  },
                };
              },
            },
            getDeviceConnectionStatus: {
              subscribe: () => {
                return of('attach');
              },
            },
          },
        },
        { provide: TranslateService, useValue: { setDefaultLang: () => of('') } },
        { provide: AuthService, useValue: { subscribeCredentials: () => of(''), subscribeAdminAuth: () => of('') } },
        { provide: DeviceDataManagerService, useValue: { sendToDevice: () => of(''), listenFromDevice: () => of('') } },
        { provide: MapperService, useValue: { initialStateFromJSONMapper: () => of('') } },
        { provide: SpinnerService, useValue: {} },
        { provide: ConnectionDetectionService, useValue: {} },
        {
          provide: ApplicationDataManagerService,
          useValue: { listenForAppData: () => of(''), saveToAppData: () => of('') },
        },
        { provide: FileServiceAdaptor, useValue: {} },
        { provide: FirmwareProgressService, useValue: {} },
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: DownloadlogsService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(AppComponent).toBeTruthy();
  });
});
