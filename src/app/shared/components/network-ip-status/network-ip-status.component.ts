import { Component, OnInit, NgZone, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ConfirmationDialogModel } from '../confirmation-dialog/confirmation-dialog.model';
import { NetworkConstant } from 'app/network/network.constant';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { AppConfig } from '@environment/environment';

@Component({
  selector: 'app-network-ip-status',
  templateUrl: './network-ip-status.component.html',
  styleUrls: ['./network-ip-status.component.scss'],
})
export class NetworkIpStatusComponent implements OnInit, OnDestroy {
  @Input() connectionStatusStateUUID: string;
  @Input() wiredStatusUUID: string;
  @Input() ethernetIcon: string;
  @Output() toggleStatus = new EventEmitter<boolean>();
  @Output() statusChange = new EventEmitter<string>();

  unSubscribe: Subject<void> = new Subject();
  displayConnection: string;
  statusUUID: string;
  toggled: boolean;

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit() {
    this.initializeListeners();
  }

  initializeListeners() {
    this.deviceManagerService
      .listenFromDevice(this.connectionStatusStateUUID)
      .pipe(
        takeUntil(this.unSubscribe),
        map((connectionStatus: string) => this.displayStatusState(connectionStatus)),
      )
      .subscribe((connectionStatus: string) => {
        this.ngZone.run(() => {
          this.displayConnection = connectionStatus;
          this.onChange(connectionStatus);
        });
      });
    if (AppConfig.isDesktopApp) {
      this.statusUUID = this.wiredStatusUUID;
    } else {
      this.deviceManagerService
        .listenFromDevice(this.wiredStatusUUID)
        .pipe(
          takeUntil(this.unSubscribe),
          map(value => value !== AppConstants.StateOff),
        )
        .subscribe((value: boolean) => {
          setTimeout(() => {
            this.toggleStatus.emit(value);
          });
          this.ngZone.run(() => {
            this.toggled = value;
          });
        });
    }
  }

  displayStatusState(connectionStatus): string {
    if (connectionStatus === AppConstants.API_STATE.READY || connectionStatus === AppConstants.API_STATE.ONLINE) {
      return AppConstants.CONNECTION_STATE.CONNECTED;
    }
    if (
      connectionStatus === AppConstants.API_STATE.ASSOCIATION ||
      connectionStatus === AppConstants.API_STATE.CONFIGURATION
    ) {
      return AppConstants.CONNECTION_STATE.CONNECTING;
    }
    return AppConstants.CONNECTION_STATE.DISCONNECTED;
  }

  onToggle(event) {
    if (!AppConfig.isDesktopApp && !event) {
      this.showDialog().then((result: boolean) => {
        if (result) {
          this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
            [this.wiredStatusUUID]: AppConstants.StateOff,
          });
          this.toggled = event;
          this.toggleStatus.emit(event);
        } else {
          this.toggled = !event;
          this.toggleStatus.emit(!event);
        }
      });
    } else if (!AppConfig.isDesktopApp) {
      this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
        [this.wiredStatusUUID]: event ? AppConstants.StateOn : AppConstants.StateOff,
      });
      this.toggleStatus.emit(event);
    } else {
      this.toggleStatus.emit(event);
    }
  }

  showDialog() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_DIALOG_HEADER;
    confirmationDialogModel.content = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_CONTENT;
    confirmationDialogModel.confirmButtonLabel = NetworkConstant.DIALOG_TEXTS.NETWORK_APPLY_CONFIRM_TEXT;
    return this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel);
  }

  onChange(change) {
    this.statusChange.emit(change);
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
