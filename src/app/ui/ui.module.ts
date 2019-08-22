import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatRippleModule, MatButtonModule } from '@angular/material';
import { PanelComponent, UIDropArea } from './ui.component';

@NgModule({
  declarations: [
    PanelComponent,
    UIDropArea,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule
  ],
  exports: [
    PanelComponent,
    UIDropArea
  ]
})
export class UIModule { }
