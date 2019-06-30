import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTableModule
} from '@angular/material';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { MainComponent } from './main/main.component';
import { LayoutModule } from '../layout/layout.module';
import { ListComponent } from './list/list.component';
import { ConfigurationService } from './configuration.service';

@NgModule({
  declarations: [MainComponent, ListComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    LayoutModule,
    MatTableModule
  ],
  providers: [
    ConfigurationService
  ]
})
export class ConfigurationModule { }
