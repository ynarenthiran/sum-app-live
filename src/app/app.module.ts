import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import {
  MatCardModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatRippleModule,
  MatToolbarModule,
  MatMenuModule,
  MatExpansionModule,
  MatListModule,
  MatBadgeModule
} from '@angular/material';
import { DragulaModule } from 'ng2-dragula';
import { GridsterModule } from 'angular2gridster';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppConfigService } from './services/app.config';
import { LayoutModule } from './layout/layout.module';
import { ShellComponent, ShellService } from './shell/shell.component';
import { MomentModule } from 'ngx-moment';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DialogModule } from './dialog/dialog.module';

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    LayoutModule,
    DialogModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatToolbarModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    MatBadgeModule,
    MomentModule,
    DragulaModule.forRoot(),
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
