import { Directive, ElementRef, NgZone, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[isEllipsisActive]',
})
export class EllipsisActiveDirective implements AfterViewChecked {
  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  ngAfterViewChecked(): void {
    this.ngZone.run(() => {
      const element = this.elementRef.nativeElement;
      if (element.offsetWidth < element.scrollWidth) {
        element.title = element.innerHTML;
      } else {
        element.title = '';
      }
    });
  }
}
