import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Logger } from '@core/logger/Logger';

import { WirelessComponent } from './wireless.component';

import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { AuthService } from '@core/auth/auth.service';
import { NetworkService } from '../network.service';
import { UtilitiesService } from '@providers/utilities.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { FormControl } from '@angular/forms';
import { NetworkConstant } from '../network.constant';
import { AppConfig } from '@environment/environment';
import { AppConstants } from '@core/constants/app.constant';
import { WirelessPasswordComponent } from '@shared/components/dialog/dialog-content/wireless-password/wireless-password.component';
import { WirelessEapPasswordComponent } from '@shared/components/dialog/dialog-content/wireless-eap-password/wireless-eap-password.component';
import { WirelessOtherNetworkComponent } from '@shared/components/dialog/dialog-content/wireless-other-network/wireless-other-network.component';

class DeviceDataManagerServiceMock {
  listenFromDevice(key) {
    let returnValue;
    if (key === '4d8502a1-ef87-442f-a95b-59b9576b2ec9') {
      returnValue = JSON.stringify({
        '24:f5:a2:18:9d:8e': ['-28', '[WPA2-PSK-CCMP][ESS]', 'Bose-Test-WEP'],
        '1a:19:d6:89:06:b0': ['-37', '[EAP-PSK-CCMP][ESS]', 'K wifi'],
        '1a:1b:f7:89:16:b0': ['-77', '[WEP-CCMP][ESS]', 'WEP wifi'],
        'd4:f5:a2:08:9d:8f': ['-93', '[WPA2-PSK-CCMP][ESS]', 'WPA-Test-WEP'],
        '15:34:f7:89:a6:b0': ['-77', '[WPA-PSK-CCMP][ESS]', ''],
        '35:d4:f7:89:a6:b0': ['-77', '[CCMP][ESS]', 'ancd'],
      });
    } else {
      returnValue = '';
    }
    return of(returnValue);
  }

  sendToDevice(action, object) {
    let returnValue;
    // tslint:disable-next-line:no-small-switch
    switch (Object.keys(object)[0]) {
      case 'f142b729-c78f-47dc-9e27-acdf9b5acd28':
        returnValue = of({ wifi: { AF: '' } });
        break;
      default:
        returnValue = '';
    }
    return returnValue;
  }
}

