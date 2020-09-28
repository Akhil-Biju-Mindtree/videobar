import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PagenotfoundComponent } from '@core/pagenotfound/pagenotfound.component';
import { NoAuthGuard } from '@core/guards/no-auth.guard';
import { DeviceDiscoveryComponent } from '@core/device-discovery/device-discovery.component';
import { AdminGuard } from '@core/guards/admin.guard';
import { CacheInitResolve } from '@core/guards/resolve.guard';
import { LoginResolverGuard } from '@core/guards/login-resolver.guard';

const routes: Routes = [
  { path: 'discovery', component: DeviceDiscoveryComponent, canActivate: [NoAuthGuard] },
  { path: '', redirectTo: '/status', pathMatch: 'full' },
  {
    path: 'camera',
    loadChildren: () => import('./camera-view/camera-view.module').then(m => m.CameraViewModule),
  },
  {
    path: 'audio',
    loadChildren: () => import('./audio/audio.module').then(m => m.AudioModule),
    canActivate: [AdminGuard],
    resolve: {
      cache: CacheInitResolve,
    },
  },
  {
    path: 'configuration',
    loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule),
    canActivate: [AdminGuard],
    resolve: {
      cache: CacheInitResolve,
    },
  },
  {
    path: 'network',
    loadChildren: () => import('./network/network.module').then(m => m.NetworkModule),
    canActivate: [AdminGuard],
    resolve: {
      cache: CacheInitResolve,
    },
  },
  {
    path: 'status',
    loadChildren: () => import('./status/status.module').then(m => m.StatusModule),
    canActivate: [AdminGuard],
    resolve: {
      cache: CacheInitResolve,
    },
  },
  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then(m => m.VideoModule),
    canActivate: [AdminGuard],
    resolve: {
      cache: CacheInitResolve,
    },
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AdminGuard],
    resolve: {
      cache: CacheInitResolve,
    },
  },
  {
    path: 'login',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    resolve: {
      cache: LoginResolverGuard,
    },
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
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
