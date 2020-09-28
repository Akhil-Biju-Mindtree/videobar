import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationItem } from '@shared/models/navigation.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Input() navigationItems: NavigationItem[];
  @Input() isUnderLined = false;
  @Input() isDisabled = false;

  videoRoute = 'video';
  microphoneRoute = 'microphones';
  configurationRoute = 'configuration';
  networkRoute = 'network';

  constructor(public router: Router) {}

  ngOnInit() {}
}
