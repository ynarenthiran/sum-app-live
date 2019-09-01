import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatRippleModule,
  MatGridListModule, MatButtonModule
} from '@angular/material';
import { AngularResizedEventModule } from 'angular-resize-event';
import {
  PanelComponent, UIDropArea, UIDragEntity, FrameComponent,
  UINotifyResize, GridComponent, UIGridItem, FlipComponent, UIFlipFront, UIFlipBack
} from './ui.component';

@NgModule({
  declarations: [
    PanelComponent,
    FrameComponent,
    UIDropArea,
    UIDragEntity,
    UINotifyResize,
    GridComponent,
    UIGridItem,
    FlipComponent,
    UIFlipFront,
    UIFlipBack
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatGridListModule,
    AngularResizedEventModule
  ],
  exports: [
    PanelComponent,
    FrameComponent,
    UIDropArea,
    UIDragEntity,
    UINotifyResize,
    GridComponent,
    UIGridItem,
    FlipComponent,
    UIFlipFront,
    UIFlipBack
  ]
})
export class UIModule { }
