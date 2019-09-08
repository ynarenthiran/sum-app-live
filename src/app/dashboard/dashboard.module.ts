import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  MatDialogModule,
  MatRippleModule,
  MatSelectModule
} from '@angular/material';
import { MomentModule } from 'ngx-moment';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {
  TileBase, TileText, TileListTemplate, TileList, TileTrend, TileChart,
  TileChartSeries,
  TileSettingsDialog
} from './tiles/tiles.component';
import { DashboardComponent } from './dashboard.component';
import {
  DashboardPage, PageTileInstance, PageTileHost, PageTileSettingsHost, TileCreateDialog
} from './page/page.component';
import { GridsterModule } from 'angular2gridster';
import { UIModule } from '../ui/ui.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardPage,
    PageTileInstance,
    PageTileHost,
    PageTileSettingsHost,
    TileBase,
    TileText,
    TileList,
    TileListTemplate,
    TileTrend,
    TileChart,
    TileChartSeries,
    TileSettingsDialog,
    TileCreateDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
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
    MatSidenavModule,
    MatExpansionModule,
    MatRippleModule,
    MatSelectModule,
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
    TileSettingsDialog,
    TileCreateDialog
  ]
})
export class DashboardModule { }
