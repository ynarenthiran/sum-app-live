import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatRippleModule, MatButtonModule } from '@angular/material';
import { PanelComponent, UIDropArea, UIDragEntity, FrameComponent } from './ui.component';

@NgModule({
  declarations: [
    PanelComponent,
    FrameComponent,
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
    FrameComponent,
    UIDropArea,
    UIDragEntity
  ]
})
export class UIModule { }
