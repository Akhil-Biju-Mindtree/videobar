import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { UserAccessComponent } from './user-access/user-access.component';
import { IdentityComponent } from './identity/identity.component';
import { SystemComponent } from './system/system.component';
import { ProfileComponent } from './profile/profile.component';
import { FirmwareComponent } from './firmware/firmware.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    UserAccessComponent,
    IdentityComponent,
    SystemComponent,
    ProfileComponent,
    FirmwareComponent,
  ],
  imports: [CommonModule, SharedModule, ConfigurationRoutingModule],
})
export class ConfigurationModule {}
