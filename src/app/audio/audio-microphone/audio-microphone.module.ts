import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AudioMicrophoneRoutingModule } from './audio-microphone-routing.module';
import { AudioMicrophonesComponent } from './audio-microphones.component';
import { DynamicBeamsComponent } from './dynamic-beams/dynamic-beams.component';
import { StaticBeamsComponent } from './static-beams/static-beams.component';
import { ZoneBeamsComponent } from './zone-beams/zone-beams.component';

@NgModule({
  declarations: [AudioMicrophonesComponent, DynamicBeamsComponent, StaticBeamsComponent, ZoneBeamsComponent],
  imports: [CommonModule, SharedModule, AudioMicrophoneRoutingModule],
})
export class AudioMicrophoneModule {}
