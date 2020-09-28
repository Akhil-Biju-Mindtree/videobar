import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { AngularP5Service } from '../angular-p5.service';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import { Beam } from '../p5-models/beam';
import { AUDIO_CONSTANTS } from 'app/audio/audio.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { Subscription, Subject } from 'rxjs';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import * as p5Helper from '../beamsP5Helper';
import { MediaObserver } from '@angular/flex-layout';
import { AppConfig } from '@environment/environment';
import { takeUntil } from 'rxjs/operators';

let self: any = null;
@Component({
  selector: 'app-dynamic-beams',
  templateUrl: './dynamic-beams.component.html',
  styleUrls: ['./dynamic-beams.component.scss'],
})
export class DynamicBeamsComponent implements OnInit, OnDestroy, AfterViewInit {
  microphoneConfigJson = microphoneConfigJsonMap['default'];
  @ViewChild('overlayContainer', { static: false })
  private overlayContainer: ElementRef;
  constructor(
    private angularP5Service: AngularP5Service,
    private deviceDataManagerService: DeviceDataManagerService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private mediaObserver: MediaObserver,
  ) { }

  p5: any = {};

  min = this.microphoneConfigJson.beamComponent.beamConstrain.minimumAngle;
  max = this.microphoneConfigJson.beamComponent.beamConstrain.maximumAngle;
  beamColors = this.microphoneConfigJson.beamComponent.beamColours.notSelected;
  beamWidth = this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle;
  runningBeamWidth = this.microphoneConfigJson.beamComponent.beamConstrain.runningBeamAngle;
  roomWidth = this.microphoneConfigJson.meetingRoomConfig.width;
  roomDepth = this.microphoneConfigJson.meetingRoomConfig.depth;

