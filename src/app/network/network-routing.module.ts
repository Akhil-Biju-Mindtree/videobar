import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetworkComponent } from './network.component';
import { WiredComponent } from './wired/wired.component';
import { WirelessComponent } from './wireless/wireless.component';
import { SnmpComponent } from './snmp/snmp.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkComponent,
    children: [
      { path: '', redirectTo: 'wired', pathMatch: 'full' },
      {
        path: 'wired',
        component: WiredComponent,
      },
      {
        path: 'wireless',
        component: WirelessComponent,
      },
      {
        path: 'snmp',
        component: SnmpComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkRoutingModule {}
