import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDesignFrameworkModule } from 'angular6-json-schema-form';
import {
  MatDialogModule,
  MatButtonModule,
  MatSnackBarModule
} from '@angular/material';

import { ObjectComponent, ObjectDialogComponent, ObjectDialogService } from './object.component';
import { ObjectService } from './object.service';

@NgModule({
  declarations: [
    ObjectComponent,
    ObjectDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MaterialDesignFrameworkModule
  ],
  exports: [
    ObjectComponent
  ],
  entryComponents: [
    ObjectDialogComponent
  ],
  providers: [
    ObjectDialogService,
    ObjectService
  ]
})
export class ObjectModule { }