  dynamicBeams: Beam[] = [];
  runningBeam: Beam = new Beam(0);
  subscribtions: Subscription = new Subscription();
  canvasWidth = this.microphoneConfigJson.canvasConstrain.width;
  canvasHeight = this.microphoneConfigJson.canvasConstrain.height;
  isDesktopApp = AppConfig.isDesktopApp;
  screenWidth: number;
  screenHeight: number;
  subscribeOnFullScreen = new Subject<void>();

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.ngOnDestroy();
  }

  ngOnInit() {
    self = this;
    this.angularP5Service.updateBeamTypeData(AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC);
    this.dynamicBeams = this.angularP5Service.getDynamicBeams();
    this.getRoomConfigguration();
    this.runningBeam = this.angularP5Service.getRunningBeams();
    this.angularP5Service.subscribeToDynamicBeamData();
    this.performAcionsToBeamEvents(AUDIO_CONSTANTS.BEAMS.PERFORM_ENABLE);
    this.mediaObervableForWeb();
    if (this.isDesktopApp) {
      this.subscibeToScreenWidthHeight();
    }
  }

  mediaObervableForWeb() {
    if (!this.isDesktopApp) {
      this.subscribtions.add(
        this.mediaObserver.asObservable().subscribe(() => {
          if (this.mediaObserver.isActive('xl')) {
            this.canvasWidth = this.microphoneConfigJson.canvasConstrain.fullScreenWidth;
            this.canvasHeight = this.microphoneConfigJson.canvasConstrain.fullScreenHeight;
          } else if (this.mediaObserver.isActive('xs')) {
            this.canvasWidth = this.microphoneConfigJson.canvasConstrain.webCanvas.xsWidth;
            this.canvasHeight = this.microphoneConfigJson.canvasConstrain.webCanvas.xsHeight;
          } else if (this.mediaObserver.isActive('md') || this.mediaObserver.isActive('lg')) {
            this.canvasWidth = this.microphoneConfigJson.canvasConstrain.webCanvas.mdlgWidth;
            this.canvasHeight = this.microphoneConfigJson.canvasConstrain.webCanvas.mdlgHeight;
          }
          setTimeout(() => {
            this.resizeCanvas();
          });
        }),
      );
    }
  }

  resizeCanvas() {
    if (this.canvasWidth && this.canvasHeight) {
      this.p5.resizeCanvas(this.canvasWidth, this.canvasHeight);
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
          this.resizeCanvas();
        });
      });
  }

  getRoomConfigguration() {
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

  private destroyCanvas() {
    this.p5.noCanvas();
  }
  performAcionsToBeamEvents(performValue: string) {
    const uuid = AUDIO_CONSTANTS.UUID.ENABLE_BEAM_EVENTS;
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Perform, { [uuid]: `${performValue}` });
  }
  sketch(p: any) {
    let component: any = {};
    let radius = 0;
    let dynamicBeams: Beam[] = [];
    let runningBeam: Beam = new Beam(0);

    const drawDynamicBeams = () => {
      dynamicBeams.forEach((beam: Beam, index: number) => {
        /** replace radius with beam.amm === -1 ? radius * 0 : beam.amm === 1 ? radius * 1.25 : radius for changing length */
        p5Helper.default.calculateStaticBeamCoordinates(
          beam,
          self.beamWidth,
          beam.amm === -1 ? radius * 0 : beam.amm === 1 ? radius * 1.25 : radius * 0.9,
          self.roomWidth,
          self.roomDepth,
          { canvasHeight: self.canvasHeight, canvasWidth: self.canvasWidth },
        );
        p.stroke(255);
        p.strokeWeight(1);
        p.fill(self.beamColors[index]);
        p.triangle(
          0,
          0,
          beam.getBeamCoordinates().getTriangleCoordinates()[1].X - p.width / 2,
          beam.getBeamCoordinates().getTriangleCoordinates()[1].Y - p.height,
          beam.getBeamCoordinates().getTriangleCoordinates()[2].X - p.width / 2,
          beam.getBeamCoordinates().getTriangleCoordinates()[2].Y - p.height,
        );
      });
      p5Helper.default.calculateStaticBeamCoordinates(
        runningBeam,
        self.runningBeamWidth,
        runningBeam.amm === -1 ? radius * 0 : runningBeam.amm === 1 ? radius * 1.25 : radius * 0.9,
        self.roomWidth,
        self.roomDepth,
        { canvasHeight: self.canvasHeight, canvasWidth: self.canvasWidth },
      );
      p.stroke(255);
      p.strokeWeight(1);
      p.fill('rgba(255, 255, 255, 0.5)');
      p.triangle(
        0,
        0,
        runningBeam.getBeamCoordinates().getTriangleCoordinates()[1].X - p.width / 2,
        runningBeam.getBeamCoordinates().getTriangleCoordinates()[1].Y - p.height,
        runningBeam.getBeamCoordinates().getTriangleCoordinates()[2].X - p.width / 2,
        runningBeam.getBeamCoordinates().getTriangleCoordinates()[2].Y - p.height,
      );
    };

    p.setup = () => {
      p.createCanvas(self.canvasWidth, self.canvasHeight);
    };

    p.passValue = (componentScopeVariable: any) => {
      component = componentScopeVariable;
      dynamicBeams = self.dynamicBeams;
      runningBeam = self.runningBeam;
    };
    p.draw = () => {
      if (self) {
        radius = self.canvasWidth / 2;
        p.clear();
        p.frameRate(self.microphoneConfigJson.p5.frameRate);
        p.translate(p.width / 2, p.height);
        drawDynamicBeams();
      }
    };
  }

  ngOnDestroy() {
    this.performAcionsToBeamEvents(AUDIO_CONSTANTS.BEAMS.PERFORM_DISABLE);
    this.destroyCanvas();
    this.angularP5Service.unSubscribeToDynamicBeamData();
    this.subscribeOnFullScreen.next();
    this.subscribeOnFullScreen.complete();
    this.p5.remove();
    this.p5.removeElements();
    this.subscribtions.unsubscribe();
  }
}
