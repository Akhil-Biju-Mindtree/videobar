import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AudioComponent } from './audio.component';
import { AudioControlsComponent } from './audio-controls/audio-controls.component';
import { AudioMetersComponent } from './audio-meters/audio-meters.component';
import { MicrophoneGuard } from './microphone.guard';

const routes: Routes = [
  {
    path: '',
    component: AudioComponent,
    children: [
      { path: '', redirectTo: 'microphones', pathMatch: 'full' },
      {
        path: 'microphones',
        loadChildren: () => import('./audio-microphone/audio-microphone.module').then(m => m.AudioMicrophoneModule),
      },
      { path: 'meters', component: AudioMetersComponent },
      { path: 'controls', component: AudioControlsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudioRoutingModule { }
