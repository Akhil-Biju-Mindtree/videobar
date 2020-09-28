import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraControlsComponent } from './camera-controls/camera-controls.component';
import { AutoFrameComponent } from './camera-controls/auto-frame/auto-frame.component';
import { GrabPaneComponent } from './camera-controls/grab-pane/grab-pane.component';
import { PresetsComponent } from './camera-controls/presets/presets.component';
import { ZoomComponent } from './camera-controls/zoom/zoom.component';
import { CameraViewComponent } from './camera-view.component';
import { CameraViewRoutingModule } from './camera-view-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    CameraControlsComponent,
    AutoFrameComponent,
    GrabPaneComponent,
    PresetsComponent,
    ZoomComponent,
    CameraViewComponent,
  ],
  imports: [CommonModule, SharedModule, CameraViewRoutingModule],
  exports: [],
})
export class CameraViewModule {}
