import { Component, OnInit, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-silder-with-textbox',
  templateUrl: './silder-with-textbox.component.html',
  styleUrls: ['./silder-with-textbox.component.scss'],
})
export class SilderWithTextboxComponent implements OnInit {
  @Input() uuid: number;
  @Input() label: string;
  @Input() parentForm: FormGroup;
  @Input() disabled = false;
  @Input() restoreDefault: Observable<any>;
  @Input() textBoxContainerWidth = {
    width: SharedConstants.INPUT.WIDTH.SMALL,
  };
  @Input() showSteps: boolean;
  @Input() customStepValue: number;
  @Output() valueChange = new EventEmitter();

  sliderValue: number;
  containerWidthStyle: {};
  defaultTextBoxSize = SharedConstants.INPUT.WIDTH.SMALL;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.containerWidthStyle = {
      width: SharedConstants.SLIDER_CONTAINER_DEFAULT_WIDTH,
    };
  }

  updateTextBox(event) {
    this.zone.run(() => {
      this.sliderValue = event;
      this.valueChange.emit(event);
    });
  }

  updateSlider(event) {
    this.sliderValue = event;
    this.valueChange.emit(event);
  }
}
