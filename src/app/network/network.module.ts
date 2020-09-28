import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkRoutingModule } from './network-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NetworkComponent } from './network.component';
import { WiredComponent } from './wired/wired.component';
import { WirelessComponent } from './wireless/wireless.component';
import { SnmpComponent } from './snmp/snmp.component';

@NgModule({
  declarations: [NetworkComponent, WiredComponent, WirelessComponent, SnmpComponent],
  imports: [CommonModule, SharedModule, NetworkRoutingModule],
})
export class NetworkModule {}
