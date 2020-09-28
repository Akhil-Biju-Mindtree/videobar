import { Directive, HostBinding, HostListener } from '@angular/core';
import { SharedConstants } from '../shared.constants';

@Directive({
  selector: '[appChangeBgColor]',
})
export class ChangeBgColorDirective {
  @HostBinding('style.background-color') bgColor = SharedConstants.STYLES.FILEUPLOAD_BGCOLOR_DEFAULT;
  @HostBinding('style.color') textColor = SharedConstants.STYLES.FILEUPLOAD_TEXTCOLOR_DEFAULT;
  isFileOver = false;

  constructor() {}

  @HostListener('onFileOver', ['$event']) onFileOver(event) {
    this.isFileOver = true;
    this.bgColor = SharedConstants.STYLES.FILEUPLOAD_BGCOLOR_HOVER;
    this.textColor = SharedConstants.STYLES.FILEUPLOAD_TEXTCOLOR_HOVER;
  }

  @HostListener('onFileLeave', ['$event']) onFileLeave(event) {
    this.isFileOver = false;
    setTimeout(() => {
      if (!this.isFileOver) {
        this.bgColor = SharedConstants.STYLES.FILEUPLOAD_BGCOLOR_DEFAULT;
        this.textColor = SharedConstants.STYLES.FILEUPLOAD_TEXTCOLOR_DEFAULT;
      }
    },         100);
  }

  @HostListener('onFileDrop', ['$event']) onFileDrop(event) {
    this.isFileOver = false;
    this.bgColor = SharedConstants.STYLES.FILEUPLOAD_BGCOLOR_DEFAULT;
    this.textColor = SharedConstants.STYLES.FILEUPLOAD_TEXTCOLOR_DEFAULT;
  }
}
