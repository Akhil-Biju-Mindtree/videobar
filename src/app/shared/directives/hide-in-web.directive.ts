import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';
import { AppConfig } from '@environment/environment';

@Directive({
  selector: '[appHideInWeb]',
})
export class HideInWebDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    if (!AppConfig.isDesktopApp) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}
