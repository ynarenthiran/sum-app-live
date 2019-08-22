import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatRippleModule, MatButtonModule } from '@angular/material';
import { PanelComponent, UIDropArea, UIDragEntity } from './ui.component';

@NgModule({
  declarations: [
    PanelComponent,
    UIDropArea,
    UIDragEntity
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
    UIDropArea,
    UIDragEntity
  ]
})
export class UIModule { }
