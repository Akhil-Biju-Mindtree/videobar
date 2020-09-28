import { Component, OnInit } from '@angular/core';
import { VIDEO_NAVIGATION_ITEMS } from './video.constant';
import { AppConfig } from '@environment/environment';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  navigationItems = VIDEO_NAVIGATION_ITEMS;
  isDesktopApp = AppConfig.isDesktopApp;
  constructor() {}

  ngOnInit() {}
}
