import { Component, OnInit, Input, Injectable, ViewChild, Inject } from '@angular/core';
import { ObjectService } from './object.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { JsonPointer } from 'angular6-json-schema-form';

export interface InputOptions {
  title?: string;
  width?: string;
  button: { ok?: string, cancel?: string };
}

interface ObjectType {
  id: string;
  name: string;
  description: string;
  definition: string;
}

@Component({
  selector: 'lib-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {

  @Input()
  set typeId(value: string) {
    if (value != this._typeId) {
      this._typeId = value;
      this.loadObjectType();
    }
  }
  get typeId(): string {
    return this._typeId;
  }
  private _typeId: string;

  private definition$: Observable<any>;

  private options: any = {
    addSubmit: false
  };

  private schema: any = {};
  private layout: any = {};
  private data: any = {};
  private isInitialized: boolean = false;

  private isObjectValid = false;
  private objectErrors = [];

  constructor(private srv: ObjectService) { }

  ngOnInit() {
  }

  private loadObjectType() {
    this.isInitialized = false;
    this.isObjectValid = false;
    this.definition$ = this.srv.getObjectTypeDefinition(this.typeId);
    this.definition$.subscribe((definition) => {
      this.schema = {};
      this.layout = {};
      this.data = {};
      if (definition.schema)
        this.schema = definition.schema;
      if (definition.layout)
        this.layout = definition.layout;
      if (definition.data)
        this.data = definition.data;
      this.isInitialized = true;
    });
  }

  getData(): any {
    return this.data;
  }
  getObjectValid(): boolean {
    return this.isObjectValid;
  }
  getObjectErrors(): string {
    return this.objectErrors.map((error) => {
      const message = error.message;
      const dataPathArray = JsonPointer.parse(error.dataPath);
      if (dataPathArray.length) {
        let field = dataPathArray[0];
        for (let i = 1; i < dataPathArray.length; i++) {
          const key = dataPathArray[i];
          field += /^\d+$/.test(key) ? `[${key}]` : `.${key}`;
        }
        return `${field}: ${message}`;
      } else {
        return message;
      }
    }).join('<br>');
  }

  // Event handlers
  private onChanges(data: any) {
    this.data = data;
  }

  private isValid(isValid: boolean): void {
    this.isObjectValid = isValid;
  }

  private validationErrors(data: any): void {
    this.objectErrors = data;
  }
}

@Component({
  selector: 'lib-object-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class ObjectDialogComponent implements OnInit {
  private options?: InputOptions;

  @ViewChild(ObjectComponent) objectForm: ObjectComponent;

  private typeId: string;

  constructor(
    private dialogRef: MatDialogRef<ObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private snackBar: MatSnackBar) {
    this.options = data.options;
    this.typeId = data.typeId;
  }

  ngOnInit() {
  }

  onOk() {
    if (this.objectForm.getObjectValid()) {
      this.dialogRef.close(this.objectForm.getData());
    }
    else {
      this.snackBar.open(this.objectForm.getObjectErrors(), undefined, { duration: 2000 });
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ObjectDialogService {

  constructor(private dialog: MatDialog) { }

  openObjectDialog(typeId: string, options?: InputOptions): Observable<any> {
    var dialog = this.dialog;
    var width = options.width;
    if (width == null) {
      width = '250px';
    }
    return new Observable<any>((observer) => {
      const dialogRef = dialog.open(ObjectDialogComponent, {
        width: width,
        data: { options: options, typeId: typeId }
      });
      dialogRef.afterClosed().subscribe(output => {
        if (output) {
          observer.next(output);
        }
      });
    });
  }
}