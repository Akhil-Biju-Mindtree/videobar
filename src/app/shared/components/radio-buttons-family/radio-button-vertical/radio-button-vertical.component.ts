import { Component, OnInit, Input } from '@angular/core';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-radio-button-vertical',
  templateUrl: './radio-button-vertical.component.html',
  styleUrls: ['./radio-button-vertical.component.scss'],
})
export class RadioButtonVerticalComponent implements OnInit {
  @Input() uuid: string;
  @Input() allValues: { text: string; value: string }[];
  @Input() disable: boolean;
  radioButtonLayout: {};
  constructor() {}

  ngOnInit() {
    this.radioButtonLayout = SharedConstants.RADIO_BUTTON_STYLE.VERTICAL;
  }
}
