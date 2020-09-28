import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TextboxComponent } from '@shared/components/textbox/textbox.component';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-text-field-textbox',
  templateUrl: './text-field-textbox.component.html',
  styleUrls: ['./text-field-textbox.component.scss'],
})
export class TextFieldTextboxComponent implements OnInit, OnChanges {
  @Input() value: number;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Input() isRequired: boolean;
  @Input() showError = true;
  @Output() valueChange = new EventEmitter();
  @Input() errorMessage: string;
  @Input() maxLength: number;
  @Input() type: string;
  @Input() regEx: string;
  @Output() enterKeyEvent = new EventEmitter();
  @Input() hasKeyEvents: string;
  @ViewChild(TextboxComponent, { static: false }) textboxComponent: TextboxComponent;

  containerWidthStyle: {};
  inputType: string;
  formControl: FormControl;

  constructor() { }

  ngOnInit() {
    this.containerWidthStyle = {
      width: SharedConstants.INPUT.WIDTH.LARGE,
    };
    if (this.type) {
      this.inputType = this.type;
    } else {
      this.inputType = SharedConstants.INPUT.TYPE.TEXT;
    }
  }

  ngOnChanges() {
    if (this.type && this.type !== this.inputType) {
      this.inputType = this.type;
    }
  }

  onValueChange(event) {
    this.valueChange.emit(event);
  }

  submitValueOnKeyPress() {
    this.enterKeyEvent.next();
  }
}
