import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-radio-button-horizontal',
  templateUrl: './radio-button-horizontal.component.html',
  styleUrls: ['./radio-button-horizontal.component.scss'],
})
export class RadioButtonHorizontalComponent implements OnInit {
  @Input() uuid: string;
  @Input() allValues: { text: string; value: string; abandonEmit?: boolean }[];
  @Input() disable: boolean;
  @Input() isLabelBold: boolean;
  @Output() valueChecked = new EventEmitter();
  radioButtonLayout: {};
  constructor() {}

  ngOnInit() {
    this.radioButtonLayout = SharedConstants.RADIO_BUTTON_STYLE.HORIZONTAL;
  }

  onValueChecked(event) {
    this.valueChecked.emit(event);
  }
}
