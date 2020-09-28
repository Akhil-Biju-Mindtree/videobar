import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { AngularP5Service } from '../angular-p5.service';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import * as zonesP5Helper from '../zonesP5Helper';
import { Triangle } from '../p5-models/triangle';
import { Coordinate } from '../p5-models/coordinate';
import { Zone } from '../p5-models/zone';
import { AUDIO_CONSTANTS } from 'app/audio/audio.constant';
import { Subscription, Subject } from 'rxjs';
import beamsP5Helper from '../beamsP5Helper';
import { AppConstants } from '@core/constants/app.constant';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { UtilitiesService } from '@providers/utilities.service';
import { AppConfig } from '@environment/environment';
import { MediaObserver } from '@angular/flex-layout';
import { takeUntil } from 'rxjs/operators';

let self: any = null;
@Component({
  selector: 'app-zone-beams',
  templateUrl: './zone-beams.component.html',
  styleUrls: ['./zone-beams.component.scss'],
})
export class ZoneBeamsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('overlayContainer', { static: false })
  private overlayContainer: ElementRef;
  microphoneConfigJson = microphoneConfigJsonMap['default'];
  constructor(
    public angularP5Service: AngularP5Service,
    private applicationDataManagerService: ApplicationDataManagerService,
    private utilityService: UtilitiesService,
    private mediaObserver: MediaObserver,
  ) { }

  min = this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMinimumAngle;
  max = this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMaximumAngle;
  p5: any = {};
  zones: Zone[] = [];
  defaultZones: Zone[] = [];
  currentlyHoveredZone: Zone = null;
  roomHeight = this.microphoneConfigJson.meetingRoomConfig.height;
  roomWidth = this.microphoneConfigJson.meetingRoomConfig.width;
  roomDepth = this.microphoneConfigJson.meetingRoomConfig.depth;
  cameraHeight = this.microphoneConfigJson.meetingRoomConfig.cameraHeight;
  zoneBaseIcon = AUDIO_CONSTANTS.ICON.ZONES_MICROPHONE_BASE_ICON;
  canvasWidth = this.microphoneConfigJson.canvasConstrain.width;
  canvasHeight = this.microphoneConfigJson.canvasConstrain.height;
  subscribtions: Subscription = new Subscription();
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
    if (
      keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_LEFT ||
      keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_RIGHT ||
      keyValue === AUDIO_CONSTANTS.KEY_CODES.MINUS ||
      keyValue === AUDIO_CONSTANTS.KEY_CODES.PLUS ||
      keyValue === AUDIO_CONSTANTS.KEY_CODES.PLUS_EXTENDED
    ) {
      this.updateZoneBeamData();
    }
  }
  @HostListener('document:keydown', ['$event'])
  keyPressed(event: KeyboardEvent) {
    if (this.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC) {
      const keyValue = event.key;
      if (this.angularP5Service.getCurrentlySelectedZone() && keyValue === AUDIO_CONSTANTS.KEY_CODES.MINUS) {
        this.decreaseZoneArea();
      } else if (
        this.angularP5Service.getCurrentlySelectedZone() &&
        (keyValue === AUDIO_CONSTANTS.KEY_CODES.PLUS || keyValue === AUDIO_CONSTANTS.KEY_CODES.PLUS_EXTENDED)
      ) {
        this.increaseZoneArea();
      } else if (
        this.angularP5Service.getCurrentlySelectedZone() &&
        keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_RIGHT &&
        this.angularP5Service.getCurrentlySelectedZoneIndex() === 1 &&
        self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1 >=
          self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
        self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1 <=
          self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
        self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1 >=
          self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
        self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1 <=
          self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
      ) {
        this.angularP5Service
          .getCurrentlySelectedZone()
          .setStartAngle(this.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1);
        this.angularP5Service
          .getCurrentlySelectedZone()
          .setEndAngle(this.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1);
      } else if (
        this.angularP5Service.getCurrentlySelectedZone() &&
        keyValue === AUDIO_CONSTANTS.KEY_CODES.ARROW_LEFT &&
        this.angularP5Service.getCurrentlySelectedZoneIndex() === 1 &&
        self.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1 >=
          self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
        self.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1 <=
          self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
        self.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1 >=
          self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
        self.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1 <=
          self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
      ) {
        this.angularP5Service
          .getCurrentlySelectedZone()
          .setStartAngle(this.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1);
        this.angularP5Service
          .getCurrentlySelectedZone()
          .setEndAngle(this.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1);
      }
    }
  }
  /**************** KeyBoard events Hostlister - ENDS ******************/
  ngOnInit() {
    self = this;
    this.zones = this.angularP5Service.getZones();
    this.initDefaultZones();
    this.getRoomConfiguration();
    this.mediaObervableForWeb();
    if (this.isDesktopApp) {
      this.subscibeToScreenWidthHeight();
    }
  }

  initDefaultZones() {
    this.defaultZones.push(
      new Zone(
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMinimumAngle,
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneRestrictedMinimum,
        AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM,
      ),
    );
    this.defaultZones.push(
      new Zone(
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneRestrictedMaximum,
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMaximumAngle,
        AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM,
      ),
    );
    for (let i = 0; i < this.defaultZones.length; i += 1) {
      this.defaultZones[i].setNonSelectedZoneColor(this.microphoneConfigJson.zoneComponent.zoneColours.notSelected);
      this.defaultZones[i].setSelectesZoneColor(this.microphoneConfigJson.zoneComponent.zoneColours.Selected);
      this.defaultZones[i].setIsSelected(false);
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
            this.p5.resizeCanvas(this.canvasWidth, this.canvasHeight);
          });
        }),
      );
    }
  }

  get isFullScreen() {
    return this.applicationDataManagerService.listenForAppData(AppConstants.AUDIO_BEAMS_EXPANDED);
  }
  /* subscribing for fulscreen change and changing canvas diamentions according to that.*/
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
          if (this.canvasWidth && this.canvasHeight) {
            this.p5.resizeCanvas(this.canvasWidth, this.canvasHeight);
          }
        });
      });
  }
  /******************* Keyboard dependent methods ************************/
  decreaseZoneArea() {
    if (
      this.angularP5Service.getCurrentlySelectedZoneIndex() === 0 &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setEndAngle(this.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1);
    } else if (
      this.angularP5Service.getCurrentlySelectedZoneIndex() === 2 &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setStartAngle(this.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1);
    } else if (
      this.angularP5Service.getCurrentlySelectedZoneIndex() === 1 &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() +
        this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle <=
        this.angularP5Service.getCurrentlySelectedZone().getEndAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setStartAngle(this.angularP5Service.getCurrentlySelectedZone().getStartAngle() + 1);
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setEndAngle(this.angularP5Service.getCurrentlySelectedZone().getEndAngle() - 1);
    }
  }
  increaseZoneArea() {
    if (
      this.angularP5Service.getCurrentlySelectedZoneIndex() === 0 &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setEndAngle(this.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1);
    } else if (
      this.angularP5Service.getCurrentlySelectedZoneIndex() === 2 &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setStartAngle(this.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1);
    } else if (
      this.angularP5Service.getCurrentlySelectedZoneIndex() === 1 &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1 >=
        this.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
      this.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1 <=
        this.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
    ) {
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setStartAngle(this.angularP5Service.getCurrentlySelectedZone().getStartAngle() - 1);
      this.angularP5Service
        .getCurrentlySelectedZone()
        .setEndAngle(this.angularP5Service.getCurrentlySelectedZone().getEndAngle() + 1);
    }
  }
  /******************* Keyboard dependent methods - ENDS ************************/
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
  }
  private destroyCanvas() {
    this.p5.noCanvas();
  }
  public zoneSelected(selectedZoneIndex: number) {
    this.angularP5Service.setCurrentlySelectedZoneIndex(selectedZoneIndex);
    if (selectedZoneIndex === 1) {
      this.angularP5Service.setIsDeleteHiddenZone(false);
    } else {
      this.angularP5Service.setIsDeleteHiddenZone(true);
    }
  }
  public zoneUnselected() {
    this.angularP5Service.setIsDeleteHiddenZone(true);
    this.angularP5Service.setCurrentlySelectedZone(null);
    this.angularP5Service.setCurrentlySelectedZoneIndex(-1);
  }
  public updateZoneBeamData() {
    if (this.angularP5Service.getCurrentlySelectedZone() !== null) {
      const functionUpdateZoneBeamAngle = this.angularP5Service.updateZoneBeamAngle.bind(
        this.angularP5Service,
        this.angularP5Service.getCurrentlySelectedZoneIndex(),
      );
      this.utilityService.debounce(functionUpdateZoneBeamAngle, 250);
    }
  }
  public updateCurrentZone(selectedZone: Zone) {
    if (selectedZone === null) {
      this.angularP5Service.setCurrentlySelectedZone(null);
      this.zones.forEach((zone: Zone, index: number) => {
        this.zones[index].setIsSelected(false);
      });
    } else {
      this.angularP5Service.setCurrentlySelectedZone(selectedZone);
      this.zones.forEach((beam: Zone, index: number) => {
        if (this.zones[index] === selectedZone) {
          this.zones[index].setIsSelected(true);
        } else {
          this.zones[index].setIsSelected(false);
        }
      });
    }
  }
  public updateCurrentHoveredZone = (hoveredZone: Zone) => {
    if (hoveredZone === null) {
      this.currentlyHoveredZone = null;
      this.zones.forEach((zone: Zone, index: number) => {
        this.zones[index].setIsHovered(false);
      });
    } else {
      this.currentlyHoveredZone = hoveredZone;
      this.zones.forEach((zone: Zone, index: number) => {
        if (this.zones[index] === hoveredZone) {
          this.zones[index].setIsHovered(true);
        } else {
          this.zones[index].setIsHovered(false);
        }
      });
    }
  }
  // tslint:disable-next-line: no-big-function cognitive-complexity
  sketch(p: any) {
    let radius = 0;
    let isMousePressed = false;
    let isMouseDragged = false;
    let clickCount = 0;
    /**Cursor changing according to position.
     * Zone left or right show resize cursor
     * middle zone if dragging is enabled for both angles show move cursor.
     * if only one angle is enabled for dragging show resize cursor.
     */
    const mouseCursor = (zone: Zone) => {
      if (
        zone.getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM ||
        zone.getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM ||
        zone.getToBeDraggedAngle() !== AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH ||
        (zone.getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH &&
          (zonesP5Helper.default.getDistanceBetweenTwoPoints(
            new Coordinate(p.mouseX, p.mouseY),
            zone.getSelectorCircleCoordinate()[0],
          ) <= self.microphoneConfigJson.zoneComponent.zoneDragHandleDiameter ||
            zonesP5Helper.default.getDistanceBetweenTwoPoints(
              new Coordinate(p.mouseX, p.mouseY),
              zone.getSelectorCircleCoordinate()[1],
            ) <= self.microphoneConfigJson.zoneComponent.zoneDragHandleDiameter))
      ) {
        return 'ew-resize';
      }
      return p.MOVE;
    };
    const isCoordinateInsideZone = (coordinate: Coordinate, majorAxis: number, minorAxis: number) => {
      let i = 0;
      let returnValue = false;
      const mouseRadius = Math.sqrt(Math.pow(p.mouseX - p.width / 2, 2) + Math.pow(p.mouseY - p.height, 2));
      if (self.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC) {
        for (; i < self.zones.length; i += 1) {
          if (
            mouseRadius > radius * self.microphoneConfigJson.beamComponent.beamConstrain.mouseDragConstrainFactor &&
            zonesP5Helper.default.isCoordinateInstdeTriangle(coordinate, self.zones[i], majorAxis, minorAxis) &&
            beamsP5Helper.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight)
          ) {
            returnValue = true;
            const cursor = mouseCursor(self.zones[i]);
            p.cursor(cursor);
            self.updateCurrentHoveredZone(self.zones[i]);
            break;
          } else {
            p.cursor(p.ARROW);
            self.updateCurrentHoveredZone(null);
          }
        }
      }
      return returnValue;
    };
    const isCoordinateInsideZoneAndUpdateSelect = (coordinate: Coordinate) => {
      let i = 0;
      let returnValue = false;
      clickCount = 1;
      if (self.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC) {
        const newDepth = 21 + (35 - self.roomDepth);
        const majorAxis = self.roomWidth >= 9 ? (radius * (9 + (self.roomWidth - 9) / 4.5)) / 9 : radius;
        const minorAxis =
          self.roomWidth >= 9
            ? (radius * 1.33 * 14) / newDepth
            : (radius * 1.33 * 14 * ((5 + (self.roomWidth - 5) / 3) / 6.2)) / newDepth;
        if (beamsP5Helper.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight)) {
          for (; i < self.zones.length; i += 1) {
            if (
              self.zones[i].getStartAngle() !== self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
              self.zones[i].getEndAngle() !== self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
              zonesP5Helper.default.isCoordinateInstdeTriangle(coordinate, self.zones[i], majorAxis, minorAxis)
            ) {
              returnValue = true;
              self.updateCurrentZone(self.zones[i]);
              self.zoneSelected(i);
            }
          }
        } else {
          self.updateCurrentZone(null);
          self.zoneUnselected();
        }
      }
      return returnValue;
    };
    const isMouseInZoneDragableHandle = (): boolean => {
      let i = 0;
      let returnValue = false;
      if (self.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC) {
        for (; i < self.zones.length; i += 1) {
          if (self.zones[i].getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM) {
            const mouseDistanceFromDragHandle = zonesP5Helper.default.getDistanceBetweenTwoPoints(
              new Coordinate(p.mouseX, p.mouseY),
              self.zones[i].getSelectorCircleCoordinate()[0],
            );

            if (mouseDistanceFromDragHandle <= self.microphoneConfigJson.zoneComponent.zoneDragHandleDiameter) {
              self.zones[i].setToBeDraggedAngle(AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM);
              returnValue = true;
            }
          } else if (self.zones[i].getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM) {
            const mouseDistanceFromDragHandle = zonesP5Helper.default.getDistanceBetweenTwoPoints(
              new Coordinate(p.mouseX, p.mouseY),
              self.zones[i].getSelectorCircleCoordinate()[1],
            );

            if (mouseDistanceFromDragHandle <= self.microphoneConfigJson.zoneComponent.zoneDragHandleDiameter) {
              self.zones[i].setToBeDraggedAngle(AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM);
              returnValue = true;
            }
          } else if (self.zones[i].getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH) {
            const mouseDistanceFromDragHandleOne = zonesP5Helper.default.getDistanceBetweenTwoPoints(
              new Coordinate(p.mouseX, p.mouseY),
              self.zones[i].getSelectorCircleCoordinate()[0],
            );
            const mouseDistanceFromDragHandleTwo = zonesP5Helper.default.getDistanceBetweenTwoPoints(
              new Coordinate(p.mouseX, p.mouseY),
              self.zones[i].getSelectorCircleCoordinate()[1],
            );
            if (
              mouseDistanceFromDragHandleOne <= self.microphoneConfigJson.zoneComponent.zoneDragHandleDiameter &&
              self.zones[1].getToBeDraggedAngle() !== AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM
            ) {
              self.zones[i].setToBeDraggedAngle(AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM);
              returnValue = true;
            }
            if (
              mouseDistanceFromDragHandleTwo <= self.microphoneConfigJson.zoneComponent.zoneDragHandleDiameter &&
              self.zones[1].getToBeDraggedAngle() !== AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM
            ) {
              self.zones[i].setToBeDraggedAngle(AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM);
              returnValue = true;
            }
          }
        }
      }
      return returnValue;
    };
    const calculateZoneCoordinates = (zone: Zone, majorAxis: number, minorAxis: number, index: number) => {
      const zoneMinimumAngle =
        (360 - zone.getStartAngle() + self.microphoneConfigJson.beamComponent.beamConstrain.offset) *
        (Math.PI / self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
      const zoneMaximumAngle =
        (360 - zone.getEndAngle() + self.microphoneConfigJson.beamComponent.beamConstrain.offset) *
        (Math.PI / self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
      const zoneBeamAngle = Math.abs(zoneMaximumAngle - zoneMinimumAngle);
      zone.setZoneBeamAngle(zoneBeamAngle);
      const triangleCoordinates: Coordinate[] = [];
      // Calulate the Zone Coordinates Store it the respective zone objects
      triangleCoordinates.push(new Coordinate(self.canvasWidth / 2, self.canvasHeight));
      triangleCoordinates.push(
        new Coordinate(
          self.canvasWidth / 2 + majorAxis * Math.cos(zoneMinimumAngle),
          self.canvasHeight - minorAxis * Math.sin(zoneMinimumAngle),
        ),
      );
      triangleCoordinates.push(
        new Coordinate(
          self.canvasWidth / 2 + majorAxis * Math.cos(zoneMaximumAngle),
          self.canvasHeight - minorAxis * Math.sin(zoneMaximumAngle),
        ),
      );
      zone.setZoneCoordinates(new Triangle(triangleCoordinates));
      // Calulate the Zone Drag Handle Coordinates Store it the respective zone objects
      /** calculate circluar co ordinates which should be drawn on edge of zones and to determine which side is dragable*/
      const circleCoordinates: Coordinate[] = [];
      const sideLineCoordinates: Coordinate[] = [];
      sideLineCoordinates.push(
        new Coordinate(
          self.canvasWidth / 2 + majorAxis * Math.cos(zoneMinimumAngle),
          self.canvasHeight - minorAxis * Math.sin(zoneMinimumAngle),
        ),
      );
      sideLineCoordinates.push(
        new Coordinate(
          self.canvasWidth / 2 + majorAxis * Math.cos(zoneMaximumAngle),
          self.canvasHeight - minorAxis * Math.sin(zoneMaximumAngle),
        ),
      );
      circleCoordinates.push(
        new Coordinate(
          self.canvasWidth / 2 + ((3 * majorAxis) / 4) * Math.cos(zoneMinimumAngle),
          self.canvasHeight - ((3 * minorAxis) / 4) * Math.sin(zoneMinimumAngle),
        ),
      );
      circleCoordinates.push(
        new Coordinate(
          self.canvasWidth / 2 + ((3 * majorAxis) / 4) * Math.cos(zoneMaximumAngle),
          self.canvasHeight - ((3 * minorAxis) / 4) * Math.sin(zoneMaximumAngle),
        ),
      );
      zone.setSideLineCoordinates(sideLineCoordinates);
      zone.setSelectorCircleCoordinate(circleCoordinates);
    };
    const drawArc = (triangle: Triangle, majorAxis: number, minorAxis: number) => {
      let angleOne = Math.atan(
        (triangle.getTriangleCoordinates()[1].Y - triangle.getTriangleCoordinates()[0].Y) /
          (triangle.getTriangleCoordinates()[1].X - triangle.getTriangleCoordinates()[0].X),
      );
      let angleTwo = Math.atan(
        (triangle.getTriangleCoordinates()[2].Y - triangle.getTriangleCoordinates()[0].Y) /
          (triangle.getTriangleCoordinates()[2].X - triangle.getTriangleCoordinates()[0].X),
      );
      angleOne = angleOne > 0 ? p.PI + angleOne : angleOne;
      if (angleTwo > 0 && angleTwo < p.PI) {
        angleTwo += p.PI;
      }
      if (angleTwo.toFixed(10) === p.PI.toFixed(10)) {
        angleTwo = p.PI / 2;
      }
      if (angleOne.toFixed(10) === p.PI.toFixed(10)) {
        angleOne = p.PI / 2;
      }
      p.arc(
        triangle.getTriangleCoordinates()[0].X,
        triangle.getTriangleCoordinates()[0].Y,
        2 * majorAxis,
        2 * minorAxis,
        angleOne,
        angleTwo,
        p.PIE,
      );
    };
    const drawZones = (majorAxis: number, minorAxis: number, zones: Zone[]) => {
      zones.forEach((zone: Zone, index: number) => {
        calculateZoneCoordinates(zone, majorAxis, minorAxis, index);
        p.stroke(255);
        if (zone.getIsSelected() || zone.getIsHovered()) {
          p.strokeWeight(1.5);
          p.fill(zone.getSelectedZoneColor());
        } else {
          p.strokeWeight(1);
          p.fill(zone.getNonSelectedZoneColor());
        }
        if (
          zone.getStartAngle() !== self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
          zone.getEndAngle() !== self.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
        ) {
          drawArc(zone.getZoneCoordinates(), majorAxis, minorAxis);
        }
        if (zone.getIsSelected() || zone.getIsHovered()) {
          p.stroke(255);
          p.strokeWeight(3);
          if (zone.getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM) {
            p.line(
              self.canvasWidth / 2,
              self.canvasHeight,
              zone.getSideLineCoordinates()[0].X,
              zone.getSideLineCoordinates()[0].Y,
            );
          } else if (zone.getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM) {
            p.line(
              self.canvasWidth / 2,
              self.canvasHeight,
              zone.getSideLineCoordinates()[1].X,
              zone.getSideLineCoordinates()[1].Y,
            );
          } else if (zone.getEnabledDragHandle() === AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH) {
            p.line(
              self.canvasWidth / 2,
              self.canvasHeight,
              zone.getSideLineCoordinates()[0].X,
              zone.getSideLineCoordinates()[0].Y,
            );
            p.line(
              self.canvasWidth / 2,
              self.canvasHeight,
              zone.getSideLineCoordinates()[1].X,
              zone.getSideLineCoordinates()[1].Y,
            );
          }
        }
      });
    };
    p.setup = () => {
      p.createCanvas(self.canvasWidth, self.canvasHeight);
    };
    /***************************** Mouse Events methods **************************/
    p.mousePressed = () => {
      if (
        self.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC &&
        beamsP5Helper.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight) &&
        !isCoordinateInsideZoneAndUpdateSelect(new Coordinate(p.mouseX, p.mouseY))
      ) {
        clickCount = 2;
        self.updateCurrentZone(null);
        self.zoneUnselected();
        isMousePressed = true;
      }
    };
    p.mouseReleased = () => {
      if (
        self.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC &&
        self.angularP5Service.getCurrentlySelectedZone()
      ) {
        isMousePressed = false;
        clickCount = 0;
        if (
          self.angularP5Service.getCurrentlySelectedZone() !== null &&
          self.angularP5Service.getCurrentlySelectedZone().getEnabledDragHandle() ===
            AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH
        ) {
          self.angularP5Service
            .getCurrentlySelectedZone()
            .setToBeDraggedAngle(AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH);
        }
        if (isMouseDragged) {
          self.updateZoneBeamData();
          isMouseDragged = false;
        }
      }
    };
    p.mouseDragged = () => {
      if (self.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC && clickCount === 1) {
        isMouseDragged = true;
        const mouseDraggedAngle = zonesP5Helper.default.getAngleFromCoordinates(
          p.mouseX - p.width / 2,
          p.mouseY - p.height,
        );
        const dxy =
          (mouseDraggedAngle < 0
            ? (p.mouseX - p.pmouseX - (p.mouseY - p.pmouseY)) / 2
            : (p.mouseX - p.pmouseX + (p.mouseY - p.pmouseY)) / 2) /
          self.microphoneConfigJson.zoneComponent.zoneConstraints.mouseRelativeMovementCorrector;
        if (
          self.angularP5Service.getCurrentlySelectedZone() !== null &&
          zonesP5Helper.default.isMouseWithInCanvas(p.mouseX, p.mouseY, self.canvasWidth, self.canvasHeight)
        ) {
          if (
            self.angularP5Service.getCurrentlySelectedZone().getEnabledDragHandle() ===
              AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM &&
            self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy >=
              self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
            self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy <=
              self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
            self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy <=
              self.angularP5Service.getCurrentlySelectedZone().getEndAngle() -
                self.microphoneConfigJson.beamComponent.beamConstrain.beamAngle
          ) {
            self.angularP5Service
              .getCurrentlySelectedZone()
              .setStartAngle(self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy);
          } else if (
            self.angularP5Service.getCurrentlySelectedZone().getEnabledDragHandle() ===
              AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM &&
            self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy >=
              self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
            self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy <=
              self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
            self.angularP5Service.getCurrentlySelectedZone().getEndAngle() +
              dxy -
              self.microphoneConfigJson.beamComponent.beamConstrain.beamAngle >=
              self.angularP5Service.getCurrentlySelectedZone().getStartAngle()
          ) {
            self.angularP5Service
              .getCurrentlySelectedZone()
              .setEndAngle(self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy);
          } else if (
            self.angularP5Service.getCurrentlySelectedZone().getEnabledDragHandle() ===
            AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH
          ) {
            if (
              self.angularP5Service.getCurrentlySelectedZone().getToBeDraggedAngle() ===
                AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM &&
              self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy >=
                self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
              self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy <=
                self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
              self.angularP5Service.getCurrentlySelectedZone().getStartAngle() +
                dxy +
                self.microphoneConfigJson.beamComponent.beamConstrain.beamAngle <=
                self.angularP5Service.getCurrentlySelectedZone().getEndAngle()
            ) {
              self.angularP5Service
                .getCurrentlySelectedZone()
                .setStartAngle(self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy);
            } else if (
              self.angularP5Service.getCurrentlySelectedZone().getToBeDraggedAngle() ===
                AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM &&
              self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy >=
                self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
              self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy <=
                self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
              self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy >=
                self.angularP5Service.getCurrentlySelectedZone().getStartAngle() +
                  self.microphoneConfigJson.beamComponent.beamConstrain.beamAngle
            ) {
              self.angularP5Service
                .getCurrentlySelectedZone()
                .setEndAngle(self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy);
            } else if (
              self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy >=
                self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
              self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy <=
                self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle() &&
              self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy >=
                self.angularP5Service.getCurrentlySelectedZone().getMinimumMovementAngle() &&
              self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy <=
                self.angularP5Service.getCurrentlySelectedZone().getMaximumMovementAngle()
            ) {
              self.angularP5Service
                .getCurrentlySelectedZone()
                .setEndAngle(self.angularP5Service.getCurrentlySelectedZone().getEndAngle() + dxy);
              self.angularP5Service
                .getCurrentlySelectedZone()
                .setStartAngle(self.angularP5Service.getCurrentlySelectedZone().getStartAngle() + dxy);
            }
          }
        }
      }
    };
    /***************************** Mouse Events methods - ENDS **************************/
    p.draw = () => {
      if (self) {
        radius = self.canvasWidth / 2;
        const newDepth = 21 + (35 - self.roomDepth);
        const majorAxis = self.roomWidth >= 9 ? (radius * (9 + (self.roomWidth - 9) / 4.5)) / 9 : radius;
        const minorAxis =
          self.roomWidth >= 9
            ? (radius * 1.33 * 14) / newDepth
            : (radius * 1.33 * 14 * ((5 + (self.roomWidth - 5) / 3) / 6.2)) / newDepth;
        p.clear();
        p.frameRate(self.microphoneConfigJson.p5.frameRate);
        if (self.angularP5Service.getSelectedBeamType() === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC) {
          drawZones(majorAxis, minorAxis, self.zones);
          isCoordinateInsideZone(new Coordinate(p.mouseX, p.mouseY), majorAxis, minorAxis);
          isMouseInZoneDragableHandle();
        } else {
          drawZones(majorAxis, minorAxis, self.defaultZones);
        }
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
