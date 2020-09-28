import { NgModule } from '@angular/core';
import { FlexLayoutModule, DEFAULT_BREAKPOINTS, BREAKPOINTS, BreakPoint } from '@angular/flex-layout';

/**
 * For mobile and tablet, reset ranges
 */
function updateBreakpoints(bp: BreakPoint) {
  switch (bp.alias) {
    case 'xs':
      bp.mediaQuery = 'only screen and (min-width: 0px) and (max-width: 639px)';
      bp.overlapping = false;
      break;
    case 'md':
      bp.mediaQuery = 'only screen and (min-width: 640px) and (max-width: 719px)';
      bp.overlapping = false;
      break;
    case 'lt-lg':
      bp.mediaQuery = 'only screen and (max-width: 719px)';
      bp.overlapping = false;
      break;
    case 'lg':
      bp.mediaQuery = 'only screen and (min-width: 720px) and (max-width: 1023px)';
      bp.overlapping = false;
      break;
    case 'xl':
      bp.mediaQuery = 'only screen and (min-width: 1024px)';
      bp.overlapping = false;
      break;

    default:
      bp.mediaQuery = '';
      bp.overlapping = false;
      break;
  }
  return bp;
}

@NgModule({
  imports: [FlexLayoutModule.withConfig({ disableDefaultBps: true })],
  exports: [FlexLayoutModule],
  providers: [
    // register a Custom BREAKPOINT Provider
    {
      provide: BREAKPOINTS,
      useFactory: function customizeBreakPoints() {
        return DEFAULT_BREAKPOINTS.map(updateBreakpoints);
      },
    },
  ],
})
export class CustomBreakpointsModule {}
