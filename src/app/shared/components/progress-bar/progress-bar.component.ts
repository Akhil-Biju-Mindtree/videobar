import { Component, OnInit, Input, OnDestroy, NgZone } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  @Input() uuid: string;
  @Input() label: string;
  unsubscribe: Subject<void> = new Subject();
  value: string;

  constructor(private deviceManagerService: DeviceDataManagerService, private zone: NgZone) { }

  ngOnInit() {
    this.subscribeControlState();
  }

  subscribeControlState() {
    this.deviceManagerService.listenFromDevice(this.uuid).pipe(takeUntil(this.unsubscribe))
    .subscribe((value) => {
      this.zone.run(() => {
        this.value = value;
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
