import { Component, OnInit } from '@angular/core';
import { NETWORK_NAVIGATION_ITEMS } from './network.constant';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
  navigationItems = NETWORK_NAVIGATION_ITEMS;
  constructor() {}

  ngOnInit() {}
}
