import { Component, OnInit, Injectable, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { FormComponent } from './form.component';

export interface DialogOptions {
  title?: string;
  width?: string;
  button: { ok?: string, cancel?: string };
  labels?: any;
  values?: any;
  suggest?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) { }

  openDialog(input: any, options?: DialogOptions): Observable<any> {
    var dialog = this.dialog;
    var width = options.width;
    if (width == null) {
      width = '250px';
    }
    return new Observable<any>((observer) => {
      const dialogRef = dialog.open(InputDialogComponent, {
        width: width,
        data: { options: options, input: input }
      });
      dialogRef.afterClosed().subscribe(output => {
        if (output) {
          observer.next(output);
        }
      });
    });
  }

  openConfirmationDialog(message: string, options?: DialogOptions): Observable<void> {
    var dialog = this.dialog;
    var width = options.width;
    if (width == null) {
      width = '250px';
    }
    return new Observable<void>((observer) => {
      const dialogRef = dialog.open(ConfirmDialogComponent, {
        width: width,
        data: { options: options, message: message }
      });
      dialogRef.afterClosed().subscribe(output => {
        if (output) {
          observer.next();
        }
      });
    });
  }
}

@Component({
  selector: 'lib-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent implements OnInit {
  private options?: DialogOptions;

  @ViewChild(FormComponent) form: FormComponent;

  private model: any;
  private values: any;
  private suggest: any;
  private labels: any;

  constructor(
    private dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.options = data.options;
    this.model = data.input;
    this.values = this.options.values;
    this.suggest = this.options.suggest;
    this.labels = this.options.labels;
  }

  ngOnInit() {
  }

  onOk() {
    this.dialogRef.close(this.form.getData());
  }
}

@Component({
  selector: 'lib-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {
  private options?: DialogOptions;

  private message: any;

  constructor(
    private dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.options = data.options;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onOk() {
    this.dialogRef.close(true);
  }
}