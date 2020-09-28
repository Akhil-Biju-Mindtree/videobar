import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagenotfoundComponent } from '@core/pagenotfound/pagenotfound.component';
import { NoAuthGuard } from '@core/guards/no-auth.guard';
import { DeviceDiscoveryComponent } from '@core/device-discovery/device-discovery.component';
import { AdminGuard } from '@core/guards/admin.guard';

const routes: Routes = [
  { path: 'discovery', component: DeviceDiscoveryComponent, canActivate: [NoAuthGuard] },
  { path: '', redirectTo: '/discovery', pathMatch: 'full' },
  {
    path: 'camera',
    loadChildren: () => import('./camera-view/camera-view.module').then(m => m.CameraViewModule),
  },
  {
    path: 'audio',
    loadChildren: () => import('./audio/audio.module').then(m => m.AudioModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'configuration',
    loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'network',
    loadChildren: () => import('./network/network.module').then(m => m.NetworkModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'status',
    loadChildren: () => import('./status/status.module').then(m => m.StatusModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then(m => m.VideoModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'not-found',
    component: PagenotfoundComponent,
    canActivate: [NoAuthGuard],
    data: {
      message: 'page not found',
    },
  },
  // !(Generic route) this route should be at the very last of all our routes
  { path: '**', redirectTo: '/not-found' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
