import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import {
  TableColumnType, PathObject, DataReader, DataMapper, TableColumn,
  GenericDataReader,
  ActionColumn,
  ViewHandler
} from '../util/common';

@Component({
  selector: 'app-comp-table',
  templateUrl: './table.html'
})
export class ComponentTable implements OnInit, OnChanges {
  private columnType = TableColumnType;

  @Input()
  collaborationId: string;

  @Input()
  path?: string | PathObject;

  @Input()
  reader?: DataReader;

  @Input()
  mapper?: DataMapper;

  @Input()
  fields: any;

  @Input()
  handler: ViewHandler

  @Input()
  actions: any;

  private columns: TableColumn[];
  private actionColumns: ActionColumn[];
  private mainAction: ActionColumn;
  private displayedColumns: string[] = [];

  private records$: Observable<any[]> = of([]);

  constructor(private config: AppConfigService, private db: AngularFirestore, private genReader: GenericDataReader) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initialize();
  }

  onAction(action: string, element?: any) {
    if (this.handler)
      this.handler.action(action, element);
  }

  private initialize() {
    this.getRecords();
    this.getView();
  }

  private getRecords() {
    if (this.path)
      this.records$ = this.genReader.read(this.path, this.collaborationId);
    else {
      this.records$ = this.reader.read(this.collaborationId)
    }
    if (this.mapper) {
      this.records$ = this.records$.pipe(
        map(records => records.map(record => this.mapper.map(record)))
      );
    }
  }

  private getView() {
    this.columns = [];
    this.displayedColumns = [];
    if (this.fields) {
      Object.keys(this.fields).forEach((key) => {
        var label: string = "";
        var type: TableColumnType = TableColumnType.Default;
        if (typeof this.fields[key] == "string") {
          label = this.fields[key];
        }
        else {
          const spec = this.fields[key];
          if (spec.label)
            label = spec.label;
          if (spec.type)
            type = spec.type;
        }
        this.columns.push({ field: key, label: label, type: type });
        this.displayedColumns.push(key);
      });
    }
    this.actionColumns = [];
    if (this.actions) {
      Object.keys(this.actions).forEach((key) => {
        var main: boolean = false;
        var label: string = "";
        var icon: string = "";
        if (typeof this.actions[key] == "string") {
          label = this.actions[key];
        }
        else {
          const spec = this.actions[key];
          if (spec.label)
            label = spec.label;
          if (spec.icon)
            icon = spec.icon;
          if (spec.main)
            main = spec.main;
        }
        if (main)
          this.mainAction = { action: key, icon: icon };
        else
          this.actionColumns.push({ action: key, label: label, icon: icon });
      });
      if (this.actionColumns.length > 0)
        this.displayedColumns.push("actions");
    }
  }
}