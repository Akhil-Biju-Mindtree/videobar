import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticBeamsComponent } from './static-beams.component';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { MediaObserver } from '@angular/flex-layout';
import { UtilitiesService } from '@providers/utilities.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { AngularP5Service } from '../angular-p5.service';
import { Beam } from '../p5-models/beam';
import { AppConfig } from '@environment/environment';
import { Subscription, BehaviorSubject } from 'rxjs';
import { MockAngularP5Service } from '../../../../mocks/angularP5Service.mock';

describe('StaticBeamsComponent', () => {
  let component: StaticBeamsComponent;
  let fixture: ComponentFixture<StaticBeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaticBeamsComponent],
      providers: [
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
    TestBed.get(AngularP5Service).initStatic();
    fixture = TestBed.createComponent(StaticBeamsComponent);
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

  it('on hostlistner keyup', () => {
    const spyAngularP5Service = spyOn(TestBed.get(AngularP5Service), 'updateStaticBeamAngle');
    const event = new KeyboardEvent('keyup', { key: 'ArrowRight' });
    component.keyUpEvent(event);
    expect(spyAngularP5Service).toBeCalledTimes(1);
  });

  it('on hostlistner keydown - currently selected beam is 1st beam', () => {
    const eventArrowLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    component.keyPressed(eventArrowLeft);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedBeam().getAngle()).toEqual(9);
  });

  it('on hostlistner keydown - currently selected beam is 1st beam', () => {
    const eventArrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    component.keyPressed(eventArrowRight);
    expect(TestBed.get(AngularP5Service).getCurrentlySelectedBeam().getAngle()).toEqual(11);
  });

  it('On landscape screen and received screen width & height from cache', () => {
    spyOn(TestBed.get(ApplicationDataManagerService), 'listenForAppData').and.returnValue(of([1366, 768]));
    const localFixture = TestBed.createComponent(StaticBeamsComponent);
    const localComponent = localFixture.componentInstance;
    localComponent.isDesktopApp = true;
    localFixture.detectChanges();
    expect(localComponent.canvasWidth).toBeCloseTo(1013.4896, 4);
    expect(localComponent.canvasHeight).toBeCloseTo(571.2375, 4);
  });

  it('On square screen and received screen width & height from cache', () => {
    spyOn(TestBed.get(ApplicationDataManagerService), 'listenForAppData').and.returnValue(of([768, 1366]));
    const localStaticFixture = TestBed.createComponent(StaticBeamsComponent);
    const localStaticComponent = localStaticFixture.componentInstance;
    localStaticComponent.isDesktopApp = true;
    localStaticFixture.detectChanges();
    expect(localStaticComponent.canvasWidth).toBeCloseTo(718, 4);
    expect(localStaticComponent.canvasHeight).toBeCloseTo(404.6894, 4);
  });

  it('On webUI should create an instance with window size xl', () => {
    AppConfig.isDesktopApp = false;
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValue(true);
    const webFixture = TestBed.createComponent(StaticBeamsComponent);
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
    const webFixture = TestBed.createComponent(StaticBeamsComponent);
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
    const webFixture = TestBed.createComponent(StaticBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
    expect(webComponent.screenWidthHeight).toEqual('md-lg');
    expect(webComponent.canvasWidth).toEqual(486);
    expect(webComponent.canvasHeight).toEqual(274.5);
  });

  it('on beam selected send the beam & delete color and show delete button on number of beam is > 1', () => {
    const spySetCurrentlySelectedBeamIndex = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedBeamIndex');
    const spySetBeamDeleteButtonColor = spyOn(TestBed.get(AngularP5Service), 'setBeamDeleteButtonColor');
    const spySetIsDeleteHiddenStatic = spyOn(TestBed.get(AngularP5Service), 'setIsDeleteHiddenStatic');
    component.beamSelected(2);
    expect(spySetCurrentlySelectedBeamIndex).toBeCalledWith(2);
    expect(spySetBeamDeleteButtonColor).toBeCalledWith(TestBed.get(AngularP5Service).staticBeam[2].selectesBeamColor);
    expect(spySetIsDeleteHiddenStatic).toBeCalledWith(false);
  });

  it('on beam selected send the beam & delete color and hide delete button on number of beam is 1', () => {
    spyOn(TestBed.get(AngularP5Service), 'getNumberOfBeams').and.returnValue(new BehaviorSubject<number>(1));
    const spySetCurrentlySelectedBeamIndex = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedBeamIndex');
    const spySetBeamDeleteButtonColor = spyOn(TestBed.get(AngularP5Service), 'setBeamDeleteButtonColor');
    const spySetIsDeleteHiddenStatic = spyOn(TestBed.get(AngularP5Service), 'setIsDeleteHiddenStatic');
    component.beamSelected(2);
    expect(spySetCurrentlySelectedBeamIndex).toBeCalledWith(2);
    expect(spySetBeamDeleteButtonColor).toBeCalledWith(TestBed.get(AngularP5Service).staticBeam[2].selectesBeamColor);
    expect(spySetIsDeleteHiddenStatic).toBeCalledWith(true);
  });

  it('on beam unselected send the null beam & delete color and hide delete button', () => {
    const spySetCurrentlySelectedBeamIndex = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedBeamIndex');
    const spySetBeamDeleteButtonColor = spyOn(TestBed.get(AngularP5Service), 'setBeamDeleteButtonColor');
    const spySetIsDeleteHiddenStatic = spyOn(TestBed.get(AngularP5Service), 'setIsDeleteHiddenStatic');
    component.beamUnSelected();
    expect(spySetCurrentlySelectedBeamIndex).toBeCalledWith(-1);
    expect(spySetBeamDeleteButtonColor).toBeCalledWith(null);
    expect(spySetIsDeleteHiddenStatic).toBeCalledWith(true);
  });

  it('on update current beam send selected beam', () => {
    const spySetCurrentlySelectedBeam = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedBeam');
    component.updateCurrentBeam(TestBed.get(AngularP5Service).staticBeam[1]);
    expect(spySetCurrentlySelectedBeam).toBeCalledWith(TestBed.get(AngularP5Service).staticBeam[1]);
  });

  it('on update current beam send null on beam unselected', () => {
    const spySetCurrentlySelectedBeam = spyOn(TestBed.get(AngularP5Service), 'setCurrentlySelectedBeam');
    component.updateCurrentBeam(null);
    expect(spySetCurrentlySelectedBeam).toBeCalledWith(null);
  });

  it('on hover on beam set hoveredBeam with beam hovered', () => {
    component.updateCurrentHovered(TestBed.get(AngularP5Service).staticBeam[1]);
    expect(component.currentlyHoveredBeam).toEqual(TestBed.get(AngularP5Service).staticBeam[1]);
  });

  afterAll(() => {
    spyOn(TestBed.get(MediaObserver), 'isActive').and.returnValues(false, false, false, false);
    const webFixture = TestBed.createComponent(StaticBeamsComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.isDesktopApp = false;
    webComponent.subscribtions = new Subscription();
    webFixture.detectChanges();
  });
});
