import {
  Component, OnInit, Input, OnChanges, Directive, TemplateRef, ContentChild,
  ViewChild, ElementRef, AfterViewChecked, ContentChildren
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/services/app.config';
import { AngularFirestore, CollectionReference, QueryFn } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import {
  TableColumnType, PathObject, DataReader, DataMapper, TableColumn,
  GenericDataReader, ActionColumn
} from '../util/common';
import { ViewHandler } from '../util/handlers';
import { File, CollaborationService } from '../collaboration.service';
import { FlexiblePageSectionAction } from 'src/app/layout/page2.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Directive({
  selector: 'app-comp-ext'
})
export class ComponentExtension {
  parent: ComponentBase;
}

@Component({
  selector: 'app-comp-base',
  templateUrl: './base.html',
  styleUrls: ['./components.scss']
})
export class ComponentBase implements OnInit, OnChanges, AfterViewChecked {
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
  protected queryFunction: QueryFn;

  constructor(private config: AppConfigService, private db: AngularFirestore, private genReader: GenericDataReader,
    protected srv: CollaborationService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initialize();
  }

  ngAfterViewChecked(): void {
  }

  onAction(action: string, element?: any) {
    if (this.handler)
      this.handler.action(action, element);
  }

  protected initialize() {
    this.getRecords();
  }

  protected getRecords() {
    if (this.path) {
      this.records$ = this.genReader.read(this.path, this.collaborationId, this.queryFunction);
    }
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
  @Input()
  rowAction: string;

  private columns: TableColumn[];
  private actionColumns: ActionColumn[];
  private displayedColumns: string[] = [];

  onClick(record: any) {
    if (this.rowAction)
      this.onAction(this.rowAction, record);
  }

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

@Component({
  selector: 'app-comp-doc',
  templateUrl: './document.html',
  styleUrls: ['./components.scss']
})
export class ComponentDocument extends ComponentTable {
  private filePath: any[] = [];
  private parent: any;

  @ViewChild('downloadLink')
  downloadLink: ElementRef;

  @ViewChild('uploadInput')
  uploadInputEl: ElementRef;

  onFileSelected() {
    const uploadedFiles = this.uploadInputEl.nativeElement.files;
    this.uploadFiles(uploadedFiles);
  }

  onFileDropped(event: any) {
    if (event.files) {
      const droppedFiles: any[] = event.files;
      this.uploadFiles(droppedFiles);
    }
  }

  onItemNavigate(index) {
    if (index < 0) {
      this.filePath = [];
      this.openFolder(undefined);
    }
    else {
      const folder = this.filePath[index];
      this.filePath = this.filePath.slice(0, index);
      this.openFolder(folder);
    }
  }

  onOpenDocumentItem(file: any) {
    if (file.isFolder) {
      this.openFolder(file);
    }
    else {
      this.srv.getFileUrl(this.collaborationId, file).subscribe((url) => {
        let link = this.downloadLink.nativeElement;
        link.href = url;
        link.click();
      });
    }
  }

  addFolder() {
    this.onAction('addFolder', {
      path: this.parent ? this.parent.path : "",
      parentId: this.parent ? this.parent.id : "",
      isFolder: true
    });
  }

  private openFolder(file: any) {
    if (file) {
      this.filePath.push(file);
      this.parent = file;
    }
    else {
      this.parent = undefined;
    }
    this.getRecords();
  }

  protected queryFunction = (ref: CollectionReference) => {
    return ref.where('parentId', '==', this.parent ? this.parent.id : "");
  };

  private uploadFiles(files: any[]) {
    let records = [];
    for (var file of files) {
      const filePath = this.parent ? this.parent.path + "/" + file.name : file.name;
      records.push({
        name: file.name,
        description: file.name,
        path: filePath,
        parentId: this.parent ? this.parent.id : "",
        isFolder: false
      });
      this.srv.saveFile(this.collaborationId, file, filePath);
    }
    this.onAction('addFile', records);
  }
}