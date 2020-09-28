import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DynamicBeamsComponent } from './dynamic-beams.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { MediaObserver } from '@angular/flex-layout';
import { AngularP5Service } from '../angular-p5.service';
import { of } from 'rxjs/internal/observable/of';
import { AppConfig } from '@environment/environment';
import { Subscription } from 'rxjs/internal/Subscription';
import { MockAngularP5Service } from '../../../../mocks/angularP5Service.mock';

describe('DynamicBeamsComponent', () => {
  let component: DynamicBeamsComponent;
  let fixture: ComponentFixture<DynamicBeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicBeamsComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { sendToDevice: () => of('') } },
        {
          provide: ApplicationDataManagerService,
          useValue: {
            listenForAppData: (key) => {
              if (key === 'screenWidthHeight') {
                return of([-1, -1]);
              }
              return of('');
            },
          },
        },
        { provide: MediaObserver, useValue: { asObservable: () => of(''), isActive: key => true } },
        { provide: AngularP5Service, useClass: MockAngularP5Service },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(AngularP5Service).initDynamic();
    fixture = TestBed.createComponent(DynamicBeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on hostlistner window before unload', () => {
    spyOn(component, 'ngOnDestroy');
    const event = new Event('beforeunload');
    component.beforeunloadHandler(event);
    expect(component.ngOnDestroy).toBeCalledTimes(1);
  });

  it('On landscape screen and received screen width & height from cache', () => {
    spyOn(TestBed.get(ApplicationDataManagerService), 'listenForAppData').and.returnValue(of([1366, 768]));
    const localFixture = TestBed.createComponent(DynamicBeamsComponent);
    const localComponent = localFixture.componentInstance;
    localComponent.isDesktopApp = true;
    localFixture.detectChanges();
    expect(localComponent.canvasWidth).toBeCloseTo(1013.4896, 4);
    expect(localComponent.canvasHeight).toBeCloseTo(571.2375, 4);
  });

  it('On square screen and received screen width & height from cache', () => {
    spyOn(TestBed.get(ApplicationDataManagerService), 'listenForAppData').and.returnValue(of([768, 1366]));
    const localDynamicFixture = TestBed.createComponent(DynamicBeamsComponent);
    const localDynamicComponent = localDynamicFixture.componentInstance;
    localDynamicComponent.isDesktopApp = true;
    localDynamicFixture.detectChanges();
    expect(localDynamicComponent.canvasWidth).toBeCloseTo(718, 4);
    expect(localDynamicComponent.canvasHeight).toBeCloseTo(404.6894, 4);
  });

  it('On webUI should create an instance with window size xl', () => {
    AppConfig.isDesktopApp = false;
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValue(true);
    const webFixture = TestBed.createComponent(DynamicBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.canvasWidth).toEqual(735);
    expect(webComponent.canvasHeight).toEqual(415.1);
  });

  it('On webUI should create an instance with window size xs', () => {
    AppConfig.isDesktopApp = false;
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, true);
    const webFixture = TestBed.createComponent(DynamicBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.canvasWidth).toEqual(428);
    expect(webComponent.canvasHeight).toEqual(241.8);
  });

  it('On webUI should create an instance with window size lg', () => {
    AppConfig.isDesktopApp = false;
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, false, false, true);
    const webFixture = TestBed.createComponent(DynamicBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.canvasWidth).toEqual(486);
    expect(webComponent.canvasHeight).toEqual(274.5);
  });

  afterAll(() => {
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, false, false, false);
    const webFixture = TestBed.createComponent(DynamicBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
  });
});
