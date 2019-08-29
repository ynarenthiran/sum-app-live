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
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {
  TileBase, TileList, TileListTemplate, TileChart,
  TileChartSeries
} from './tiles/tiles.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardPage, PageTileInstance, PageTileHost } from './page/page.component';
import { GridsterModule } from 'angular2gridster';
import { UIModule } from '../ui/ui.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardPage,
    PageTileInstance,
    PageTileHost,
    TileBase,
    TileList,
    TileListTemplate,
    TileChart,
    TileChartSeries
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
    UIModule,
    MomentModule,
    GridsterModule,
    NgxChartsModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class DashboardModule { }
