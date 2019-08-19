import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import {
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatRippleModule,
  MatToolbarModule,
  MatMenuModule
} from '@angular/material';
import { GridsterModule } from 'angular2gridster';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppConfigService } from './services/app.config';
import { LayoutModule } from './layout/layout.module';
import { ShellComponent, ShellService } from './shell/shell.component';

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    LayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatToolbarModule,
    MatMenuModule,
    GridsterModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AngularFirestore,
    AngularFireAuth,
    AngularFireStorage,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    },
    ShellService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
