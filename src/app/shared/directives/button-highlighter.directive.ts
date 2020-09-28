import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appButtonHighlighter]',
})
export class ButtonHighlighterDirective {
  @Input() appButtonHighlighter: any;
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.applyStyle(
      this.appButtonHighlighter.onMouseEnter.backgroundColor,
      this.appButtonHighlighter.onMouseEnter.color,
      this.appButtonHighlighter.onMouseEnter.opacity,
    );
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.applyStyle(
      this.appButtonHighlighter.onMouseLeave.backgroundColor,
      this.appButtonHighlighter.onMouseLeave.color,
      this.appButtonHighlighter.onMouseLeave.opacity,
    );
  }

  @HostListener('mousedown') onmousedown() {
    this.applyBackgroundColor(this.appButtonHighlighter.onMouseDown.backgroundColor);
  }

  @HostListener('mouseup') onmouseup() {
    this.applyBackgroundColor(this.appButtonHighlighter.onMouseUp.backgroundColor);
  }

  private applyStyle(backgroundColor, color, opacity) {
    this.el.nativeElement.style.backgroundColor = backgroundColor;
    this.el.nativeElement.style.color = color;
    this.el.nativeElement.style.opacity = opacity;
  }

  private applyBackgroundColor(backgroundColor) {
    this.el.nativeElement.style.backgroundColor = backgroundColor;
  }
}
