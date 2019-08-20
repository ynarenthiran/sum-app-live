import { Component, OnInit, Input, DoCheck, OnChanges, Output } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CollaborationService, Status, Collaboration } from '../collaboration.service';
import { AuthService } from 'src/app/authentication/auth.service';
import {
  FIELDS_POSTS, FIELDS_MEMBERS, FIELDS_DOCUMENTS, DataReader, DataMapper,
  TableColumn, PathObject, GenericDataReader, TableColumnType
} from './test-common';

@Component({
  selector: 'app-collaboration-table',
  templateUrl: './test-table.html'
})
export class ComponentTableComponent implements OnInit, OnChanges {
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

  private columns: TableColumn[]
  private displayedColumns: string[] = [];

  private records$: Observable<any[]> = of([]);

  constructor(private config: AppConfigService, private db: AngularFirestore, private genReader: GenericDataReader) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initialize();
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
}

interface StatusValue extends Status {
  value: string;
}
interface ActionValue {
  id: string;
  name: string;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  private Fields_Posts: any = FIELDS_POSTS;
  private Fields_Members: any = FIELDS_MEMBERS;
  private Fields_Documents: any = FIELDS_DOCUMENTS;

  private subs: Subscription = new Subscription();
  private collaborationId: string;
  private collaboration: Collaboration;
  private statusValues$: Observable<StatusValue[]>;
  private actions: ActionValue[] = [];

  constructor(private route: ActivatedRoute, private auth: AuthService, private srv: CollaborationService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((v, i) => of(v.get('id')))
    ).subscribe((id) => {
      this.loadCollaboration(id);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  completeAction(action: ActionValue) {
    this.srv.triggerAction(this.collaborationId, action.id);
  }

  private loadCollaboration(id: string) {
    this.collaborationId = id;
    this.subs.add(
      this.srv.getCollaboration(id,
        (c) => {
          if (!c)
            window.alert("Does not exist");
          this.collaboration = c;
          this.loadStatus(this.collaboration.typeId);
          this.loadAction();
        },
        (e) => {
          window.alert(e);
        })
    );
  }

  private loadStatus(typeId: string) {
    this.statusValues$ = this.srv.getStatuses(typeId).pipe(
      map(statuses => statuses.map(status => {
        var value = "";
        if (this.collaboration.status && this.collaboration.status[status.name]) {
          value = this.collaboration.status[status.name]
        }
        return Object.assign(status, { value: value });
      }))
    );
  }

  private loadAction() {
    this.actions = Object.keys(this.collaboration.action).map(key => { return { id: key, name: this.collaboration.action[key] }; });
  }

  // Members
  private memberMapper = new (class MemberDataMapper extends DataMapper {
    map(input: any) {
      return Object.assign(input, input.user);
    }
  })();
  private memberReader = new (class MemberDataReader extends DataReader {
    constructor(private srv: CollaborationService) { super(); }
    read(id: string): Observable<any[]> {
      return this.srv.getMembers(id);
    }
  })(this.srv);
  // Documents
  private documentMapper = new (class DocumentDataMapper extends DataMapper {
    map(input: any) {
      return Object.assign(input, { icon: input.isFolder ? 'folder' : 'description' });
    }
  })();
  // Posts
  private postMapper = new (class PostDataMapper extends DataMapper {
    constructor(private auth: AuthService) { super(); }
    map(input: any) {
      return Object.assign(input, { postedBySelf: (input.authorUid == this.auth.currentUserId) ? true : false });
    }
  })(this.auth);
}