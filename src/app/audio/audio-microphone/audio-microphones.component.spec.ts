import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { AudioMicrophonesComponent } from './audio-microphones.component';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { MediaObserver } from '@angular/flex-layout';
import { AngularP5Service } from './angular-p5.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServiceAdapter } from '@providers/service-adapter';
import { of, Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { Zone } from './p5-models/zone';
import { AppConfig } from '@environment/environment';
import { Beam } from './p5-models/beam';

class DeviceDataManagerServiceMock {
  listenFromDevice(key) {
    let returnValue;
    switch (key) {
      case '6745eb7b-fd43-44e1-ae1e-9068e422f5de':
        returnValue = of('disabled');
        break;
      case '4746a431-510a-4828-8bbd-cb224fdf1152':
        returnValue = of('13');
        break;
      case '4f1526ec-1cc3-4de4-8c12-1c95c9f081b9':
        returnValue = of('-7');
        break;
      case '434a6a0d-eb30-45bb-a998-891f3104b9d4':
        returnValue = of('-23');
        break;
      case '67906970-69de-4e0d-9a27-7f56fa33a304':
        returnValue = of('-70');
        break;
      case '89f9a3b0-452d-4301-9223-5b5f62151a1f':
        returnValue = of('1');
        break;
      case '69a00953-60d7-41d1-9d21-b76ac3845ae1':
        returnValue = of('-3');
        break;
      case 'a44a95d5-71b0-49c2-b71d-96298374ba7f':
        returnValue = of('4');
        break;
      case '5fc62c82-00d5-4129-a906-0308ea9c6255':
        returnValue = of('80');
        break;
      case '4574bbc4-04da-4180-93ec-674bcf0772c7':
        returnValue = of('5');
        break;
      case '4c526939-45cb-4f2f-8a5d-3887804e7257':
        returnValue = of('10');
        break;
      default:
        returnValue = '';
        break;
    }
    return returnValue;
  }

  sendToDevice(action, object) {
    return '';
  }
}
class MockAngularP5Service {
  zones = [new Zone(-90, -80, 'maximum'), new Zone(5, 17, 'both'), new Zone(80, 90, 'minimum')];
  staticBeams = [new Beam(1), new Beam(10), new Beam(-10), new Beam(45)];

  init = () => {
    this.zones.forEach((zone) => {
      zone.setNonSelectedZoneColor('rgba(171, 171, 171, 1)');
      zone.setSelectesZoneColor('rgba(171, 171, 171, 1)');
    });
    this.zones[0].minimumMovementAngle = -90;
    this.zones[0].maximumMovementAngle = -70;

    this.zones[1].minimumMovementAngle = -7;
    this.zones[1].maximumMovementAngle = 24;

    this.zones[2].minimumMovementAngle = 70;
    this.zones[2].maximumMovementAngle = 90;
  }

  getZones = () => this.zones;
  addBeam = () => of('');
  deleteZone = () => of('');
  deleteBeam = () => of('');
  setRoomDepth = () => of('');
  setRoomWidth = () => of('');
  setAddedZone = () => of('');
  setNumberOfBeams = () => of('');
  getNumberOfBeams = () => of(3);
  clearAllSelection = () => of('');
  unsubscribeAmmData = () => of('');
  subscribeToAmmData = () => of('');
  isStaticBeamDeleted = () => false;
  updateBeamsToDefault = () => of('');
  setIsDeleteHiddenZone = () => of('');
  getIsDeleteHiddenZone = () => true;
  subscribeToBeamTypeData = () => of('');
  getIsDeleteHiddenStatic = () => true;
  checkZonesAreInBoundary = () => of('');
  setIsDeleteHiddenStatic = () => of('');
  unsubscribeBeamTypeData = () => of('');
  getBeamDeleteButtonColor = () => of('rgb(234, 56, 78)');
  mapAndSetStaticBeamInput = () => of('');
  setCurrentlySelectedBeam = () => of('');
  setCurrentlySelectedZone = () => of('');
  initBeamMovementProperties = () => of('');
  checkStaticBeamsInBoundary = () => of('');
  initZoneMovementProperties = () => of('');
  getCurrentlySelectedBeamIndex = () => 0;
  setCurrentlySelectedBeamIndex = () => of('');
  getCurrentlySelectedZoneIndex = () => 0;
}

describe('AudioMicrophonesComponent', () => {
  let component: AudioMicrophonesComponent;
  let fixture: ComponentFixture<AudioMicrophonesComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioMicrophonesComponent],
      imports: [MatMenuModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ApplicationDataManagerService,
          useValue: { listenForAppData: () => of(true), saveToAppData: () => {} },
        },
        { provide: DeviceDataManagerService, useClass: DeviceDataManagerServiceMock },
        { provide: MediaObserver, useValue: { asObservable: () => of(''), isActive: key => true } },
        { provide: AngularP5Service, useClass: MockAngularP5Service },
        {
          provide: ServiceAdapter,
          useValue: {
            remote: {
              getCurrentWindow: () => {
                return {
                  setFullScreenable: () => '',
                  setFullScreen: () => '',
                  setAlwaysOnTop: () => '',
                  setPosition: () => '',
                  getPosition: () => [40, 70],
                  setMinimumSize: () => '',
                  setContentSize: () => '',
                  setMovable: () => '',
                };
              },
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(AngularP5Service).init();
    fixture = TestBed.createComponent(AudioMicrophonesComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
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

  it('on selecting collapse screen should save the action in app cache', () => {
    const spyApplicationDataManager = spyOn(TestBed.get(ApplicationDataManagerService), 'saveToAppData');
    component.selectionChange(true);
    expect(spyApplicationDataManager).toBeCalledWith({ AudioBeamsExpanded: false });
  });

  it('on selecting collapse screen should save the action in app cache', () => {
    const spyApplicationDataManager = spyOn(TestBed.get(ApplicationDataManagerService), 'saveToAppData');
    component.selectionChange(false);
    expect(spyApplicationDataManager).toBeCalledWith({ AudioBeamsExpanded: true });
  });

  it('on Video Status Change to no streaming collapse the screen', () => {
    const spyApplicationDataManager = spyOn(TestBed.get(ApplicationDataManagerService), 'saveToAppData');
    component.onChangeVideoStatus(false);
    expect(spyApplicationDataManager).toBeCalledWith({ AudioBeamsExpanded: false });
  });

  it('on Video Status Change to streaming send beam events and reset PTZ', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.onChangeVideoStatus(true);
    expect(spySendToDevice).toBeCalledWith('perform', { '98b4ab7d-92fe-485c-9c06-1821bb06e1f5': '1' });
    expect(spySendToDevice).toBeCalledWith('delete', { 'e1cd2715-3551-4acf-9ef7-7466c9513043': '' });
    expect(spySendToDevice).toBeCalledTimes(3);
  });

  it('on Add Beam button is clicked should call addBeam method in angularP5Service', () => {
    const spyAngularP5Service = spyOn(TestBed.get(AngularP5Service), 'addBeam');
    component.onAddBeam();
    expect(spyAngularP5Service).toBeCalledTimes(1);
  });

  it('on delete Beam button is clicked should call delete beam method in angularP5Service', () => {
    const spyDeleteBeam = spyOn(TestBed.get(AngularP5Service), 'deleteBeam');
    const spySetCurrentlySelectedBeamIndex = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedBeamIndex');
    const spySetIsDeleteHiddenStatic = spyOn(TestBed.get(AngularP5Service), 'setIsDeleteHiddenStatic');
    component.onDeleteBeam();
    expect(spyDeleteBeam).toBeCalledWith(0);
    expect(spySetCurrentlySelectedBeamIndex).toBeCalledWith(-1);
    expect(spySetIsDeleteHiddenStatic).toBeCalledWith(true);
  });

  it('on Add Zone button is clicked should call setAddedZone method in angularP5Service', () => {
    const spyAngularP5Service = spyOn(TestBed.get(AngularP5Service), 'setAddedZone');
    component.onAddExclusionZone();
    expect(spyAngularP5Service).toBeCalledTimes(1);
  });

  it('on Delete Zone button is clicked should call deleteZone method in angularP5Service', () => {
    const spyAngularP5Service = spyOn(TestBed.get(AngularP5Service), 'deleteZone');
    component.onDeleteZone();
    expect(spyAngularP5Service).toBeCalledTimes(1);
  });

  it('on room width & height slider change should save the settings in inputFields', () => {
    component.setRoomValues(0, 7);
    expect(component.inputFields[0].value).toEqual(7);
  });

  it('on collapse mode resize the application window', () => {
    spyOn(TestBed.get(ApplicationDataManagerService), 'listenForAppData').and.returnValue(of(false));
    const spyApplicationDataManager = spyOn(TestBed.get(ApplicationDataManagerService), 'saveToAppData');
    const localFixture = TestBed.createComponent(AudioMicrophonesComponent);
    const localComponent = localFixture.componentInstance;
    localComponent.isDesktopApp = true;
    localFixture.detectChanges();
    expect(spyApplicationDataManager).toBeCalledWith({ screenWidthHeight: [-1, -1] });
  });

  it('on webUI should create an instance of xl screen size', () => {
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(true);
    AppConfig.isDesktopApp = false;
    const webFixture = TestBed.createComponent(AudioMicrophonesComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.screenWidthHeight).toEqual('xl');
  });

  it('on webUI should create an instance of xs screen size', () => {
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, true);
    AppConfig.isDesktopApp = false;
    const webFixture = TestBed.createComponent(AudioMicrophonesComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.screenWidthHeight).toEqual('xs');
  });

  it('on webUI should create an instance of md-lg screen size', () => {
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, false, false, true);
    AppConfig.isDesktopApp = false;
    const webFixture = TestBed.createComponent(AudioMicrophonesComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.screenWidthHeight).toEqual('md-lg');
  });
});
