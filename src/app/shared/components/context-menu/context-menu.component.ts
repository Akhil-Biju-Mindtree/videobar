import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { CONTEXT_MENU_CONSTANT } from './context-menu.constant';
import { ContextMenuConfig, ContextMenuData } from './context.menu.model';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit {
  constructor() {}
  @Input() contextMenuData: ContextMenuData;
  @Input() contextMenuConfig: ContextMenuConfig;
  @Input() menuItems: [];
  @Output() itemSelected = new EventEmitter();
  menuStyle: any;
  contextMenuConstant = CONTEXT_MENU_CONSTANT;
  @HostListener('document:mousedown', ['$event'])
  onMousedown(event) {
    const target = <HTMLElement>event.target;
    if (!target.closest(`.${this.contextMenuConstant.contextMenuClass}`)) {
      this.contextMenuConfig.showMenu = false;
    }
  }
  ngOnInit() {
    this.menuStyle = {
      left: `${this.contextMenuConfig.xPos}px`,
      top: `${this.contextMenuConfig.yPos}px`,
    };
  }

  selectItem(item) {
    this.contextMenuData.selectedItem = item;
    this.itemSelected.emit(this.contextMenuData);
    this.contextMenuConfig.showMenu = false;
  }
}
