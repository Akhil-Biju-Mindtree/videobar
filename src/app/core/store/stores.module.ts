import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { appReducer } from '@core/store/reducers/app.reducers';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { DeviceEffects } from '@core/store/effects/device.effects';
import { AppConfig } from '@environment/environment';
import { rootStoreReducer } from './reducers/root-store.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(appReducer, { metaReducers: [rootStoreReducer] }),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    EffectsModule.forRoot([DeviceEffects]),
    AppConfig.production
      ? []
      : StoreDevtoolsModule.instrument({
        name: 'BOSE Raphael Project', // debugging this application APM Demo App DevTools
        maxAge: 25, // number of history to be stored in the devtool
        logOnly: AppConfig.production, // for logging features
      }),
  ],
})
export class StoresModule {}
