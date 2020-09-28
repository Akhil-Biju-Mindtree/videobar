import { Component, OnInit } from '@angular/core';
import { AUDIO_NAVIGATION_ITEMS } from 'app/audio/audio.constant';
import { NavigationItem } from '@shared/models/navigation.model';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent  {
  navigationItems: NavigationItem[] = AUDIO_NAVIGATION_ITEMS;

  get isFullScreen() {
    return this.applicationDataManagerService.listenForAppData(AppConstants.AUDIO_BEAMS_EXPANDED);
  }

  constructor(private applicationDataManagerService: ApplicationDataManagerService) { }

}
