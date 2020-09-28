import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { AngularP5Service } from '../angular-p5.service';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import { Beam } from '../p5-models/beam';
import { Coordinate } from '../p5-models/coordinate';
import * as p5Helper from '../beamsP5Helper';
import { AUDIO_CONSTANTS } from 'app/audio/audio.constant';
import { Subscription, Subject } from 'rxjs';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { UtilitiesService } from '@providers/utilities.service';
import { AppConfig } from '@environment/environment';
import { MediaObserver } from '@angular/flex-layout';
import { takeUntil } from 'rxjs/operators';

let self: any = null;
@Component({
  selector: 'app-static-beams',
  templateUrl: './static-beams.component.html',
  styleUrls: ['./static-beams.component.scss'],
})
export class StaticBeamsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('overlayContainer', { static: false })
  private overlayContainer: ElementRef;
  microphoneConfigJson = microphoneConfigJsonMap['default'];
  constructor(
    public angularP5Service: AngularP5Service,
    private applicationDataManagerService: ApplicationDataManagerService,
    private utilityService: UtilitiesService,
    private mediaObserver: MediaObserver,
  ) { }

  p5: any = {};

  min = this.microphoneConfigJson.beamComponent.beamConstrain.minimumAngle;
  max = this.microphoneConfigJson.beamComponent.beamConstrain.maximumAngle;
  beamColors = this.microphoneConfigJson.beamComponent.beamColours.notSelected;
  beamSelectedColors = this.microphoneConfigJson.beamComponent.beamColours.Selected;
  beamWidth = this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle;
  runningBeamWidth = this.microphoneConfigJson.beamComponent.beamConstrain.runningBeamAngle;
  roomWidth = this.microphoneConfigJson.meetingRoomConfig.width;
  roomDepth = this.microphoneConfigJson.meetingRoomConfig.depth;
  staticBeams: Beam[] = [];
  currentlyHoveredBeam: Beam = null;
  timer;
  subscribtions: Subscription = new Subscription();
  canvasWidth = this.microphoneConfigJson.canvasConstrain.width;
  canvasHeight = this.microphoneConfigJson.canvasConstrain.height;
  isDesktopApp = AppConfig.isDesktopApp;
  screenWidth: number;
  screenWidthHeight: string;
  subscribeOnFullScreen = new Subject<void>();

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.ngOnDestroy();
  }

  /**************** KeyBoard events Hostlisner ******************/
  @HostListener('document:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    const keyValue = event.key;
    if (keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_LEFT || keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_RIGHT) {
      this.updateStaticBeamData();
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyPressed(event: KeyboardEvent) {
    const keyValue = event.key;
    if (
      this.angularP5Service.getCurrentlySelectedBeam() &&
      keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_LEFT &&
      self.angularP5Service.getCurrentlySelectedBeam().getAngle() - 1 >=
        self.angularP5Service.getCurrentlySelectedBeam().getMinimumMovementAngle() &&
      self.angularP5Service.getCurrentlySelectedBeam().getAngle() - 1 <=
        self.angularP5Service.getCurrentlySelectedBeam().getMaximumMovementAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedBeam()
        .setAngle(this.angularP5Service.getCurrentlySelectedBeam().getAngle() - 1);
    } else if (
      this.angularP5Service.getCurrentlySelectedBeam() &&
      keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_RIGHT &&
      self.angularP5Service.getCurrentlySelectedBeam().getAngle() + 1 >=
        self.angularP5Service.getCurrentlySelectedBeam().getMinimumMovementAngle() &&
      self.angularP5Service.getCurrentlySelectedBeam().getAngle() + 1 <=
        self.angularP5Service.getCurrentlySelectedBeam().getMaximumMovementAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedBeam()
        .setAngle(this.angularP5Service.getCurrentlySelectedBeam().getAngle() + 1);
    }
  }
  /**************** KeyBoard events Hostlister - ENDS ******************/

  ngOnInit() {
    self = this;
    this.staticBeams = this.angularP5Service.getStaticBeams();
    this.getRoomConfiguration();
    this.angularP5Service.retriveStaticBeamData();
    this.angularP5Service.updateBeamTypeData(AUDIO_CONSTANTS.BEAM_TYPES.STATIC);
    this.mediaObervableForWeb();
    this.angularP5Service.calculateNumberOfBeams();
    if (this.isDesktopApp) {
      this.subscibeToScreenWidthHeight();
    }
  }

  mediaObervableForWeb() {
    if (!this.isDesktopApp) {
      this.subscribtions.add(
        this.mediaObserver.asObservable().subscribe(() => {
          if (this.mediaObserver.isActive('xl')) {
            this.screenWidthHeight = 'xl';
            this.canvasWidth = this.microphoneConfigJson.canvasConstrain.fullScreenWidth;
            this.canvasHeight = this.microphoneConfigJson.canvasConstrain.fullScreenHeight;
          } else if (this.mediaObserver.isActive('xs')) {
            this.screenWidthHeight = 'xs';
            this.canvasWidth = this.microphoneConfigJson.canvasConstrain.webCanvas.xsWidth;
            this.canvasHeight = this.microphoneConfigJson.canvasConstrain.webCanvas.xsHeight;
          } else if (this.mediaObserver.isActive('md') || this.mediaObserver.isActive('lg')) {
            this.screenWidthHeight = 'md-lg';
            this.canvasWidth = this.microphoneConfigJson.canvasConstrain.webCanvas.mdlgWidth;
            this.canvasHeight = this.microphoneConfigJson.canvasConstrain.webCanvas.mdlgHeight;
          }
          setTimeout(() => {
            if (this.canvasWidth && this.canvasHeight) {
              this.p5.resizeCanvas(this.canvasWidth, this.canvasHeight);
            }
          });
        }),
      );
    }
  }

  get isFullScreen() {
    return this.applicationDataManagerService.listenForAppData(AppConstants.AUDIO_BEAMS_EXPANDED);
  }

  subscibeToScreenWidthHeight() {
    this.applicationDataManagerService
      .listenForAppData(AppConstants.SCREEN_WIDTH_HEIGHT)
      .pipe(takeUntil(this.subscribeOnFullScreen))
      .subscribe((screenWidthHeight: [number, number]) => {
        if (screenWidthHeight && screenWidthHeight[0] !== -1 && screenWidthHeight[1] !== -1) {
          const [width, height] = screenWidthHeight;
          this.screenWidth = width;
          if ((height - 100) * 1.5172 < width) {
            const calculatedCanvasWidth = (height - 100) * 1.5172;
            const calculatedCanvasHeight = calculatedCanvasWidth / 1.7742;
            this.canvasWidth = calculatedCanvasWidth;
            this.canvasHeight = calculatedCanvasHeight;
          } else {
            const calculatedCanvasWidth = width - 50;
            const calculatedCanvasHeight = calculatedCanvasWidth / 1.7742;
            this.canvasWidth = calculatedCanvasWidth;
            this.canvasHeight = calculatedCanvasHeight;
          }
        } else {
          this.canvasWidth = this.microphoneConfigJson.canvasConstrain.width;
          this.canvasHeight = this.microphoneConfigJson.canvasConstrain.height;
        }
        setTimeout(() => {
          this.p5.resizeCanvas(this.canvasWidth, this.canvasHeight);
        });
      });
  }

  getRoomConfiguration() {
    this.subscribtions.add(
      this.angularP5Service.getRoomDepth().subscribe((roomDepth: number) => {
        this.roomDepth = roomDepth;
      }),
    );
    this.subscribtions.add(
      this.angularP5Service.getRoomWidth().subscribe((roomWidth: number) => {
        this.roomWidth = roomWidth;
      }),
    );
  }
  ngAfterViewInit(): void {
    this.createCanvas();
  }
  createCanvas() {
    this.p5 = new p5(this.sketch, this.overlayContainer.nativeElement);
    this.p5.passValue(this);
  }
  destroyCanvas() {
    this.p5.noCanvas();
  }
  public beamSelected(selectedBeamIndex: number) {
    this.angularP5Service.setCurrentlySelectedBeamIndex(selectedBeamIndex);
    this.angularP5Service.setBeamDeleteButtonColor(this.staticBeams[selectedBeamIndex].selectesBeamColor);
    if (this.angularP5Service.getNumberOfBeams().value > 1) {
      this.angularP5Service.setIsDeleteHiddenStatic(false);
    } else {
      this.angularP5Service.setIsDeleteHiddenStatic(true);
    }
  }
  public beamUnSelected() {
    this.angularP5Service.setBeamDeleteButtonColor(null);
    this.angularP5Service.setCurrentlySelectedBeamIndex(-1);
    this.angularP5Service.setIsDeleteHiddenStatic(true);
  }
  updateStaticBeamData() {
    if (this.angularP5Service.getCurrentlySelectedBeam() !== null) {
      const functionUpdateStaticBeamAngle = this.angularP5Service.updateStaticBeamAngle.bind(
        this.angularP5Service,
        this.angularP5Service.getCurrentlySelectedBeamIndex(),
      );
      this.utilityService.debounce(functionUpdateStaticBeamAngle, 250);
    }
  }
  updateCurrentBeam(selectedBeam: Beam) {
    if (selectedBeam === null) {
      this.angularP5Service.setCurrentlySelectedBeam(null);
      this.staticBeams.forEach((beam: Beam, index: number) => {
        if (beam.getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) {
          this.staticBeams[index].setIsSelected(false);
        }
      });
    } else {
      this.angularP5Service.setCurrentlySelectedBeam(selectedBeam);
      this.staticBeams.forEach((beam: Beam, index: number) => {
        if (beam.getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) {
          if (this.staticBeams[index].getSelectesBeamColor() === selectedBeam.getSelectesBeamColor()) {
            this.staticBeams[index].setIsSelected(true);
          } else {
            this.staticBeams[index].setIsSelected(false);
          }
        }
      });
    }
  }
  updateCurrentHovered(hoveredBeam: Beam) {
    if (hoveredBeam === null) {
      this.currentlyHoveredBeam = null;
      this.staticBeams.forEach((beam: Beam, index: number) => {
        this.staticBeams[index].setIsHovered(false);
      });
    } else {
      this.currentlyHoveredBeam = hoveredBeam;
      this.staticBeams.forEach((beam: Beam, index: number) => {
        if (this.staticBeams[index].getSelectesBeamColor() === hoveredBeam.getSelectesBeamColor()) {
          this.staticBeams[index].setIsHovered(true);
        } else {
          this.staticBeams[index].setIsHovered(false);
        }
      });
    }
  }
  // tslint:disable-next-line: cognitive-complexity
  sketch(p: any) {
    let component: any = {};
    let radius = 0;
    let canvas = null;
    let isMousePressed = false;
    let isMouseDargged = false;
    let clickCount = 0;
    const isCoordinateInsideBeam = (coordinate: Coordinate) => {
      let i = 0;
      let returnValue = false;
      const mouseRadius = Math.sqrt(Math.pow(p.mouseX - p.width / 2, 2) + Math.pow(p.mouseY - p.height, 2));
      for (; i < self.staticBeams.length; i += 1) {
        if (self.staticBeams[i].getAngle() !== self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) {
          if (
            p5Helper.default.isCoordinateInstdeTriangle(coordinate, self.staticBeams[i]) &&
            p5Helper.default.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight) &&
            mouseRadius > radius * self.microphoneConfigJson.beamComponent.beamConstrain.mouseDragConstrainFactor
          ) {
            returnValue = true;
            p.cursor(p.MOVE);
            self.updateCurrentHovered(self.staticBeams[i]);
            break;
          } else {
            p.cursor(p.ARROW);
            self.updateCurrentHovered(null);
          }
        }
      }
      return returnValue;
    };
    const isCoordinateInsideBeamAndUpdateSelect = (coodinate: Coordinate) => {
      let i = 0;
      let returnValue = false;
      clickCount = 1;
      const mouseRadius = Math.sqrt(Math.pow(p.mouseX - p.width / 2, 2) + Math.pow(p.mouseY - p.height, 2));
      if (p5Helper.default.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight)) {
        for (; i < self.staticBeams.length; i += 1) {
          if (
            self.staticBeams[i].getAngle() !== self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
            p5Helper.default.isCoordinateInstdeTriangle(coodinate, self.staticBeams[i]) &&
            mouseRadius > radius * self.microphoneConfigJson.beamComponent.beamConstrain.mouseDragConstrainFactor
          ) {
            returnValue = true;
            self.updateCurrentBeam(self.staticBeams[i]);
            self.beamSelected(i);
          }
        }
      } else {
        self.updateCurrentBeam(null);
        self.beamUnSelected();
      }
      return returnValue;
    };
    const drawStaticBeams = () => {
      self.staticBeams.forEach((beam: Beam, index: number) => {
        if (beam.getAngle() !== self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) {
          p5Helper.default.calculateStaticBeamCoordinates(
            beam,
            self.beamWidth,
            beam.amm === 1 ? radius * 1.25 : radius * 0.9,
            self.roomWidth,
            self.roomDepth,
            { canvasHeight: self.canvasHeight, canvasWidth: self.canvasWidth },
          );
          p.stroke(255);
          if (beam.getIsSelected()) {
            p.strokeWeight(2);
            p.fill(beam.getSelectesBeamColor());
            self.isDeleteHiddenStatic = true;
          } else if (beam.getIsHovered()) {
            p.strokeWeight(1);
            p.fill(beam.getSelectesBeamColor());
          } else {
            p.strokeWeight(1);
            p.fill(beam.getNonSelectesBeamColor());
          }
          p.triangle(
            beam.getBeamCoordinates().getTriangleCoordinates()[0].X,
            beam.getBeamCoordinates().getTriangleCoordinates()[0].Y,
            beam.getBeamCoordinates().getTriangleCoordinates()[1].X,
            beam.getBeamCoordinates().getTriangleCoordinates()[1].Y,
            beam.getBeamCoordinates().getTriangleCoordinates()[2].X,
            beam.getBeamCoordinates().getTriangleCoordinates()[2].Y,
          );
        }
      });
      self.angularP5Service.calculateNumberOfBeams();
    };
    p.setup = () => {
      if (self && self.canvasWidth && self.canvasHeight) {
        canvas = p.createCanvas(self.canvasWidth, self.canvasHeight);
      }
    };
    p.passValue = (componentScopeVariable: any) => {
      component = componentScopeVariable;
    };
    /************** Mouse Events *************************/
    p.mousePressed = () => {
      if (
        p5Helper.default.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight) &&
        !isCoordinateInsideBeamAndUpdateSelect(new Coordinate(p.mouseX, p.mouseY))
      ) {
        clickCount = 2;
        self.updateCurrentBeam(null);
        self.beamUnSelected();
        isMousePressed = true;
      }
    };
    p.mouseReleased = () => {
      if (self.angularP5Service.getCurrentlySelectedBeam()) {
        isMousePressed = false;
        clickCount = 0;
        if (isMouseDargged) {
          self.updateStaticBeamData();
          isMouseDargged = false;
        }
        self.angularP5Service.initBeamMovementProperties();
      }
    };
    p.mouseDragged = () => {
      isMouseDargged = true;
      const mouseDraggedAngle = p5Helper.default.getAngleFromCoordinates(p.mouseX - p.width / 2, p.mouseY - p.height);
      const dxy =
        (mouseDraggedAngle < 0
          ? (p.mouseX - p.pmouseX - (p.mouseY - p.pmouseY)) / 2
          : (p.mouseX - p.pmouseX + (p.mouseY - p.pmouseY)) / 2) /
        self.microphoneConfigJson.beamComponent.beamConstrain.mouseRelativeMovementCorrector;
      if (
        clickCount === 1 &&
        p5Helper.default.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight) &&
        self.angularP5Service.getCurrentlySelectedBeam() !== null &&
        self.angularP5Service.getCurrentlySelectedBeam().getAngle() + dxy >=
          self.angularP5Service.getCurrentlySelectedBeam().getMinimumMovementAngle() &&
        self.angularP5Service.getCurrentlySelectedBeam().getAngle() + dxy <=
          self.angularP5Service.getCurrentlySelectedBeam().getMaximumMovementAngle()
      ) {
        self.angularP5Service
          .getCurrentlySelectedBeam()
          .setAngle(self.angularP5Service.getCurrentlySelectedBeam().getAngle() + dxy);
      }
    };
    /************** Mouse Events - ENDS *************************/
    p.draw = () => {
      if (self) {
        radius = self.canvasWidth / 2;
        p.clear();
        p.frameRate(self.microphoneConfigJson.p5.frameRate);
        drawStaticBeams();
        isCoordinateInsideBeam(new Coordinate(p.mouseX, p.mouseY));
      }
    };
  }

  ngOnDestroy() {
    this.destroyCanvas();
    self = null;
    this.p5.remove();
    this.p5.removeElements();
    this.subscribtions.unsubscribe();
    this.subscribeOnFullScreen.next();
    this.subscribeOnFullScreen.complete();
  }
}
