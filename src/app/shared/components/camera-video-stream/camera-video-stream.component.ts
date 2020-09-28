import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  NgZone,
  Renderer2,
} from '@angular/core';
import { ErrorService } from '@core/error/error.service';
import * as errorMessages from '@core/error/error.constants';
import { SharedConstants } from '@shared/shared.constants';
import { ActivatedRoute } from '@angular/router';
import { AppConstants, READY_STATE_UUID } from '@core/constants/app.constant';
import { Subject } from 'rxjs';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { UtilitiesService } from '@providers/utilities.service';
import { AppConfig } from '@environment/environment';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { MediaObserver } from '@angular/flex-layout';
import { ServiceAdapter } from '@providers/service-adapter';
import { takeUntil } from 'rxjs/operators';
import { Logger } from '@core/logger/Logger';
import * as _ from 'lodash';

@Component({
  selector: 'app-camera-video-stream',
  templateUrl: './camera-video-stream.component.html',
  styleUrls: ['./camera-video-stream.component.scss'],
})
export class CameraVideoStreamComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoStream', { static: true }) videoStream: ElementRef;
  @ViewChild('videoContainer', { static: true }) videoContainer: ElementRef;
  @Input() isAudioVideo: boolean;
  @Input() showLowLight: boolean;
  @Output() videoStreamStatus = new EventEmitter<boolean>();

  currentRoute: string;
  isVideoStreaming = false;
  deviceConnectedForUSB = false;
  isVideoLoaded = false;

  USBnotConected = SharedConstants.NO_CAMERA.TEXT.NO_USB_CONNECTED;
  loadingVideoStream = SharedConstants.NO_CAMERA.TEXT.LOADING_VIDEO_STREAM;
  noCameraBackground = SharedConstants.ICON.NO_CAMERA_VIEW;
  noCameraStreamText = SharedConstants.NO_CAMERA.TEXT.NO_CAMERA_TEXT_VIDEO;
  noCameraStreamMicrophoneText = SharedConstants.NO_CAMERA.TEXT.NO_CAMERA_MICROPHONE_TEXT;
  canvasWidth = 440;
  canvasHeight = 248;
  isDesktopApp = AppConfig.isDesktopApp;
  videoStreamObj;
  screenWidthHeight: string;
  currentVideoStream: MediaStream;
  startTimer;
  isDestroyed = false;
  subscribeOnFullScreen = new Subject<void>();
  unSubscribe = new Subject<void>();
  retryCount = 0;
  retryStream = _.debounce(this.checkForStream, 500);
  isMacPlatform = window.navigator.platform.includes('Mac');
  isWebsocketDisconnected;

  constructor(
    private errorService: ErrorService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private deviceManagerService: DeviceDataManagerService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private utilityService: UtilitiesService,
    private mediaObserver: MediaObserver,
    public serviceAdapter: ServiceAdapter,
    private loggerService: Logger,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    if (!AppConfig.isDesktopApp) {
      this.applicationDataManagerService
        .listenForAppData(AppConstants.WEBSOCKET_DISCONNECTED)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((value: boolean) => {
          this.isWebsocketDisconnected = value;
          if (value) {
            this.closeStreamObjects();
            this.handleCameraDisconnect();
          }
        });
    }

    this.currentRoute = this.activatedRoute.parent.url[AppConstants.VALUE][0].path;
    if (
      (!this.isDesktopApp && !this.isWebsocketDisconnected) ||
      (this.isDesktopApp && this.serviceAdapter.remote.getCurrentWindow().getTitle() !== 'background')
    ) {
      this.mediaObervableForWeb();
      if (this.isDesktopApp) {
        this.subscibeToScreenWidthHeight();
      }
      if (this.currentRoute === 'camera') {
        this.subscribeToCameraReadyState();
      }
    } else {
      this.mediaObervableForWeb();
      this.closeStreamObjects();
      this.handleCameraDisconnect();
    }
  }

  subscribeToCameraReadyState() {
    this.deviceManagerService
      .listenFromDevice(READY_STATE_UUID)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((readyState: string) => {
        if (readyState === AppConstants.StateOn && !this.isVideoStreaming && this.isVideoLoaded) {
          this.loggerService.trace(`Called Retry Camera on camera ready state`);
          const checkAndGetVideoStreamFun = this.checkAndGetVideoStream.bind(this);
          this.utilityService.debounce(checkAndGetVideoStreamFun, 100);
        }
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
          this.canvasWidth = 441;
          this.canvasHeight = 248;
        }
      });
  }

  ngAfterViewInit() {
    this.hideVideoContainer();
    if (
      (!this.isDesktopApp && !this.isWebsocketDisconnected) ||
      (this.isDesktopApp && this.serviceAdapter.remote.getCurrentWindow().getTitle() !== 'background')
    ) {
      this.startTimer = setTimeout(() => {
        this.checkAndGetVideoStream();
      });
    } else {
      this.closeStreamObjects();
      this.handleCameraDisconnect();
    }
  }

  checkForStream() {
    this.loggerService.trace(`Checking camera stream now`);
    if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      if (!this.isDesktopApp && !this.isWebsocketDisconnected) {
        this.getVideoStreamWeb();
      } else if (this.isDesktopApp) {
        this.getVideoStream();
        this.listenForDeviceChanges();
      } else {
        this.handleCameraDisconnect();
      }
    }
  }

  checkAndGetVideoStream() {
    this.isVideoLoaded = false;
    this.retryStream();
  }

  handleCameraDisconnect() {
    this.ngZone.run(() => {
      this.isVideoStreaming = false;
      this.hideVideoContainer();
      this.deviceConnectedForUSB = false;
      this.isVideoLoaded = true;
      this.videoStreamStatus.next(false);
      if (this.currentVideoStream) {
        this.currentVideoStream.getTracks().forEach((track: any) => {
          track.stop();
        });
      }
    });
  }

  getVideoStream = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices: any) => {
        for (const device of devices) {
          if (
            SharedConstants.STREAM_DATA.TYPES.includes(device.kind) &&
            SharedConstants.STREAM_DATA.LABELS.some((label: any) => device.label.indexOf(label) !== -1)
          ) {
            this.ngZone.run(() => {
              this.isVideoLoaded = false;
              this.deviceConnectedForUSB = true;
            });
            if (!this.isDestroyed && !this.isVideoStreaming && !this.isWebsocketDisconnected) {
              this.setStream(device);
            } else if (this.isWebsocketDisconnected) {
              this.handleCameraDisconnect();
            }
            return;
          }
        }
        this.handleCameraDisconnect();
      })
      .catch((err: any) => {
        this.handleError(err);
      });
  }

  getConstraints(currentDeviceId) {
    const isBrowserSupportsAspectRatio = navigator.mediaDevices.getSupportedConstraints().aspectRatio;
    const constraints = {
      video: {
        deviceId: { exact: currentDeviceId },
      },
    };

    if (isBrowserSupportsAspectRatio) {
      constraints.video = { ...constraints.video, ...AppConstants.CAMERA_HIGHT_WIDTH.RATIO };
    } else if (this.currentRoute === 'video' && !isBrowserSupportsAspectRatio) {
      constraints.video = { ...constraints.video, ...AppConstants.CAMERA_HIGHT_WIDTH.VIDEO_ROUTE_WIDTH_HEIGHT };
    } else if (this.currentRoute === 'microphones' && !isBrowserSupportsAspectRatio) {
      constraints.video = { ...constraints.video, ...AppConstants.CAMERA_HIGHT_WIDTH.MICROPHONE_ROUTE_WIDTH_HEIGHT };
    } else if (this.currentRoute === 'camera' && !isBrowserSupportsAspectRatio) {
      constraints.video = { ...constraints.video, ...AppConstants.CAMERA_HIGHT_WIDTH.CAMERA_ROUTE_WIDTH_HEIGHT };
    }
    return constraints;
  }

  setStream(device) {
    const currentDeviceId = device.deviceId;
    const constraints = this.getConstraints(currentDeviceId);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream: any) => {
        if (this.isDestroyed) {
          this.stopStreaming(mediaStream);
        } else {
          const checkVideoStreamAvaiable = this.checkVideoStreamAvaiable.bind(this, mediaStream);
          this.utilityService.debounce(checkVideoStreamAvaiable, 500);
        }
      })
      .catch((err: any) => {
        this.handleError(err);
      });
  }

  getVideoStreamWeb() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream: MediaStream) => {
        this.stopStreaming(mediaStream);
        this.getVideoStream();
        this.listenForDeviceChanges();
      })
      .catch((err: any) => {
        this.handleError(err);
      });
  }

  checkVideoStreamAvaiable(mediaStream) {
    if (this.isDestroyed) {
      this.stopStreaming(mediaStream);
      return;
    }
    if (mediaStream.active || this.isMacPlatform) {
      mediaStream.oninactive = () => {
        this.loggerService.trace('Camera stream inactive event triggered');
        this.handleCameraDisconnect();
      };
      this.isVideoLoaded = true;
      this.ngZone.run(() => {
        this.currentVideoStream = mediaStream;
        this.isVideoStreaming = true;
        this.showVideoContainer();
        this.videoStreamStatus.next(true);
      });
      setTimeout(() => {
        if (this.videoStream && !this.isDestroyed) {
          this.videoStreamObj = this.videoStream.nativeElement;
          this.videoStreamObj.srcObject = mediaStream;
          this.videoStreamObj.onloadedmetadata = () => {
            if (!this.isDestroyed) {
              this.videoStreamObj.play();
            } else {
              this.stopStreaming(this.videoStreamObj.srcObject);
            }
          };
        }
      });
    } else {
      this.retryForVideoStream();
    }
  }
  retryForVideoStream() {
    if (!this.retryCount) {
      this.retryCount += 1;
      this.loggerService.trace(`Called Retry Camera for Stream`);
      const checkAndGetVideoStreamFun = this.checkAndGetVideoStream.bind(this);
      this.utilityService.debounce(checkAndGetVideoStreamFun, 500);
    } else {
      this.ngZone.run(() => {
        this.isVideoStreaming = false;
        this.hideVideoContainer();
        this.isVideoLoaded = true;
        this.videoStreamStatus.next(false);
      });
    }
  }

  listenForDeviceChanges() {
    if (!this.isDestroyed) {
      navigator.mediaDevices.ondevicechange = () => {
        this.getVideoStream();
      };
    }
  }

  handleError(error) {
    if (!this.retryCount) {
      this.retryCount += 1;
      this.loggerService.trace(`Called Retry Camera to get Stream`);
      const checkAndGetVideoStreamFun = this.checkAndGetVideoStream.bind(this);
      this.utilityService.debounce(checkAndGetVideoStreamFun, 500);
    } else {
      this.ngZone.run(() => {
        this.isVideoStreaming = false;
        this.hideVideoContainer();
        this.isVideoLoaded = true;
        if (this.currentVideoStream) {
          this.currentVideoStream.getTracks().forEach((track: any) => {
            track.stop();
          });
        }
      });
      this.errorService.showError(errorMessages.CameraStreamError);
      this.errorService.logError(`Error in getVideoStream ${error.name} : ${error.message}`);
    }
  }

  stopStreaming(videoStreamObj) {
    const tracks = videoStreamObj.getTracks();
    tracks.forEach((track: any) => {
      track.stop();
    });
  }

  closeStreamObjects() {
    if (this.videoStreamObj && this.videoStreamObj.srcObject) {
      this.stopStreaming(this.videoStreamObj.srcObject);
      this.videoStreamObj.srcObject = null;
    }
    if (this.currentVideoStream) {
      this.stopStreaming(this.currentVideoStream);
      this.currentVideoStream = null;
    }
  }

  hideVideoContainer() {
    this.renderer.setStyle(this.videoContainer.nativeElement, 'display', 'none');
  }

  showVideoContainer() {
    this.renderer.setStyle(this.videoContainer.nativeElement, 'display', 'block');
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.ondevicechange = null;
    }
    if (this.startTimer) {
      clearTimeout(this.startTimer);
    }
    this.closeStreamObjects();
    this.subscribeOnFullScreen.next();
    this.subscribeOnFullScreen.complete();
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
