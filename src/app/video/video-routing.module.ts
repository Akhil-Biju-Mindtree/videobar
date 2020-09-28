import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoComponent } from './video.component';
import { CameraSettingsComponent } from './camera-settings/camera-settings.component';
import { AutoframeSettingsComponent } from './autoframe-settings/autoframe-settings.component';
import { ImageSettingsComponent } from './image-settings/image-settings.component';
import { VideoCanDeactivateGuardService } from './video-candeactivate-guard.service';

const routes: Routes = [
  {
    path: '',
    component: VideoComponent,
    children: [
      { path: '', redirectTo: 'camera-setting', pathMatch: 'full' },
      {
        path: 'camera-setting',
        component: CameraSettingsComponent,
        canDeactivate: [VideoCanDeactivateGuardService],
      },
      {
        path: 'autoframe',
        component: AutoframeSettingsComponent,
      },
      {
        path: 'image',
        component: ImageSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
