import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatRippleModule
} from '@angular/material';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { MainComponent } from './main/main.component';
import { LayoutModule } from '../layout/layout.module';
import { ListComponent } from './list/list.component';
import { ConfigurationService } from './configuration.service';
import { FormComponent } from './form/form.component';

@NgModule({
  declarations: [MainComponent, ListComponent, FormComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatRippleModule
  ],
  providers: [
    ConfigurationService
  ]
})
export class ConfigurationModule { }
