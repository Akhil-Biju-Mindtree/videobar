import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import { SharedModule } from '@shared/shared.module';
import { CameraSettingsComponent } from './camera-settings/camera-settings.component';
import { ImageSettingsComponent } from './image-settings/image-settings.component';
import { AutoframeSettingsComponent } from './autoframe-settings/autoframe-settings.component';
import { VideoRoutingModule } from './video-routing.module';
import { CameraSettingsPresetComponent } from './camera-settings/camera-settings-preset/camera-settings-preset.component';

@NgModule({
  declarations: [
    VideoComponent,
    CameraSettingsComponent,
    ImageSettingsComponent,
    AutoframeSettingsComponent,
    CameraSettingsPresetComponent,
  ],
  imports: [CommonModule, SharedModule, VideoRoutingModule],
})
export class VideoModule {}
