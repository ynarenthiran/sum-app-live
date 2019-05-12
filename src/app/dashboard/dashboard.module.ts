import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatExpansionModule,
  MatListModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule
} from '@angular/material';
import { MomentModule } from 'ngx-moment';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {
  DashboardComponent,
  DashboardSection,
  DashboardTile,
  DashboardTileItem,
  DashboardTileOutlet
} from './page/dashboard.component';
import {
  TileUser,
  TileUserTemplate
} from './tiles/user.tile';
import {
  TileCollection,
  TileCollectionTemplate
} from './tiles/collection.tile';
import { TemplateComponent } from './template/template.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardSection,
    DashboardTile,
    DashboardTileItem,
    DashboardTileOutlet,
    TileUser,
    TileUserTemplate,
    TileCollection,
    TileCollectionTemplate,
    TemplateComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    DashboardRoutingModule,
    MomentModule
  ],
  exports: [
    DashboardComponent,
    DashboardSection,
    DashboardTile,
    TileUser,
    TileUserTemplate,
    TileCollection,
    TileCollectionTemplate
  ]
})
export class DashboardModule { }
