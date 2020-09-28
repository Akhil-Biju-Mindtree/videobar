import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { UserAccessComponent } from 'app/configuration/user-access/user-access.component';
import { IdentityComponent } from 'app/configuration/identity/identity.component';
import { SystemComponent } from 'app/configuration/system/system.component';
import { ProfileComponent } from 'app/configuration/profile/profile.component';
import { FirmwareComponent } from 'app/configuration/firmware/firmware.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      { path: '', redirectTo: 'firmware', pathMatch: 'full' },
      { path: 'firmware', component: FirmwareComponent },
      { path: 'user-access', component: UserAccessComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'identity', component: IdentityComponent },
      { path: 'system', component: SystemComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
