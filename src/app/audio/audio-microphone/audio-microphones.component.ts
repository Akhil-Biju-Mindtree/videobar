import { Component, OnInit, OnDestroy, NgZone, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {
  MICROPHONE_NAVIGATION_ITEMS,
  AUDIO_CONSTANTS,
  CONFIGURE_ROOM_MENU_ITEMS,
  ExpandCollapseConstant,
} from 'app/audio/audio.constant';
import { NavigationItem } from '@shared/models/navigation.model';
import { AngularP5Service } from './angular-p5.service';
import { Subscription, Subject } from 'rxjs';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { AppConstants, CONFIGURE_ROOM_UUIDS } from '@core/constants/app.constant';
import { takeUntil, map, take } from 'rxjs/operators';
import beamsP5Helper from './beamsP5Helper';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { ServiceAdapter } from '@providers/service-adapter';
import { AppConfig } from '@environment/environment';
import { MediaObserver } from '@angular/flex-layout';
import { FabMiniModel } from '@shared/models/fab.model';
import { SharedConstants } from '@shared/shared.constants';
import { Logger } from '@core/logger/Logger';

@Component({
  selector: 'app-audio-microphones',
  templateUrl: './audio-microphones.component.html',
  styleUrls: ['./audio-microphones.component.scss'],
})
export class AudioMicrophonesComponent implements OnInit, OnDestroy {
  @ViewChild('collapseExpandButton', { static: false })
  private collapseExpandButton: ElementRef;
  escapeKey = SharedConstants.KEYBOARD_KEYS.ESCAPE_KEY;
  microphoneConfigJson = microphoneConfigJsonMap['default'];
  navigationItems: NavigationItem[] = MICROPHONE_NAVIGATION_ITEMS;
  zoneBaseIcon = AUDIO_CONSTANTS.ICON.ZONES_MICROPHONE_BASE_ICON;
  addIcon = AUDIO_CONSTANTS.ICON.ADD_ICON;
  moreIcon = AUDIO_CONSTANTS.ICON.MORE_ICON;
  zoneLeftIcon = AUDIO_CONSTANTS.ICON.ZONES_MICROPHONE_LEFT_ICON;
  zoneRightIcon = AUDIO_CONSTANTS.ICON.ZONES_MICROPHONE_RIGHT_ICON;
  deleteIcon = AUDIO_CONSTANTS.ICON.DELETE_STATIC_ICON;
  dynamicBeamType = AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC;
  canvasWidth = this.microphoneConfigJson.canvasConstrain.width;
  canvasHeight = this.microphoneConfigJson.canvasConstrain.height;
  isAddBeamDisabled = true;
  isNumberOfBeamsLessThanFour = false;
  isStaticBeamComponent = false;
  isAddExclusionZoneDisabled = false;
  isVideoStreamAvailable = false;
  isZoneEnabled = false;
  deleteButtonColor = null;
  videoOverlay: boolean;
  autoFrameInfo: boolean;
  isVideoOverlayChanged = false;
  isAutoFrameInfoChanged = false;
  subscribtions: Subscription = new Subscription();
  staticBeamSubscriptions: Subscription = new Subscription();
  zoneBeamSubscription: Subscription = new Subscription();
  ptzAutoframeSubscription: Subscription = new Subscription();
  unSubscribe: Subject<any> = new Subject();
  roomConfigurationList = CONFIGURE_ROOM_MENU_ITEMS.CONFIGURE_ROOM;
  isDesktopApp = AppConfig.isDesktopApp;
  screenWidthHeight: string;
  containerWidthStyle = {
    width: AUDIO_CONSTANTS.ROOM_CONFIG_SLIDER_WIDTH,
  };
  isMacPlatform = window.navigator.platform.includes('Mac');
  minWidthValue = this.microphoneConfigJson.meetingRoomConfig.roomWidth.minWidth;
  maxWidthValue = this.microphoneConfigJson.meetingRoomConfig.roomWidth.maxWidth;
  minDepthValue = this.microphoneConfigJson.meetingRoomConfig.roomDepth.minDepth;
  maxDepthValue = this.microphoneConfigJson.meetingRoomConfig.roomDepth.maxDepth;
  defaultDepth;
  defaultWidth;
  stepWidth = 1;
  stepDepth = 1;
  inputFields = CONFIGURE_ROOM_MENU_ITEMS.CONFIGURE_ROOM_ITEMS;
  uuidDepth = CONFIGURE_ROOM_UUIDS.ROOM_DEPTH;
  uuidWidth = CONFIGURE_ROOM_UUIDS.ROOM_WIDTH;
  enteredMicrophoneCount: number;
  screenWidth: number;
  fabMiniStyles: FabMiniModel;

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.ngOnDestroy();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (
      this.canvasWidth !== AUDIO_CONSTANTS.DIMENSIONS.NORMAL_WIDTH - 40 &&
      this.canvasHeight !== AUDIO_CONSTANTS.DIMENSIONS.NORMAL_HEIGHT &&
      event.key === this.escapeKey &&
      this.collapseExpandButton
    ) {
      this.collapseExpandButton['isButtonOn'] = true;
      this.collapseFullScreen();
    }
  }

  get isFullScreen() {
    return this.applicationDataManagerService.listenForAppData(AppConstants.AUDIO_BEAMS_EXPANDED);
  }

  constructor(
    private router: Router,
    public angularP5Service: AngularP5Service,
    private ngZone: NgZone,
    private deviceDataManagerService: DeviceDataManagerService,
    private serviceAdapter: ServiceAdapter,
    private applicationDataManagerService: ApplicationDataManagerService,
    private mediaObserver: MediaObserver,
    private loggerService: Logger,
  ) {
    this.subscribtions.add(
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          const url = event.url.split('/')[event.url.split('/').length - 1];
          if (url === AUDIO_CONSTANTS.URL.STATIC_BEAM_URL) {
            this.isStaticBeamComponent = true;
            this.ngZone.run(() => {
              this.isAddBeamDisabled = !(this.isStaticBeamComponent && this.isNumberOfBeamsLessThanFour);
            });
          } else if (url === AUDIO_CONSTANTS.URL.DYNAMIC_BEAM_URL) {
            this.isStaticBeamComponent = false;
            this.ngZone.run(() => {
              this.isAddBeamDisabled = true;
            });
          } else if (url === AUDIO_CONSTANTS.URL.AUDIO_URL && this.angularP5Service.getSelectedBeamType()) {
            const beamType = this.angularP5Service.getSelectedBeamType();
            if (beamType === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC) {
              this.router.navigateByUrl(`audio/microphones/dynamic-beams`);
            } else {
              this.router.navigateByUrl(`audio/microphones/static-beams`);
            }
          }
        }
      }),
    );
  }

  ngOnInit() {
    this.enteredMicrophoneCount = 0;
    this.beamDeleteButonSubscribtion();
    this.subScribeToNumberOfStaticBaams();
    this.angularP5Service.subscribeToBeamTypeData();
    this.angularP5Service.subscribeToAmmData();
    this.listenToStatcBeamData();
    this.listenToZoneData();
    this.listenToRoomConfigurationChanges();
    this.triggerFullScreenChanges();
    this.mediaObervableForWeb();
  }

  beamDeleteButonSubscribtion() {
    this.angularP5Service
      .getBeamDeleteButtonColor()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((deleteButtonColor: string) => {
        this.deleteButtonColor = deleteButtonColor;
      });
  }

  enableDisableMicrophoneEvents(flag: string) {
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Perform, {
      [AUDIO_CONSTANTS.UUID.ENABLE_BEAM_EVENTS]: flag,
    });
  }

  mediaObervableForWeb() {
    if (!this.isDesktopApp) {
      this.mediaObserver
        .asObservable()
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(() => {
          this.screenWidthHeight = this.mediaObserver.isActive('xl')
            ? 'xl'
            : this.mediaObserver.isActive('xs')
            ? 'xs'
            : this.mediaObserver.isActive('md') || this.mediaObserver.isActive('lg')
            ? 'md-lg'
            : '';
        });
    }
  }

  triggerFullScreenChanges() {
    if (AppConfig.isDesktopApp) {
      this.fabMiniStyles = new FabMiniModel(
        ExpandCollapseConstant.ExpandModeStyles,
        ExpandCollapseConstant.CollopseModeStyles,
        ExpandCollapseConstant.ExpandCollapseDirectvieStyles,
      );
      this.isFullScreen.pipe(takeUntil(this.unSubscribe)).subscribe((fullScreen: boolean) => {
        if (fullScreen !== undefined) {
          const currentWindow = this.serviceAdapter.remote.getCurrentWindow();
          if (fullScreen) {
            const [width, height] = [window.screen.width, window.screen.height];
            this.applicationDataManagerService.saveToAppData({ [AppConstants.SCREEN_WIDTH_HEIGHT]: [width, height] });
            if (!this.isMacPlatform) {
              currentWindow.setMinimumSize(width, height);
              currentWindow.setContentSize(width, height);
            }
            this.makeFullscreen(currentWindow, true);
            currentWindow.setMovable(false);
            setTimeout(() => {
              this.screenWidth = width;
              this.calculateCanvasSize(width, height);
            });
          } else {
            this.applicationDataManagerService.saveToAppData({ [AppConstants.SCREEN_WIDTH_HEIGHT]: [-1, -1] });
            this.makeFullscreen(currentWindow, false);
            currentWindow.setMinimumSize(
              AUDIO_CONSTANTS.DIMENSIONS.NORMAL_WIDTH,
              AUDIO_CONSTANTS.DIMENSIONS.NORMAL_HEIGHT,
            );
            currentWindow.setContentSize(
              AUDIO_CONSTANTS.DIMENSIONS.NORMAL_WIDTH,
              AUDIO_CONSTANTS.DIMENSIONS.NORMAL_HEIGHT,
            );
            this.setPosition();
            currentWindow.setMovable(true);
          }
        }
      });
    }
  }

  makeFullscreen(currentWindow: any, isFullScreen: boolean) {
    currentWindow.setFullScreenable(true);
    currentWindow.setFullScreen(isFullScreen);
    currentWindow.setFullScreenable(false);
  }

  setPosition() {
    if (this.enteredMicrophoneCount === 0) {
      this.enteredMicrophoneCount += 1;
    } else {
      this.canvasWidth = AUDIO_CONSTANTS.DIMENSIONS.NORMAL_WIDTH - 40;
      this.canvasHeight = AUDIO_CONSTANTS.DIMENSIONS.NORMAL_HEIGHT;
    }
  }

  calculateCanvasSize(width: number, height: number) {
    if ((height - 100) * 1.5172 < width) {
      this.canvasWidth = (height - 100) * 1.5172;
      this.canvasHeight = this.canvasWidth / 1.7742;
    } else {
      this.canvasWidth = width - 50;
      this.canvasHeight = this.canvasWidth / 1.7742;
    }
    const style = {
      ...ExpandCollapseConstant.CollopseModeStyles,
      width: `${this.canvasWidth * 0.045454}px`,
      height: `${this.canvasWidth * 0.045454}px`,
      marginRight: `${(this.screenWidth - this.canvasWidth) / 2}px`,
    };
    this.fabMiniStyles.offClass = style;
  }

  selectionChange(selection) {
    if (selection) {
      this.collapseFullScreen();
    } else {
      this.openFullScreen();
    }
  }

  openFullScreen() {
    this.applicationDataManagerService.saveToAppData({ [AppConstants.AUDIO_BEAMS_EXPANDED]: true });
  }

  collapseFullScreen() {
    this.applicationDataManagerService.saveToAppData({ [AppConstants.AUDIO_BEAMS_EXPANDED]: false });
  }
  onStaticBeamsDataRecived(staticBeamAngle: string, beamIndex: number, uuid: string) {
    if (
      staticBeamAngle !== AUDIO_CONSTANTS.BEAMS.STATIC_BEAM_DISABLED &&
      !this.angularP5Service.isStaticBeamDeleted(uuid)
    ) {
      const angle = -parseInt(staticBeamAngle, 10);
      if (angle !== NaN) {
        this.angularP5Service.mapAndSetStaticBeamInput(angle, beamIndex);
      }
    } else if (staticBeamAngle === AUDIO_CONSTANTS.BEAMS.STATIC_BEAM_DISABLED) {
      this.angularP5Service.staticBeams[beamIndex].setAngle(180);
      if (this.angularP5Service.getCurrentlySelectedBeamIndex() === beamIndex) {
        this.angularP5Service.setCurrentlySelectedBeam(null);
        this.angularP5Service.setCurrentlySelectedBeamIndex(-1);
        this.angularP5Service.setIsDeleteHiddenStatic(true);
      }
      if (this.angularP5Service.deletedBeamIndises.indexOf(beamIndex) === -1) {
        this.angularP5Service.deletedBeamIndises.push(beamIndex);
      }
    }
    this.angularP5Service.initBeamMovementProperties();
    this.angularP5Service.checkStaticBeamsInBoundary();
  }
  listenToStatcBeamData() {
    this.angularP5Service.setNumberOfBeams(AUDIO_CONSTANTS.BEAMS.MAX_NUMBER_OF_STATIC_BEAMS);
    this.angularP5Service.deletedBeamIndises = [];
    this.staticBeamSubscriptions.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.UUID.STATIC_ONE_ANGLE)
        .subscribe((staticBeamAngleOne: string) => {
          this.onStaticBeamsDataRecived(staticBeamAngleOne, 0, AUDIO_CONSTANTS.UUID.STATIC_ONE_ANGLE);
        }),
    );
    this.staticBeamSubscriptions.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.UUID.STATIC_TWO_ANGLE)
        .subscribe((staticBeamAngleTwo: string) => {
          this.onStaticBeamsDataRecived(staticBeamAngleTwo, 1, AUDIO_CONSTANTS.UUID.STATIC_TWO_ANGLE);
        }),
    );
    this.staticBeamSubscriptions.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.UUID.STATIC_THREE_ANGLE)
        .subscribe((staticBeamAngleThree: string) => {
          this.onStaticBeamsDataRecived(staticBeamAngleThree, 2, AUDIO_CONSTANTS.UUID.STATIC_THREE_ANGLE);
        }),
    );
    this.staticBeamSubscriptions.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.UUID.STATIC_FOUR_ANGLE)
        .subscribe((staticBeamAngleFour: string) => {
          this.onStaticBeamsDataRecived(staticBeamAngleFour, 3, AUDIO_CONSTANTS.UUID.STATIC_FOUR_ANGLE);
        }),
    );
  }
  onZoneDataReceived(zoneBeamAngle: string, index: number, angleType: string) {
    if (
      parseInt(zoneBeamAngle, 10) < this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMinimumAngle ||
      (parseInt(zoneBeamAngle, 10) > this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMaximumAngle &&
        parseInt(zoneBeamAngle, 10) < this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) ||
      parseInt(zoneBeamAngle, 10) > this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
    ) {
      return;
    }
    let updateAngle = -beamsP5Helper.round(beamsP5Helper.mapZoneInputRanges(parseInt(zoneBeamAngle, 10)));
    if (index === 0) {
      updateAngle =
        updateAngle === this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMinimumAngle
          ? updateAngle + 4
          : updateAngle;
      setTimeout(() => {
        this.angularP5Service.getZones()[0].setEndAngle(updateAngle);
      });
    } else if (index === 1 && this.isZoneEnabled) {
      this.onThirdZoneDataReceived(updateAngle, angleType);
    } else if (index === 2) {
      updateAngle =
        updateAngle === this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMaximumAngle
          ? updateAngle - 4
          : updateAngle;
      setTimeout(() => {
        this.angularP5Service.getZones()[2].setStartAngle(updateAngle);
      });
    }
    setTimeout(() => {
      this.angularP5Service.initZoneMovementProperties();
      this.angularP5Service.checkZonesAreInBoundary();
    });
  }
  onThirdZoneDataReceived(updateAngle: number, angleType: string) {
    const newupdateAngle =
      Math.abs(updateAngle) === this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
        ? this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
        : updateAngle;
    if (angleType === AUDIO_CONSTANTS.ZONES.ZONE_KEYS.START_ANGLE) {
      setTimeout(() => {
        this.angularP5Service.getZones()[1].setEndAngle(newupdateAngle);
      });
    } else if (angleType === AUDIO_CONSTANTS.ZONES.ZONE_KEYS.END_ANGLE) {
      setTimeout(() => {
        this.angularP5Service.getZones()[1].setStartAngle(newupdateAngle);
      });
    }
  }
  listenToZoneData() {
    this.zoneBeamSubscription.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_ONE.END_ANGLE_UUID)
        .subscribe((zoneBeamEndAngle: string) => {
          this.onZoneDataReceived(zoneBeamEndAngle, 2, AUDIO_CONSTANTS.ZONES.ZONE_KEYS.END_ANGLE);
        }),
    );
    this.zoneBeamSubscription.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_TWO.DELETE_ANGLE_UUID)
        .pipe(map((value: any) => value === AppConstants.StateOn))
        .subscribe((isZoneEnabled: boolean) => {
          this.ngZone.run(() => {
            this.isZoneEnabled = isZoneEnabled;
            if (!isZoneEnabled) {
              this.angularP5Service.zones[1].setEndAngle(
                this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle,
              );
              this.angularP5Service.zones[1].setEndAngle(
                this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle,
              );
            }
            if (this.angularP5Service.getCurrentlySelectedZoneIndex() === 1 && !isZoneEnabled) {
              this.angularP5Service.setCurrentlySelectedZone(null);
              this.angularP5Service.setCurrentlySelectedZoneIndex(-1);
              this.angularP5Service.setIsDeleteHiddenZone(true);
            }
          });
        }),
    );
    this.zoneBeamSubscription.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_TWO.START_ANGLE_UUID)
        .subscribe((zoneBeamStartAngle: string) => {
          if (this.isZoneEnabled) {
            this.onZoneDataReceived(zoneBeamStartAngle, 1, AUDIO_CONSTANTS.ZONES.ZONE_KEYS.START_ANGLE);
          }
        }),
    );
    this.zoneBeamSubscription.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_TWO.END_ANGLE_UUID)
        .subscribe((zoneBeamEndAngle: string) => {
          if (this.isZoneEnabled) {
            this.onZoneDataReceived(zoneBeamEndAngle, 1, AUDIO_CONSTANTS.ZONES.ZONE_KEYS.END_ANGLE);
          }
        }),
    );

    this.zoneBeamSubscription.add(
      this.deviceDataManagerService
        .listenFromDevice(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_THREE.START_ANGLE_UUID)
        .subscribe((zoneBeamStartingAngle: string) => {
          this.onZoneDataReceived(zoneBeamStartingAngle, 0, AUDIO_CONSTANTS.ZONES.ZONE_KEYS.START_ANGLE);
        }),
    );
  }
  onChangeVideoStatus(isVideoStreamAvailable: boolean) {
    this.ngZone.run(() => {
      this.isVideoStreamAvailable = isVideoStreamAvailable;
      if (!isVideoStreamAvailable) {
        this.collapseFullScreen();
      } else {
        this.enableDisableMicrophoneEvents(AUDIO_CONSTANTS.BEAMS.PERFORM_ENABLE);
        this.resetPTZAutoFraming();
        this.listenForVideoOverlay();
        this.listenForAutoframeInformation();
      }
    });
  }
  resetPTZAutoFraming() {
    /**
     * Autoframe changes reflects only when video is streaming.
     * Autoframe need to be turned off after delay of 6s otherwise AF will work eventhough it is off.
     * Once AF is turned off device will set PTZ to AF values no need to reset it after few delay.
     */
    this.loggerService.info(`>>> Camera started streaming`);
    setTimeout(() => {
      this.loggerService.info(`>>> Send Autoframe Off`);
      this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
        [AUDIO_CONSTANTS.UUID.AUTOFRAMING_STATE_UUID]: AppConstants.StateOff,
      });
      setTimeout(() => {
        this.loggerService.info(`>>> Send PTZ to 0,0,1`);
        this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
          [AUDIO_CONSTANTS.UUID.CAMERA_PAN_UUID]: AppConstants.StateOff,
          [AUDIO_CONSTANTS.UUID.CAMERA_TILT_UUID]: AppConstants.StateOff,
          [AUDIO_CONSTANTS.UUID.CAMERA_ZOOM_UUID]: AppConstants.StateOn,
        });
      },         AUDIO_CONSTANTS.TIMEOUT.PTZ_TIMEOUT);
    },         AUDIO_CONSTANTS.TIMEOUT.AUTOFRAME_TIMEOUT);
  }
  listenForAutoframeInformation() {
    let listenCount = 0;
    this.deviceDataManagerService
      .listenFromDevice(AUDIO_CONSTANTS.UUID.AUTOFRAME_INFO)
      .pipe(
        take(3),
        map((value: string) => value !== AppConstants.StateOff),
      )
      .subscribe((autoFrameInfo: boolean) => {
        if (!listenCount) {
          listenCount += 1;
          this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
            [AUDIO_CONSTANTS.UUID.AUTOFRAME_INFO]: AppConstants.StateOff,
          });
          this.autoFrameInfo = autoFrameInfo;
        } else if (listenCount === 1) {
          listenCount += 1;
        } else {
          this.isAutoFrameInfoChanged = true;
        }
      });
  }
  listenForVideoOverlay() {
    let listenCount = 0;
    this.deviceDataManagerService
      .listenFromDevice(AUDIO_CONSTANTS.UUID.VIDEO_RESOLUTION_OVERLAY)
      .pipe(
        take(3),
        map((value: string) => value !== AppConstants.StateOff),
      )
      .subscribe((videoOverlay: boolean) => {
        if (!listenCount) {
          listenCount += 1;
          this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
            [AUDIO_CONSTANTS.UUID.VIDEO_RESOLUTION_OVERLAY]: AppConstants.StateOff,
          });
          this.videoOverlay = videoOverlay;
        } else if (listenCount === 1) {
          listenCount += 1;
        } else {
          this.isVideoOverlayChanged = true;
        }
      });
  }
  listenToRoomConfigurationChanges() {
    this.deviceDataManagerService
      .listenFromDevice(CONFIGURE_ROOM_UUIDS.ROOM_DEPTH)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: any) => {
        this.angularP5Service.setRoomDepth(parseInt(value, 10));
        this.inputFields[1].value = parseInt(value, 10);
        this.defaultDepth = parseInt(value, 10);
      });
    this.deviceDataManagerService
      .listenFromDevice(CONFIGURE_ROOM_UUIDS.ROOM_WIDTH)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: any) => {
        this.angularP5Service.setRoomWidth(parseInt(value, 10));
        this.inputFields[0].value = parseInt(value, 10);
        this.defaultWidth = parseInt(value, 10);
      });
  }

  subScribeToNumberOfStaticBaams() {
    this.subscribtions.add(
      this.angularP5Service.getNumberOfBeams().subscribe((numberOfStaticBeams: number) => {
        if (numberOfStaticBeams < 4) {
          this.isNumberOfBeamsLessThanFour = true;
        } else if (numberOfStaticBeams === 4) {
          this.isNumberOfBeamsLessThanFour = false;
        }
        this.ngZone.run(() => {
          this.isAddBeamDisabled = !(this.isStaticBeamComponent && this.isNumberOfBeamsLessThanFour);
        });
      }),
    );
  }
  onAddBeam() {
    this.angularP5Service.addBeam();
  }
  onDeleteZone() {
    this.angularP5Service.deleteZone();
  }
  onDeleteBeam() {
    this.angularP5Service.deleteBeam(this.angularP5Service.getCurrentlySelectedBeamIndex());
    this.beamUnSelected();
  }
  beamUnSelected() {
    this.angularP5Service.setCurrentlySelectedBeamIndex(-1);
    this.angularP5Service.setIsDeleteHiddenStatic(true);
  }
  onAddExclusionZone() {
    this.angularP5Service.setAddedZone();
  }

  setRoomValues(index: number, value: number) {
    this.inputFields[index].value = value;
  }

  putVideoOverlayValueBackIfnotChanged() {
    if (!this.isVideoOverlayChanged && this.videoOverlay) {
      this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
        [AUDIO_CONSTANTS.UUID.VIDEO_RESOLUTION_OVERLAY]: this.videoOverlay
          ? AppConstants.StateOn
          : AppConstants.StateOff,
      });
    }
  }

  putAutoframeInfoValueBackIfnotChanged() {
    if (!this.isAutoFrameInfoChanged && this.autoFrameInfo) {
      this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
        [AUDIO_CONSTANTS.UUID.AUTOFRAME_INFO]: this.autoFrameInfo ? AppConstants.StateOn : AppConstants.StateOff,
      });
    }
  }

  ngOnDestroy() {
    this.putVideoOverlayValueBackIfnotChanged();
    this.putAutoframeInfoValueBackIfnotChanged();
    this.ptzAutoframeSubscription.unsubscribe();
    this.enableDisableMicrophoneEvents(AUDIO_CONSTANTS.BEAMS.PERFORM_DISABLE);
    this.angularP5Service.clearAllSelection();
    this.subscribtions.unsubscribe();
    this.staticBeamSubscriptions.unsubscribe();
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.angularP5Service.unsubscribeBeamTypeData();
    this.angularP5Service.unsubscribeAmmData();
    this.zoneBeamSubscription.unsubscribe();
  }
}
