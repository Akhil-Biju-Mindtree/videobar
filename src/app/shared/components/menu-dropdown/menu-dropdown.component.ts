import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.scss'],
})
export class MenuDropdownComponent implements OnInit, OnChanges {
  @Input() itemList;
  @Input() isDisabled;
  @Input() buttonText;
  @Output() sendData: EventEmitter<string> = new EventEmitter();
  @Input() isListDropDown: boolean;
  @Input() dropdownValue;
  @Output() dropDownClicked: EventEmitter<string> = new EventEmitter();
  itemSelected = SharedConstants.TEXT.DROPDOWN_DEFAULT_TEXT;
  downArrowIcon = SharedConstants.ICON.DOWN_ARROW;

  constructor() {}

  ngOnChanges() {
    if (this.dropdownValue) {
      this.itemSelected = this.dropdownValue;
    }
  }

  ngOnInit() {}

  /**
   * Handle the selection operation
   * @param item - Item that is selected
   */
  saveSelection(item) {
    this.itemSelected = item.label;
    this.sendData.emit(item);
  }

  onDropdownClick(isMenuOpened) {
    this.dropDownClicked.emit(isMenuOpened);
  }
}