// tslint:disable-next-line:no-big-function
describe('WirelessComponent', () => {
  let component: WirelessComponent;
  let fixture: ComponentFixture<WirelessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WirelessComponent],
      imports: [],
      providers: [
        { provide: DeviceDataManagerService, useClass: DeviceDataManagerServiceMock },
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: Logger, useValue: { info: () => {} } },
        { provide: DialogService, useValue: { openDialog: () => {} } },
        { provide: AuthService, useValue: { setAdminAccess: () => {} } },
        {
          provide: NetworkService,
          useValue: {
            getIsClosedClicked: () => of(false),
            getIsJoinToNetworkClicked: () => of(true),
            setIsJoinToNetworkClicked: () => {},
          },
        },
        { provide: UtilitiesService, useValue: { debounce: () => {} } },
        { provide: NotificationService, useValue: {} },
        { provide: ApplicationDataManagerService, useValue: { listenForAppData: () => of(true) } },
        { provide: Router, useValue: { navigateByUrl: (url: any) => url } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WirelessComponent);
    component = fixture.componentInstance;
    component.connectedDeviceName = '';
    component.previousNetworkConnected = '';
    component.isWirelessEnabled = true;
    component.wifiNameForm.addControl(NetworkConstant.UUID.WIFI.WIFI_SSID, new FormControl(''));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on getNetworkList should trigger drop down event', () => {
    component.dropDownOpenEvent.subscribe((value) => {
      expect(value).toBeTruthy();
    });
    component.getNetworkList(true);
  });

  it('on wireless status toggle the wirless stastus need to be updated', () => {
    component.onToggleWiredStatus(false);
    expect(component.isWirelessEnabled).toBeFalsy();
  });

  it('hostlistener on window unload', () => {
    spyOn(component, 'ngOnDestroy');
    const event = new Event('beforeunload');
    component.beforeunloadHandler(event);
    expect(component.ngOnDestroy).toBeCalledTimes(1);
  });

  it('send password & Join on selecting network with no security type', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const selectedNetwork = {
      securityCategory: 'none',
      name: 'no security type',
    };
    component.onSelectNetworkList(selectedNetwork);
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SSID]: selectedNetwork.name,
    });
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_SECURITY]: selectedNetwork.securityCategory,
    });
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_PASSWORD]: '',
    });
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [NetworkConstant.UUID.WIFI.WIFI_JOIN]: '',
    });
  });

  it('open psk password dialog on selecting network with wpa security type', () => {
    const spyOnComponentPassword = spyOn(component, 'openPasswordDialog');
    const selectedNetwork = {
      securityCategory: 'wpa',
      name: 'WPA test network',
    };
    component.onSelectNetworkList(selectedNetwork);
    expect(spyOnComponentPassword).toBeCalledWith(selectedNetwork);
  });

  it('open eap password dialog on selecting network with eap security type', () => {
    const spyOnComponentPassword = spyOn(component, 'openEapFormDialog');
    const selectedNetworkeap = {
      securityCategory: 'eap',
      name: 'EAP test network 1',
    };
    component.onSelectNetworkList(selectedNetworkeap);
    expect(spyOnComponentPassword).toBeCalledWith(selectedNetworkeap);
  });

  it('open wep password dialog on selecting network with wep security type', () => {
    const spyOnComponentPassword = spyOn(component, 'openWepFormDialog');
    const selectedNetworkwep = {
      securityCategory: 'wep',
      name: 'EAP test network',
    };
    component.onSelectNetworkList(selectedNetworkwep);
    expect(spyOnComponentPassword).toBeCalledWith(selectedNetworkwep);
  });

  it('open otherNetwork dialog on selecting other network', () => {
    const spyOnComponentPassword = spyOn(component, 'openDialogForOtherNetwork');
    const selectedNetworkjoin = {
      securityCategory: 'otherNetwork',
      name: 'joinOtherNetwork',
    };
    component.onSelectNetworkList(selectedNetworkjoin);
    expect(spyOnComponentPassword).toBeCalledWith(selectedNetworkjoin);
  });

  it('onStatusChange change to disconnected SSID name should go empty', () => {
    const status = 'Disconnected';
    component.isJoinToNetworkClicked = false;
    component.onStatusChange(status);
    expect(component.connectedDeviceName).toEqual('');
    expect(component.wifiNameForm.get(component.wifiNameUuid).value).toEqual('');
  });

  it('onStatusChange change to Connected SSID name should go empty', () => {
    const status = 'Connected';
    component.previousNetworkConnected = 'abcd';
    component.onStatusChange(status);
    expect(component.connectedDeviceName).toEqual(component.previousNetworkConnected);
    expect(component.wifiNameForm.get(component.wifiNameUuid).value).toEqual(component.previousNetworkConnected);
  });

  it('open pasword dialog', () => {
    const selectedNetwork = {
      securityCategory: 'wpa',
      name: 'WPA test network',
    };
    const spyOnDialogService = spyOn(TestBed.get(DialogService), 'openDialog');
    component.openPasswordDialog(selectedNetwork);
    expect(spyOnDialogService).toBeCalledWith(
      WirelessPasswordComponent,
      `The Wireless network "${selectedNetwork.name}" requires a WPA2 password.`,
      NetworkConstant.ICON.WIFI,
      { RefuteButtonLabel: 'Cancel', confirmButtonLabel: 'Join' },
      selectedNetwork,
    );
  });

  it('open eap dialog', () => {
    const selectedNetwork = {
      securityCategory: 'eap',
      name: 'EAP test network',
    };
    const spyOnDialogService = spyOn(TestBed.get(DialogService), 'openDialog');
    component.openEapFormDialog(selectedNetwork);
    expect(spyOnDialogService).toBeCalledWith(
      WirelessEapPasswordComponent,
      `The Wireless network "${selectedNetwork.name}" requires a 802.1 x EAP password.`,
      NetworkConstant.ICON.WIFI,
      { RefuteButtonLabel: 'Cancel', confirmButtonLabel: 'Join' },
      selectedNetwork,
    );
  });

  it('open wep dialog', () => {
    const selectedNetwork = {
      securityCategory: 'wep',
      name: 'WEP test network 1',
    };
    const spyOnDialogService = spyOn(TestBed.get(DialogService), 'openDialog');
    component.openWepFormDialog(selectedNetwork);
    expect(spyOnDialogService).toBeCalledWith(
      WirelessPasswordComponent,
      `The Wireless network "${selectedNetwork.name}" requires a WEP password.`,
      NetworkConstant.ICON.WIFI,
      { RefuteButtonLabel: 'Cancel', confirmButtonLabel: 'Join' },
      selectedNetwork,
    );
  });

  it('open other network dialog', () => {
    const selectedNetwork = {
      securityCategory: 'joinothernetwork',
      name: 'Other network test network 1',
    };
    const spyOnDialogService = spyOn(TestBed.get(DialogService), 'openDialog');
    component.openDialogForOtherNetwork(selectedNetwork);
    expect(spyOnDialogService).toBeCalledWith(
      WirelessOtherNetworkComponent,
      `Find and join a Wireless Network.`,
      NetworkConstant.ICON.WIFI,
      { RefuteButtonLabel: 'Cancel', confirmButtonLabel: 'Join' },
      selectedNetwork,
    );
  });

  it('on autoConect checked should send on data do device', () => {
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.onAutoConnectSelect(true);
    expect(spyOnSendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_AUTOCONNECT]: AppConstants.StateOn,
    });
  });

  it('on autoConect unchecked should send off data do device', () => {
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.onAutoConnectSelect(false);
    expect(spyOnSendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [NetworkConstant.UUID.WIFI.WIFI_AUTOCONNECT]: AppConstants.StateOff,
    });
  });

  it('on reset network service flag should set isJoinToNetworkClicked to false', () => {
    const spyOnNetworkService = spyOn(TestBed.get(NetworkService), 'setIsJoinToNetworkClicked');
    component.resetNetworkServiceFlags();
    expect(spyOnNetworkService).toBeCalledWith(false);
  });

  it('should create web instence and logout on disabled wireless & no websocket', () => {
    AppConfig.isDesktopApp = false;
    const router = TestBed.get(Router);
    const deviceDataManagerService = TestBed.get(DeviceDataManagerService);
    const spySendToDevice = spyOn(deviceDataManagerService, 'sendToDevice');
    const spy = spyOn(router, 'navigateByUrl');
    const webFixture = TestBed.createComponent(WirelessComponent);
    const webComponent = webFixture.componentInstance;
    webComponent.connectedDeviceName = '';
    webComponent.previousNetworkConnected = '';
    webComponent.isWirelessEnabled = false;
    webComponent.wifiNameForm.addControl(NetworkConstant.UUID.WIFI.WIFI_SSID, new FormControl(''));
    webFixture.detectChanges();
    expect(webComponent).toBeTruthy();
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Retrieve, AppConstants.HOME_SCREEN_UUIDS);
    expect(spy).toBeCalledWith('/login');
  });
});
