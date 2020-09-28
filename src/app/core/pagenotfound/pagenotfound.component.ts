import { Component, OnInit } from '@angular/core';
import { APP_INFO } from '@core/constants/app.constant';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss'],
})
export class PagenotfoundComponent implements OnInit {
  appInfo = APP_INFO;
  constructor() {}
  ngOnInit() {}
}
