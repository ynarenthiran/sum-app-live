import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatIconModule, MatRippleModule, MatButtonModule } from '@angular/material';
import { AngularResizedEventModule } from 'angular-resize-event';
import { PanelComponent, UIDropArea, UIDragEntity, FrameComponent, UINotifyResize } from './ui.component';

@NgModule({
  declarations: [
    PanelComponent,
    FrameComponent,
    UIDropArea,
    UIDragEntity,
    UINotifyResize
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    AngularResizedEventModule
  ],
  exports: [
    PanelComponent,
    FrameComponent,
    UIDropArea,
    UIDragEntity,
    UINotifyResize
  ]
})
export class UIModule { }
