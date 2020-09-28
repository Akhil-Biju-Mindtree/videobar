import { Component, OnInit } from '@angular/core';
import { ADMIN_CONST } from './admin.constant';
import { AppConfig } from '@environment/environment';
import { APP_INFO } from '@core/constants/app.constant';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  appInfo = APP_INFO;
  isDesktopApp = AppConfig.isDesktopApp;

  constructor() {}

  ngOnInit() {}
}
