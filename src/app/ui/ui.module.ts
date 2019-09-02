import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatToolbarModule, MatIconModule, MatRippleModule,
  MatGridListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule
} from '@angular/material';
import { AngularResizedEventModule } from 'angular-resize-event';
import {
  PanelComponent, UIDropArea, UIDragEntity, FrameComponent,
  UINotifyResize, GridComponent, UIGridItem, FlipComponent, UIFlipFront, UIFlipBack, FormAdvancedComponent
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
    UIFlipBack,
    FormAdvancedComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
    UIFlipBack,
    FormAdvancedComponent
  ]
})
export class UIModule { }
