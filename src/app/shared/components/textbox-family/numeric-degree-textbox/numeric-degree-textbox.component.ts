import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TextboxComponent } from '@shared/components/textbox/textbox.component';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-numeric-degree-textbox',
  templateUrl: './numeric-degree-textbox.component.html',
  styleUrls: ['./numeric-degree-textbox.component.scss'],
})
export class NumericDegreeTextboxComponent implements OnInit {
  @Input() value: number;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Input() showError = true;
  @Input() isRequired: boolean;
  @Output() valueChange = new EventEmitter();

  containerWidthStyle: {};
  inputType: string;
  @ViewChild(TextboxComponent, { static: false }) textboxComponent;
  formControl: FormControl;

  constructor() { }

  ngOnInit() {
    this.containerWidthStyle = {
      width: SharedConstants.INPUT.WIDTH.SMALL,
    };
    this.inputType = SharedConstants.INPUT.TYPE.NUMBER;
  }

  onValueChange(event) {
    this.valueChange.emit(event);
  }
}
