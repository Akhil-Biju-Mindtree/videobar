import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TextboxComponent } from '@shared/components/textbox/textbox.component';
import { SharedConstants } from '@shared/shared.constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-label-numeric-textbox',
  templateUrl: './label-numeric-textbox.component.html',
  styleUrls: ['./label-numeric-textbox.component.scss'],
})
export class LabelNumericTextboxComponent implements OnInit {
  @Input() value: number;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Input() showError = true;
  @Input() isRequired: boolean;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter();
  @Input() errorMessage: string;
  @Input() restoreDefault: Observable<any>;
  @Input() isTextAllign: boolean;
  @Input() containerWidthStyle = {
    width: SharedConstants.INPUT.WIDTH.SMALL,
  };
  @Input() hasKeyEvents: boolean;
  @Input() isSliderWithTextBox: boolean;

  inputType: string;
  @ViewChild(TextboxComponent, { static: false }) textboxComponent;
  formControl: FormControl;

  constructor() { }

  ngOnInit() {
    this.inputType = SharedConstants.INPUT.TYPE.TEXT;
  }

  onValueChange(event) {
    this.valueChange.emit(event);
  }
}
