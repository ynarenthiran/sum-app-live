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
  MatCardModule,
  MatDialogModule
} from '@angular/material';
import { MomentModule } from 'ngx-moment';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {
  TileBase, TileText, TileListTemplate, TileList, TileTrend
} from './tiles/tiles.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardPage, PageTileInstance, PageTileHost, PageTileSettingsDialog } from './page/page.component';
import { GridsterModule } from 'angular2gridster';
import { UIModule } from '../ui/ui.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardPage,
    PageTileInstance,
    PageTileSettingsDialog,
    PageTileHost,
    TileBase,
    TileText,
    TileList,
    TileListTemplate,
    TileTrend
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
    MatDialogModule,
    DashboardRoutingModule,
    UIModule,
    MomentModule,
    GridsterModule,
    NgxChartsModule
  ],
  exports: [
  ],
  providers: [
  ],
  entryComponents: [
    PageTileSettingsDialog
  ]
})
export class DashboardModule { }
