import { Component, OnInit, Input, DoCheck, OnChanges, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CollaborationService } from '../collaboration.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { FIELDS_POSTS, FIELDS_MEMBERS, FIELDS_DOCUMENTS, DataReader, DataMapper, TableColumn, PathObject, GenericDataReader } from './test-common';
import { ConfigurationService } from 'src/app/configuration/configuration.service';

@Component({
  selector: 'app-collaboration-table',
  templateUrl: './test-table.html'
})
export class ComponentTableComponent implements OnInit, OnChanges {
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
      this.columns.push({ field: key, label: this.fields[key] });
      this.displayedColumns.push(key);
    });
  }
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

  private collaborationId: string;

  constructor(private route: ActivatedRoute, private auth: AuthService, private srv: CollaborationService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((v, i) => of(v.get('id')))
    ).subscribe((id) => {
      this.collaborationId = id;
    });
  }

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

  private documentMapper = new (class DocumentDataMapper extends DataMapper {
    map(input: any) {
      return Object.assign(input, { icon: input.isFolder ? 'folder' : 'description' });
    }
  })();

  private postMapper = new (class PostDataMapper extends DataMapper {
    constructor(private auth: AuthService) { super(); }
    map(input: any) {
      return Object.assign(input, { postedBySelf: (input.authorUid == this.auth.currentUserId) ? true : false });
    }
  })(this.auth);
}