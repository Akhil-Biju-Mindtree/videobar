import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  NgZone,
  HostListener,
} from '@angular/core';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { FormControl } from '@angular/forms';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { map, buffer, filter, takeUntil } from 'rxjs/operators';
import { Subscription, merge, interval, Subject } from 'rxjs';
import { MapperService } from '@core/services/mapper.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() uuid: string;
  @Input() disabled = false;
  minValue: number;
  maxValue: number;
  step: number;
  @Input() value: number;
  @Input() showMinValue = true;
  @Input() showMaxValue = true;
  @Input() containerWidthStyle: string;
  @Input() min: number;
  @Input() max: number;
  @Input() inputStep: number;
  @Input() isAnimationDisabled = false;
  @Input() showSteps = false;
  @Input() customStepValue: number;
  formControl: FormControl = new FormControl();
  lastSent: number;
  @Output() valueChange = new EventEmitter();
  slideInProgress = false;
  deviceSubscription: Subscription;
  defaultValue: number;
  listenerSub = new Subject();
  stepValues = [];
  @ViewChild(MatSlider, { static: false }) matSlider;
  @HostListener('document:mouseup')
  onmMouseup() {
    this.slideInProgress = false;
  }

  constructor(
    private deviceMangerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private mapperService: MapperService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.slideInProgress && this.value !== this.formControl.value && this.value !== undefined) {
      this.formControl.setValue(this.value);
      this.sendToDevice(this.value);
    }
  }

  ngAfterViewInit(): void {
    this.subscribeSliderEvents();
    setTimeout(() => {
      this.isAnimationDisabled = false;
    });
  }

  ngOnInit() {
    const object = this.mapperService.findObjectFromJSONMapper(this.uuid);
    if (this.min === undefined) {
      this.minValue = +object.range_min;
    } else {
      this.minValue = this.min;
    }
    if (this.max === undefined) {
      this.maxValue = +object.range_max;
    } else {
      this.maxValue = this.max;
    }
    if (this.inputStep === undefined) {
      this.step = +object.range_step;
      this.defaultValue = +object.default;
    } else {
      this.step = this.inputStep;
      this.defaultValue = this.value;
    }
    if (this.showSteps) {
      this.getStepValues(this.customStepValue || this.step);
    }
    this.subscribeToDevice();
  }

  getStepValues(step) {
    for (let value = this.minValue + step; value < this.maxValue; value = value + step) {
      const label = value;
      const offset = 0 + ((100 - 0) / (this.maxValue - this.minValue)) * (value - this.minValue);
      this.stepValues.push({ label, offset });
    }
  }

  subscribeSliderEvents() {
    const myInterval = interval(500).pipe(takeUntil(this.listenerSub));
    const throttleObsChange = this.matSlider.change;
    const throttleObs = this.matSlider.input;
    const mergeObs = merge(throttleObs, throttleObsChange).pipe(
      buffer(myInterval),
      filter((list: MatSliderChange[]) => list instanceof Array && list.length > 0),
      map((eventList: MatSliderChange[]) => eventList[eventList.length - 1].value),
    );
    mergeObs.pipe(takeUntil(this.listenerSub)).subscribe((value: any) => {
      this.checkEventValueChange(value);
    });
  }

  checkEventValueChange(value) {
    if (value !== this.lastSent) {
      this.onSliderChange(value);
    }
  }

  onSliderChange(value) {
    this.valueChange.emit(value);
    this.lastSent = value;
    this.sendToDevice(value);
  }

  subscribeToDevice() {
    this.deviceSubscription = this.deviceMangerService.listenFromDevice(this.uuid).subscribe((value: any) => {
      if (!this.slideInProgress) {
        this.ngZone.run(() => {
          if (this.formControl.value === null) {
            /*setTimeout added to prevent ExpressionChangedAfterChecked error during init*/
            setTimeout(() => {
              this.valueChange.emit(value);
            },         0);
          } else {
            this.valueChange.emit(value);
          }
          this.lastSent = +value;
          this.formControl.setValue(value);
        });
      }
    });
  }

  sendToDevice(value) {
    this.deviceMangerService.sendToDevice(AppConstants.Action.Update, {
      [this.uuid]: String(value),
    });
  }

  onMouseDown() {
    this.slideInProgress = true;
  }

  ngOnDestroy(): void {
    this.deviceSubscription.unsubscribe();
    this.listenerSub.next();
    this.listenerSub.complete();
  }
}
