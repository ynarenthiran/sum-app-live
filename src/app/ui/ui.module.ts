import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatToolbarModule, MatIconModule, MatRippleModule,
  MatGridListModule, MatButtonModule, MatFormFieldModule, MatInputModule,
  MatSelectModule
} from '@angular/material';
import { AngularDraggableModule } from 'angular2-draggable';
import {
  PanelComponent, UIDropArea, UIDragEntity, FrameComponent,
  UINotifyResize, GridComponent, UIGridItem, FlipComponent, UIFlipFront,
  UIFlipBack, FormAdvancedComponent, ResizableComponent, FrameToolbar
} from './ui.component';

@NgModule({
  declarations: [
    PanelComponent,
    FrameComponent,
    FrameToolbar,
    UIDropArea,
    UIDragEntity,
    UINotifyResize,
    GridComponent,
    UIGridItem,
    FlipComponent,
    UIFlipFront,
    UIFlipBack,
    FormAdvancedComponent,
    ResizableComponent
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
    AngularDraggableModule
  ],
  exports: [
    PanelComponent,
    FrameComponent,
    FrameToolbar,
    UIDropArea,
    UIDragEntity,
    UINotifyResize,
    GridComponent,
    UIGridItem,
    FlipComponent,
    UIFlipFront,
    UIFlipBack,
    FormAdvancedComponent,
    ResizableComponent
  ]
})
export class UIModule { }
