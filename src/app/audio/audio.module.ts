import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AudioRoutingModule } from './audio-routing.module';
import { AudioComponent } from './audio.component';
import { AudioControlsComponent } from './audio-controls/audio-controls.component';
import { AudioMetersComponent } from './audio-meters/audio-meters.component';

@NgModule({
  declarations:
  [
    AudioComponent,
    AudioControlsComponent,
    AudioMetersComponent,
  ],
  imports: [CommonModule, SharedModule, AudioRoutingModule],
})
export class AudioModule { }
