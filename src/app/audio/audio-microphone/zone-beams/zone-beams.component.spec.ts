import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneBeamsComponent } from './zone-beams.component';
import { AngularP5Service } from '../angular-p5.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { MediaObserver } from '@angular/flex-layout';
import { UtilitiesService } from '@providers/utilities.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { Zone } from '../p5-models/zone';
import { AppConfig } from '@environment/environment';
import { Subscription } from 'rxjs';
import { MockAngularP5Service } from '../../../../mocks/angularP5Service.mock';

describe('ZoneBeamsComponent Hostlistener', () => {
  let zoneComponent: ZoneBeamsComponent;
  let zoneFixture: ComponentFixture<ZoneBeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZoneBeamsComponent],
      providers: [
        { provide: Zone, useValue: { setStartAngle: () => {} } },
        {
          provide: ApplicationDataManagerService,
          useValue: { listenForAppData: key => of('') },
        },
        { provide: MediaObserver, useValue: { asObservable: () => of(''), isActive: key => true } },
        { provide: UtilitiesService, useValue: { debounce: (fun, time) => fun.call() } },
        { provide: AngularP5Service, useClass: MockAngularP5Service },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(AngularP5Service).initZone();
    zoneFixture = TestBed.createComponent(ZoneBeamsComponent);
    zoneComponent = zoneFixture.componentInstance;
    zoneFixture.detectChanges();
  });

  it('should create', () => {
    expect(zoneComponent).toBeTruthy();
  });

  it('on hostListener window before unload', () => {
    spyOn(zoneComponent, 'ngOnDestroy');
    const event = new Event('beforeunload');
    zoneComponent.beforeunloadHandler(event);
    expect(zoneComponent.ngOnDestroy).toBeCalledTimes(1);
  });

  it('on hostListener keyup', () => {
    const spyAngularP5Service = spyOn(TestBed.get(AngularP5Service), 'updateZoneBeamAngle');
    const event = new KeyboardEvent('keyup', { key: '=' });
    zoneComponent.keyUpEvent(event);
    expect(spyAngularP5Service).toBeCalledTimes(1);
  });

  it('on hostListener keydown - currently selected zone is 1st zone', () => {
    const event = new KeyboardEvent('keydown', { key: '-' });
    zoneComponent.keyPressed(event);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getStartAngle()).toEqual(6);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getEndAngle()).toEqual(16);
  });

  it('on hostListener keydown - currently selected zone is 0th zone', () => {
    const angularP5serviceTest = TestBed.get(AngularP5Service);
    spyOn(angularP5serviceTest, 'getCurrentlySelectedZoneIndex').and.returnValue(0);
    spyOn(angularP5serviceTest, 'getCurrentlySelectedZone').and.returnValue(angularP5serviceTest.zone[0]);
    const event = new KeyboardEvent('keydown', { key: '-' });
    zoneComponent.keyPressed(event);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getEndAngle()).toEqual(-81);
  });

  it('on hostListener keydown - currently selected zone is 3rd zone', () => {
    const angularP5serviceTest = TestBed.get(AngularP5Service);
    spyOn(angularP5serviceTest, 'getCurrentlySelectedZoneIndex').and.returnValue(2);
    spyOn(angularP5serviceTest, 'getCurrentlySelectedZone').and.returnValue(angularP5serviceTest.zone[2]);
    const event = new KeyboardEvent('keydown', { key: '-' });
    zoneComponent.keyPressed(event);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getStartAngle()).toEqual(81);
  });

  it('on hostListener keydown + currently selected zone is 1st zone', () => {
    const eventEqual = new KeyboardEvent('keydown', { key: '=' });
    zoneComponent.keyPressed(eventEqual);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getStartAngle()).toEqual(4);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getEndAngle()).toEqual(18);
  });

  it('on hostListener keydown + currently selected zone is 0th zone', () => {
    const angularP5serviceTestBed = TestBed.get(AngularP5Service);
    spyOn(angularP5serviceTestBed, 'getCurrentlySelectedZoneIndex').and.returnValue(0);
    spyOn(angularP5serviceTestBed, 'getCurrentlySelectedZone').and.returnValue(angularP5serviceTestBed.zone[0]);
    const event = new KeyboardEvent('keydown', { key: '=' });
    zoneComponent.keyPressed(event);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getEndAngle()).toEqual(-79);
  });

  it('on hostListener keydown + currently selected zone is 3rd zone', () => {
    const angularP5service = TestBed.get(AngularP5Service);
    spyOn(angularP5service, 'getCurrentlySelectedZoneIndex').and.returnValue(2);
    spyOn(angularP5service, 'getCurrentlySelectedZone').and.returnValue(angularP5service.zone[2]);
    const event = new KeyboardEvent('keydown', { key: '=' });
    zoneComponent.keyPressed(event);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getStartAngle()).toEqual(79);
  });

  it('on hostListener keydown rightArrow currently selected zone is 1st zone', () => {
    const eventArrowRright = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    zoneComponent.keyPressed(eventArrowRright);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getStartAngle()).toEqual(6);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getEndAngle()).toEqual(18);
  });

  it('on hostListener keydown leftArrow currently selected zone is 1st zone', () => {
    const eventArrowLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    zoneComponent.keyPressed(eventArrowLeft);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getStartAngle()).toEqual(4);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedZone().getEndAngle()).toEqual(16);
  });
});

