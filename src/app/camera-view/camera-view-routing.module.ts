import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CameraViewComponent } from './camera-view.component';

const routes: Routes = [
  {
    path: '',
    component: CameraViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CameraViewRoutingModule {}
