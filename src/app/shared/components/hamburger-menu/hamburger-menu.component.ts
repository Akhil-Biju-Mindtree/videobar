import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
})
export class HamburgerMenuComponent implements OnInit {
  @Input() isDisabled: boolean;
  @Input() itemList: any;
  @Input() iconPath: string;
  @Output() selectionChange = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  saveSelection(itemSelected) {
    this.selectionChange.next(itemSelected.label);
  }
}
