import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AudioMicrophonesComponent } from './audio-microphones.component';
import { StaticBeamsComponent } from './static-beams/static-beams.component';
import { DynamicBeamsComponent } from './dynamic-beams/dynamic-beams.component';
import { ZoneBeamsComponent } from './zone-beams/zone-beams.component';
import { AUDIO_CONSTANTS } from '../audio.constant';

const routes: Routes = [
  {
    path: '',
    component: AudioMicrophonesComponent,
    children: [
      { path: AUDIO_CONSTANTS.URL.STATIC_BEAM_URL, component: StaticBeamsComponent },
      { path: AUDIO_CONSTANTS.URL.DYNAMIC_BEAM_URL, component: DynamicBeamsComponent },
      { path: AUDIO_CONSTANTS.URL.ZONE_BEAM_URL, component: ZoneBeamsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudioMicrophoneRoutingModule {}
