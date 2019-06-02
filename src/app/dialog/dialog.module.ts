import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatSelectModule,
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule
} from '@angular/material';

import { FormComponent } from './form.component';
import { InputDialogComponent, ConfirmDialogComponent, DialogService } from './dialog.component';

@NgModule({
  declarations: [
    FormComponent,
    InputDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  exports: [
    FormComponent
  ],
  entryComponents: [
    InputDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [
    DialogService
  ]
})
export class DialogModule { }
