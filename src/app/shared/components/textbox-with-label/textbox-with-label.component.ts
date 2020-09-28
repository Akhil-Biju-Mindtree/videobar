import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LabelNumericTextboxComponent } from '../textbox-family/label-numeric-textbox/label-numeric-textbox.component';
import { INPUT_ERRORS } from '@core/error/error.constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-textbox-with-label',
  templateUrl: './textbox-with-label.component.html',
  styleUrls: ['./textbox-with-label.component.scss'],
})
export class TextboxWithLabelComponent implements OnInit, AfterViewInit {
  @Input() label;
  @Input() value: number;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Input() isRequired: boolean;
  @Input() restoreDefault: Observable<any>;
  @Output() valueChange = new EventEmitter();
  @Input() isTextAllign: boolean;
  @ViewChild(LabelNumericTextboxComponent, { static: false }) labelTextBoxComponent;
  formControl: FormControl;
  inputErrorMessage = INPUT_ERRORS.INVALID_VALUE_ERROR;

  constructor() { }

  ngOnInit() { }

  updateSlider(value) {
    this.valueChange.emit(value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formControl = this.labelTextBoxComponent.textboxComponent.formControl;
    });
  }

  isInValid() {
    return this.formControl && this.formControl.invalid && this.formControl.dirty && this.formControl.touched;
  }
}
