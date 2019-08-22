import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatRippleModule } from '@angular/material';
import { PanelComponent } from './ui.component';

@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatRippleModule
  ],
  exports: [
    PanelComponent
  ]
})
export class UIModule { }
