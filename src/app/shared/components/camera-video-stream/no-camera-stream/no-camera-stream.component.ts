import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { SharedConstants } from '@shared/shared.constants';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstants } from '@core/constants/app.constant';
import { MapperService } from '@core/services/mapper.service';
import { VideoConstant } from 'app/video/video.constant';

@Component({
  selector: 'app-no-camera-stream',
  templateUrl: './no-camera-stream.component.html',
  styleUrls: ['./no-camera-stream.component.scss'],
})
export class NoCameraStreamComponent implements OnInit, AfterViewInit, OnDestroy {
  canvas;
  rectangle;
  zoomOffsetHeight;
  zoomOffsetWidth;
  minRangePT;
  maxRangePT;
  minRangeZoom;
  maxRangeZoom;
  previousLeft = 150;
  previousTop = 100;
  previousScaleX = 1;
  previousScaleY = 1;

  displayPane: { tilt: number; pan: number; zoom: number } = {
    tilt: 0, // tilt -> x offset (top) [-10 to 10] [Up-Down, Vertical]
    pan: 0, // pan ->  y offset (left) [-10 to 10] [left-right, Horizontal]
    zoom: 1, // zoom -> Re-sizing of display-pane [1 to 10]
  };
  unSubscribe: Subject<void> = new Subject();

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private mapper: MapperService,
  ) {}

  ngOnInit() {
    // !Disabling the cache of fabricjs
    fabric.Object.prototype.objectCaching = false;

    this.intialize();

    // !If Requriement is to show the grid on the overlay
    /**  this.displayGridLayout(); */

    this.onOverlayBoxResized();
  }

  ngAfterViewInit() {
    this.createCanvas();
  }

  intialize() {
    const cameraPanItem = this.mapper.findObjectFromJSONMapper(VideoConstant.UUID.CAMERA_PAN_UUID);
    this.minRangePT = +cameraPanItem.range_min;
    this.maxRangePT = +cameraPanItem.range_max;

    const cameraZoomItem = this.mapper.findObjectFromJSONMapper(VideoConstant.UUID.CAMERA_ZOOM_UUID);
    this.minRangeZoom = +cameraZoomItem.range_min;
    this.maxRangeZoom = +cameraZoomItem.range_max;

    // !This zoomoffset shld be dynamically calculated as the width of the rect increase, thus should be class level variable
    this.zoomOffsetHeight = SharedConstants.NO_CAMERA.ZOOM_OFFSET_HEIGHT;
    this.zoomOffsetWidth = SharedConstants.NO_CAMERA.ZOOM_OFFSET_WIDTH;

    this.deviceManagerService
      .listenFromDevice(VideoConstant.UUID.CAMERA_PAN_UUID)
      .pipe(
        takeUntil(this.unSubscribe),
        filter((pan: any) => !!pan),
      )
      .subscribe((pan: string) => {
        this.ngZone.run(() => {
          this.displayPane.pan = +pan;
          this.updatePosition(pan, null, null);
        });
      });
    this.deviceManagerService
      .listenFromDevice(VideoConstant.UUID.CAMERA_TILT_UUID)
      .pipe(
        takeUntil(this.unSubscribe),
        filter((tilt: any) => !!tilt),
      )
      .subscribe((tilt: string) => {
        this.ngZone.run(() => {
          this.displayPane.tilt = +tilt;
          this.updatePosition(null, tilt, null);
        });
      });
    this.deviceManagerService
      .listenFromDevice(VideoConstant.UUID.CAMERA_ZOOM_UUID)
      .pipe(
        takeUntil(this.unSubscribe),
        filter((zoom: any) => !!zoom),
      )
      .subscribe((zoom: string) => {
        this.ngZone.run(() => {
          this.displayPane.zoom = +zoom;
          this.updatePosition(null, null, zoom);
        });
      });
  }

  createCanvas() {
    this.canvas = new fabric.Canvas(AppConstants.CANVAS_LAYOUT);

    this.canvas.setDimensions({
      width: SharedConstants.NO_CAMERA.CANVAS_WIDTH,
      height: SharedConstants.NO_CAMERA.CANVAS_HEIGHT,
    });

    const tiltInPixel = this.converteRange(
      -this.displayPane.tilt,
      this.minRangePT,
      this.maxRangePT,
      0,
      SharedConstants.NO_CAMERA.CANVAS_HEIGHT,
    );
    const panInPixel = this.converteRange(
      this.displayPane.pan,
      this.minRangePT,
      this.maxRangePT,
      0,
      SharedConstants.NO_CAMERA.CANVAS_WIDTH,
    );

    const zoomInPixel = this.converteRange(
      this.displayPane.zoom,
      this.minRangeZoom,
      this.maxRangeZoom,
      SharedConstants.NO_CAMERA.CANVAS_HEIGHT,
      SharedConstants.NO_CAMERA.MIN_ZOOM_SCALE_PIXEL,
    );

    this.drawDisplayPane(panInPixel, tiltInPixel, zoomInPixel * SharedConstants.NO_CAMERA.SCALING_FACTOR, zoomInPixel);

    this.onMouseDragOverlayBox();
  }

  drawDisplayPane(left, top, width, height) {
    this.rectangle = new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: AppConstants.WHITE,
      lockRotation: true,
      // originX: AppConstants.LEFT,
      // originY: AppConstants.TOP,
      originX: 'center',
      originY: 'center',
      cornerSize: 15,
      hasRotatingPoint: false,
      perPixelTargetFind: true,
      minScaleLimit: 1,
      opacity: 0.6,
      stroke: AppConstants.BLACK,
      strokeWidth: 1,
      hasBorders: false,
      hasControls: false,
    });
    this.canvas.add(this.rectangle);
    this.updatePosition(this.displayPane.pan, this.displayPane.tilt, this.displayPane.zoom);
  }

  // tslint:disable-next-line:cognitive-complexity
  updatePosition(pan, tilt, zoom) {
    if (tilt) {
      let tiltTemp = tilt > this.maxRangePT ? this.maxRangePT : tilt < this.minRangePT ? this.minRangePT : tilt;
      tiltTemp = tiltTemp === NaN ? 0 : tiltTemp;
      const tiltInPixel = this.converteRange(
        +-tiltTemp,
        this.minRangePT,
        this.maxRangePT,
        SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].HEIGHT,
        SharedConstants.NO_CAMERA.CANVAS_HEIGHT -
          SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].HEIGHT,
      );
      if (this.canvas) {
        this.canvas.item(0).top = tiltInPixel;
      }
    }
    if (pan) {
      let panTemp = pan > this.maxRangePT ? this.maxRangePT : pan < this.minRangePT ? this.minRangePT : pan;
      panTemp = panTemp === NaN ? 0 : panTemp;
      const panInPixel = this.converteRange(
        +panTemp,
        this.minRangePT,
        this.maxRangePT,
        SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].WIDTH,
        SharedConstants.NO_CAMERA.CANVAS_WIDTH -
          SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].WIDTH,
      );
      if (this.canvas) {
        this.canvas.item(0).left = panInPixel;
      }
    }
    if (zoom) {
      const invertZoom = 11 - +zoom;
      const zoomInPixel = this.converteRange(
        invertZoom,
        this.minRangeZoom,
        this.maxRangeZoom,
        SharedConstants.NO_CAMERA.CANVAS_HEIGHT,
        SharedConstants.NO_CAMERA.MIN_ZOOM_SCALE_PIXEL,
      );

      // this.updateRangeForPT(+zoom);
      // !Update the actual width and height of rectangle not width and height but the scaleX and scaleY b'coz- width and height
      // ! will fix the dimension of rectangle and cannot be scaled
      if (this.canvas) {
        this.canvas.item(0).width = SharedConstants.NO_CAMERA.MIN_RECT_WIDTH;
        this.canvas.item(0).height = SharedConstants.NO_CAMERA.MIN_RECT_HEIGHT;
        this.canvas.item(0).scaleX =
          SharedConstants.NO_CAMERA.CANVAS_WIDTH / (Math.floor(zoomInPixel) * SharedConstants.NO_CAMERA.SCALING_FACTOR);
        this.canvas.item(0).scaleY = SharedConstants.NO_CAMERA.CANVAS_HEIGHT / Math.floor(zoomInPixel);
      }
    }
    if (this.canvas) {
      this.recenteringRectangle(this.displayPane.zoom);
      this.canvas.item(0).setCoords();
      this.canvas.renderAll();
    }
  }

  recenteringRectangle(zoom) {
    let panTemp =
      this.displayPane.pan > this.maxRangePT
        ? this.maxRangePT
        : this.displayPane.pan < this.minRangePT
        ? this.minRangePT
        : this.displayPane.pan;
    panTemp = panTemp === NaN ? 0 : panTemp;
    const panInPixel = this.converteRange(
      +panTemp,
      this.minRangePT,
      this.maxRangePT,
      SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].WIDTH,
      SharedConstants.NO_CAMERA.CANVAS_WIDTH -
        SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].WIDTH,
    );
    if (this.canvas) {
      this.canvas.item(0).left = panInPixel;
    }
    let tiltTemp =
      this.displayPane.tilt > this.maxRangePT
        ? this.maxRangePT
        : this.displayPane.tilt < this.minRangePT
        ? this.minRangePT
        : this.displayPane.tilt;
    tiltTemp = tiltTemp === NaN ? 0 : tiltTemp;
    const tiltInPixel = this.converteRange(
      +-tiltTemp,
      this.minRangePT,
      this.maxRangePT,
      SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].HEIGHT,
      SharedConstants.NO_CAMERA.CANVAS_HEIGHT -
        SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].HEIGHT,
    );
    if (this.canvas) {
      this.canvas.item(0).top = tiltInPixel;
    }
  }

  /**
   * !Converte one set of range to another set of range
   */
  converteRange(input, inputStart, inputEnd, outputStart, outputEnd) {
    return outputStart + ((outputEnd - outputStart) / (inputEnd - inputStart)) * (input - inputStart);
  }

  displayGridLayout() {
    for (let i = 0; i < 500 / SharedConstants.NO_CAMERA.GRID_COUNT; i += 1) {
      this.canvas.add(
        new fabric.Line([i * SharedConstants.NO_CAMERA.GRID_COUNT, 0, i * SharedConstants.NO_CAMERA.GRID_COUNT, 500], {
          stroke: AppConstants.SMOKE_WHITE,
          selectable: false,
        }),
      );
      this.canvas.add(
        new fabric.Line([0, i * SharedConstants.NO_CAMERA.GRID_COUNT, 500, i * SharedConstants.NO_CAMERA.GRID_COUNT], {
          stroke: AppConstants.SMOKE_WHITE,
          selectable: false,
        }),
      );
    }
  }

  onMouseDragOverlayBox() {
    this.canvas.on('object:moving', (options: any) => {
      // !Restiction the movement -> Snap to Grid
      options.target.set({
        left: Math.round(options.target.left),
        top: Math.round(options.target.top),
      });

      // !!Restiction the movement -> On Canvas boundary Tocuhed
      this.onCanvasBoundaryTouch(options);
    });

    this.canvas.on('mouse:up', (options: any) => {
      const target = options.target;

      // !Mouse Clicked is not null, i.e- clicked on the rect
      if (target) {
        const tiltInDigit: number = -Math.round(
          this.converteRange(
            target.top,
            SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].HEIGHT,
            SharedConstants.NO_CAMERA.CANVAS_HEIGHT -
              SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].HEIGHT,
            this.minRangePT,
            this.maxRangePT,
          ),
        );
        const panInDigit: number = Math.round(
          this.converteRange(
            target.left,
            SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].WIDTH,
            SharedConstants.NO_CAMERA.CANVAS_WIDTH -
              SharedConstants.NO_CAMERA.ZOOM_OFFSET_MAP[this.displayPane.zoom - 1].WIDTH,
            this.minRangePT,
            this.maxRangePT,
          ),
        );
        if (this.displayPane.tilt !== tiltInDigit || this.displayPane.pan !== panInDigit) {
          // !Position has been changed
          this.displayPane.tilt = tiltInDigit;
          this.displayPane.pan = panInDigit;

          this.updatePanTiltToDevice(tiltInDigit, panInDigit);
        }
      }
    });
  }

  onCanvasBoundaryTouch(options) {
    if (!options.target) {
      return;
    }
    const t = options.target;
    let update = false;
    const targetBound = {
      left: t.left,
      right: t.left + t.width * t.scaleX,
      top: t.top,
      bottom: t.top + t.height * t.scaleY,
    };
    const canvasBound = {
      left: (t.width * t.scaleX) / 2,
      top: (t.height * t.scaleY) / 2,
      right: this.canvas.getWidth() + (t.width * t.scaleX) / 2,
      bottom: this.canvas.getHeight() + (t.height * t.scaleY) / 2,
    };
    const coords: any = {};

    if (targetBound.left < canvasBound.left) {
      update = true;
      coords.left = canvasBound.left;
    }

    if (targetBound.top < canvasBound.top) {
      update = true;
      coords.top = canvasBound.top;
    }

    if (targetBound.right > canvasBound.right) {
      update = true;
      coords.left = targetBound.left - (targetBound.right - canvasBound.right);
    }

    if (targetBound.bottom > canvasBound.bottom) {
      update = true;
      coords.top = targetBound.top - (targetBound.bottom - canvasBound.bottom);
    }

    if (update) {
      t.set(coords);
      this.canvas.renderAll();
    }

    return options;
  }

  onOverlayBoxResized() {
    /**  this.canvas.on('object:scaling', (options: any) => {
      const obj = options.target;
      this.zoomOffset = obj.getScaledHeight();

      const zoomInDigit: number = Math.round(
        this.converteRange(
          obj.getScaledHeight(),
          SharedConstants.NO_CAMERA.CANVAS_HEIGHT,
          SharedConstants.NO_CAMERA.MIN_ZOOM_SCALE_PIXEL,
          this.minRangeZoom,
          this.maxRangeZoom,
        ),
      );

      console.log('-----------SCALING-------------', this.zoomOffset, ' ZOOM IN DIGIT : ', this.zoomOffset);
      this.updateRangeForPT(zoomInDigit);
    }); */
    /**  this.canvas.on('object:scaled', (options: any) => {
      const obj = options.target;
      const boundingRect = obj.getBoundingRect(true);
      if (
        boundingRect.left < 0 ||
        boundingRect.top < 0 ||
        boundingRect.left + boundingRect.width > obj.canvas.getWidth() ||
        boundingRect.top + boundingRect.height > obj.canvas.getHeight()
      ) {
        // !fallback to previous values
        obj.left = this.previousLeft;
        obj.top = this.previousTop;
        obj.scaleX = this.previousScaleX;
        obj.scaleY = this.previousScaleY;
        obj.setCoords();
      } else {
        const zoomInDigit: number = Math.round(
          this.converteRange(
            obj.height * obj.scaleY,
            SharedConstants.NO_CAMERA.CANVAS_HEIGHT,
            SharedConstants.NO_CAMERA.MIN_ZOOM_SCALE_PIXEL,
            this.minRangeZoom,
            this.maxRangeZoom,
          ),
        );

        this.displayPane.zoom = zoomInDigit;
        this.updateZoomToDevice(zoomInDigit);

        this.previousLeft = obj.left;
        this.previousTop = obj.top;
        this.previousScaleX = obj.scaleX;
        this.previousScaleY = obj.scaleY;
      }
    }); */
  }

  // updateRangeForPT(zoomInDigit) {
  //   this.minRangePT = -zoomInDigit;
  //   this.maxRangePT = zoomInDigit;
  // }

  updateZoomToDevice(value) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [VideoConstant.UUID.CAMERA_ZOOM_UUID]: String(value),
    });
  }

  updatePanTiltToDevice(tilt, pan) {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [VideoConstant.UUID.CAMERA_TILT_UUID]: String(tilt),
    });
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [VideoConstant.UUID.CAMERA_PAN_UUID]: String(pan),
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.canvas = null;
    this.rectangle = null;
  }
}
