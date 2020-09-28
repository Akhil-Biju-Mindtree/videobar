import { Directive, ElementRef, AfterContentInit, Input } from '@angular/core';
import { SharedConstants } from '@shared/shared.constants';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements AfterContentInit {
  @Input() focusOnEmpty: boolean;
  @Input() queryString: string;

  constructor(private element: ElementRef) {}

  ngAfterContentInit() {
    setTimeout(() => {
      const queryStr = this.queryString ? this.queryString : SharedConstants.TEXT.INPUT;
      const elementToFocus = this.element.nativeElement.querySelector(queryStr);
      if (this.focusOnEmpty && elementToFocus.value) {
        return;
      }
      this.dispatchFocus(elementToFocus);
    });
  }

  dispatchFocus(elementToFocus) {
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }
}
