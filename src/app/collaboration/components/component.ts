import { Component, OnInit, Input, OnChanges, Directive, TemplateRef, ContentChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import {
  TableColumnType, PathObject, DataReader, DataMapper, TableColumn,
  GenericDataReader, ActionColumn
} from '../util/common';
import { ViewHandler } from '../util/handlers';

@Component({
  selector: 'app-comp-base'
})
class ComponentBase implements OnInit, OnChanges {
  @Input()
  collaborationId: string;
  @Input()
  context: any;
  @Input()
  fabIcon: string;

  @Input()
  path?: string | PathObject;

  @Input()
  reader?: DataReader;

  @Input()
  mapper?: DataMapper;

  @Input()
  handler: ViewHandler

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

  protected initialize() {
    this.getRecords();
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
}

@Component({
  selector: 'app-comp-table',
  templateUrl: './table.html',
  styleUrls: ['./components.scss']
})
export class ComponentTable extends ComponentBase {
  private columnType = TableColumnType;

  @Input()
  fields: any;

  @Input()
  actions: any;

  private columns: TableColumn[];
  private actionColumns: ActionColumn[];
  private displayedColumns: string[] = [];

  protected initialize() {
    super.initialize();
    this.getView();
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
        }
        this.actionColumns.push({ action: key, label: label, icon: icon });
      });
      if (this.actionColumns.length > 0)
        this.displayedColumns.push("actions");
    }
  }
}

@Directive({
  selector: '[appComponentListTemplate]'
})
export class ComponentListTemplate {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
@Component({
  selector: 'app-comp-list',
  templateUrl: './list.html',
  styleUrls: ['./components.scss']
})
export class ComponentList extends ComponentBase {
  @ContentChild(ComponentListTemplate)
  template: ComponentListTemplate;
}
