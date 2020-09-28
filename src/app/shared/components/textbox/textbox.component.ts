import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MapperService } from '@core/services/mapper.service';
import { INPUT_ERRORS } from '@core/error/error.constants';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
})
export class TextboxComponent implements OnInit, OnChanges, OnDestroy {
  @Input() value: string;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Input() showError = true;
  @Input() containerWidthStyle: string;
  @Input() inputType: string;
  @Input() isRequired: boolean;
  @Output() valueChange = new EventEmitter();
  @Input() disabled = false;
  @Input() maxLength: number;
  @Input() errorMessage: string;
  @Input() restoreDefault: Observable<any>;
  @Input() isTextAllign: boolean;
  @Input() regEx: string;
  @Output() enterKeyEvent = new EventEmitter();
  @Input() hasKeyEvents: string;
  @Input() isSliderWithTextBox = false;
  defaultErrorMessage = INPUT_ERRORS.INVALID_VALUE_ERROR;
  formControl = new FormControl();
  restoreDefaultSub: Subscription;

  constructor(private mapperService: MapperService) {}

  ngOnChanges(): void {
    if (this.value !== this.formControl.value) {
      this.formControl.setValue(this.value);
    }
    if (this.disabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  ngOnInit(): void {
    const object = this.mapperService.findObjectFromJSONMapper(this.uuid);

    const validatorsGroup = [];

    if (this.isRequired) {
      validatorsGroup.push(Validators.required);
    }
    if (object) {
      if (object.range_max !== '') {
        validatorsGroup.push(Validators.max(+object.range_max));
      }
      if (object.range_min !== '') {
        validatorsGroup.push(Validators.min(+object.range_min));
      }
    }
    if (this.regEx) {
      validatorsGroup.push(Validators.pattern(new RegExp(this.regEx)));
    } else if (object && object.regex_values !== '') {
      const requiredRegEx = `^(${object.regex_values})$`;
      validatorsGroup.push(Validators.pattern(new RegExp(requiredRegEx)));
    }
    this.formControl.setValidators(validatorsGroup);

    if (this.parentForm) {
      if (this.parentForm.controls[this.uuid]) {
        this.parentForm.controls[this.uuid].reset();
      } else {
        this.parentForm.addControl(this.uuid, this.formControl);
      }
    }
    this.listenRestoreDefault();
  }

  ngOnDestroy() {
    if (this.restoreDefaultSub) {
      this.restoreDefaultSub.unsubscribe();
    }
  }

  listenRestoreDefault() {
    if (this.restoreDefault instanceof Observable) {
      this.restoreDefaultSub = this.restoreDefault.subscribe(() => {
        this.formControl.setValue(this.value);
        this.formControl.markAsPristine();
        this.formControl.markAsUntouched();
      });
    }
  }

  updateValueChange() {
    if (this.formControl.dirty && this.formControl.valid) {
      this.valueChange.emit(this.formControl.value);
    }
  }

  isInValid() {
    return this.showError && this.formControl.invalid && this.formControl.dirty && this.formControl.touched;
  }

  submitValueOnKeyPress() {
    if (this.hasKeyEvents && (!this.showError || this.isSliderWithTextBox) && this.formControl.valid) {
      this.valueChange.emit(this.formControl.value);
      this.enterKeyEvent.next();
    }
  }
}
