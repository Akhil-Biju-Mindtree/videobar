import { Component, OnInit } from '@angular/core';
import { CONFIGURATION_NAVIGATION_ITEMS } from 'app/configuration/configuration.constant';
import { NavigationItem } from '@shared/models/navigation.model';
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  constructor() {}
  navigationItems: NavigationItem[] = CONFIGURATION_NAVIGATION_ITEMS;

  ngOnInit() {}
}
