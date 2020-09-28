import { Component, OnInit, ViewChild, Input, EventEmitter, Output, OnChanges, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MapperService } from '@core/services/mapper.service';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss'],
})
export class SelectDropdownComponent implements OnInit, OnChanges {
  @ViewChild('mySelect', { static: false }) mySelect;
  dropDownValue = '';
  @Input() itemList;
  @Input() isVideoTab: false;
  @Input() isDisabled;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Output() sendDataEvent: EventEmitter<string> = new EventEmitter();
  @Input() placeholder: string;
  @Input() isListWithIcons: boolean;
  @Input() twoWayBound: boolean;
  @Output() dropDownClicked: EventEmitter<string> = new EventEmitter();
  formControl = new FormControl();
  @Input()
  set currentValue(value: string) {
    this.dropDownValue = value;
    this.formControl.setValue(this.currentValue);
  }
  containerWidthStyle: {};
  disableOptionCentering = false;
  disableRipple = false;
  downArrowIcon = SharedConstants.ICON.DOWN_ARROW;
  constructor(private mapperService: MapperService) { }

  ngOnChanges(): void {
    if (this.dropDownValue !== this.formControl.value && !this.twoWayBound) {
      this.formControl.setValue(this.dropDownValue);
    }
    if (this.isVideoTab) {
      this.formControl.setValue(undefined);
    }
  }

  ngOnInit(): void {
    if (this.parentForm) {
      if (this.parentForm.controls[this.uuid]) {
        this.parentForm.controls[this.uuid].reset();
      } else {
        this.parentForm.addControl(this.uuid, this.formControl);
      }
    }
  }

  onValueChange(object: any, selectDiv: any) {
    const key = Object.keys(this.itemList).find(k => this.itemList[k].value === object.value);
    if (key) {
      this.sendDataEvent.emit(this.itemList[key]);
    } else {
      this.sendDataEvent.emit(object);
    }
    if (this.isVideoTab) {
      this.formControl.setValue(undefined);
    }
  }

  onDropdownClick(mySelect) {
    this.dropDownClicked.emit(mySelect.panelOpen);
    if (mySelect.panelOpen) {
      const ele = mySelect.panel.nativeElement.closest('.cdk-overlay-pane');
      ele.classList.add('cdk-custom-mat');
    }
  }
}
