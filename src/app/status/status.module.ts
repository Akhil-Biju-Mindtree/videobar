import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusRoutingModule } from './status-routing.module';
import { SharedModule } from '@shared/shared.module';
import { StatusComponent } from './status.component';

@NgModule({
  declarations: [StatusComponent],
  imports: [CommonModule, SharedModule, StatusRoutingModule],
})
export class StatusModule {}