describe('ZoneBeamsComponent', () => {
  let component: ZoneBeamsComponent;
  let fixture: ComponentFixture<ZoneBeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZoneBeamsComponent],
      providers: [
        { provide: Zone, useValue: { setStartAngle: () => {} } },
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
        { provide: UtilitiesService, useValue: { debounce: (fun, time) => fun.call() } },
        { provide: AngularP5Service, useClass: MockAngularP5Service },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(AngularP5Service).initZone();
    fixture = TestBed.createComponent(ZoneBeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('on select zone should set zone & show delete icon', () => {
    const spySetCurrentlySelectedZoneIndex = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedZoneIndex');
    const spySetIsDeleteHiddenZone = spyOn(TestBed.get(AngularP5Service), 'setIsDeleteHiddenZone');
    component.zoneSelected(1);
    expect(spySetCurrentlySelectedZoneIndex).toBeCalledWith(1);
    expect(spySetIsDeleteHiddenZone).toBeCalledWith(false);
  });

  it('on select zone should set zone & hide delete icon', () => {
    const spySetCurrentlySelectedZoneIndex = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedZoneIndex');
    const spySetIsDeleteHiddenZone = spyOn(TestBed.get(AngularP5Service), 'setIsDeleteHiddenZone');
    component.zoneSelected(0);
    expect(spySetCurrentlySelectedZoneIndex).toBeCalledWith(0);
    expect(spySetIsDeleteHiddenZone).toBeCalledWith(true);
  });

  it('on unselect zone should unset zone & hide delete icon', () => {
    const spySetCurrentlySelectedZoneIndex = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedZoneIndex');
    const spySetCurrentlySelectedZone = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedZone');
    const spySetIsDeleteHiddenZone = spyOn(TestBed.get(AngularP5Service), 'setIsDeleteHiddenZone');
    component.zoneUnselected();
    expect(spySetCurrentlySelectedZoneIndex).toBeCalledWith(-1);
    expect(spySetCurrentlySelectedZone).toBeCalledWith(null);
    expect(spySetIsDeleteHiddenZone).toBeCalledWith(true);
  });

  it('on select zone should set the selected zone', () => {
    component.zones = TestBed.get(AngularP5Service).zone;
    const spyAngularP5Service = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedZone');
    component.updateCurrentZone(TestBed.get(AngularP5Service).zone[1]);
    expect(spyAngularP5Service).toBeCalledWith(TestBed.get(AngularP5Service).zone[1]);
  });

  it('on unselect zone should set null to zone', () => {
    component.zones = TestBed.get(AngularP5Service).zone;
    const spyAngularP5Service = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedZone');
    component.updateCurrentZone(null);
    expect(spyAngularP5Service).toBeCalledWith(null);
  });

  it('on hover zone should set hover to zone', () => {
    component.zones = TestBed.get(AngularP5Service).zone;
    component.updateCurrentHoveredZone(TestBed.get(AngularP5Service).zone[1]);
    expect(component.currentlyHoveredZone).toEqual(TestBed.get(AngularP5Service).zone[1]);
  });

  it('On landscape screen and received screen width & height from cache', () => {
    spyOn(TestBed.get(ApplicationDataManagerService), 'listenForAppData').and.returnValue(of([1366, 768]));
    const localFixture = TestBed.createComponent(ZoneBeamsComponent);
    const localComponent = localFixture.componentInstance;
    localComponent.isDesktopApp = true;
    localFixture.detectChanges();
    expect(localComponent.canvasWidth).toBeCloseTo(1013.4896, 4);
    expect(localComponent.canvasHeight).toBeCloseTo(571.2375, 4);
  });

  it('On square screen and received screen width & height from cache', () => {
    spyOn(TestBed.get(ApplicationDataManagerService), 'listenForAppData').and.returnValue(of([768, 1366]));
    const localZoneFixture = TestBed.createComponent(ZoneBeamsComponent);
    const localComponent = localZoneFixture.componentInstance;
    localComponent.isDesktopApp = true;
    localZoneFixture.detectChanges();
    expect(localComponent.canvasWidth).toBeCloseTo(718, 4);
    expect(localComponent.canvasHeight).toBeCloseTo(404.6894, 4);
  });

  it('On webUI should create an instance with window size xl', () => {
    AppConfig.isDesktopApp = false;
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValue(true);
    const webFixture = TestBed.createComponent(ZoneBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.screenWidthHeight).toEqual('xl');
    expect(webComponent.canvasWidth).toEqual(735);
    expect(webComponent.canvasHeight).toEqual(415.1);
  });

  it('On webUI should create an instance with window size xs', () => {
    AppConfig.isDesktopApp = false;
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, true);
    const webFixture = TestBed.createComponent(ZoneBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.screenWidthHeight).toEqual('xs');
    expect(webComponent.canvasWidth).toEqual(428);
    expect(webComponent.canvasHeight).toEqual(241.8);
  });

  it('On webUI should create an instance with window size lg', () => {
    AppConfig.isDesktopApp = false;
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, false, false, true);
    const webFixture = TestBed.createComponent(ZoneBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.screenWidthHeight).toEqual('md-lg');
    expect(webComponent.canvasWidth).toEqual(486);
    expect(webComponent.canvasHeight).toEqual(274.5);
  });

  afterAll(() => {
    spyOn(TestBed.get(AngularP5Service), 'getSelectedBeamType').and.returnValue('fixed');
    const eventdown = new KeyboardEvent('keydown', { key: '-' });
    component.keyPressed(eventdown);
  });
  afterAll(() => {
    const eventup = new KeyboardEvent('keyup', { key: 'u' });
    component.keyUpEvent(eventup);
    spyOn(TestBed.get(AngularP5Service), 'getCurrentlySelectedZone').and.returnValue(null);
    const eventdown = new KeyboardEvent('keydown', { key: '-' });
    component.keyPressed(eventdown);
  });
});
