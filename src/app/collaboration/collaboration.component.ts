import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import {
  FIELDS_POSTS, FIELDS_MEMBERS, FIELDS_DOCUMENTS, DataMapper, DataReader,
  ACTIONS_MEMBERS
} from './util/common';
import { Status, Collaboration, CollaborationService } from './collaboration.service';
import { MatSnackBar } from '@angular/material';
import { ViewHandler, MemberViewHandler, PostViewHandler, DocumentViewHandler } from './util/handlers';
import { FlexibleContainer } from '../layout/page2.component';

interface StatusValue extends Status {
  value: string;
}
interface ActionValue {
  id: string;
  name: string;
}

const TEST_DATA: FlexibleContainer[] = [
  {
    id: 'container1', label: 'Container One', width: 1, height: 1,
    instances: [
      {
        sectionId: 'documents', title: 'Documents', description: 'Documents in the collaboration',
        context: { text: "Manish's Documents" }
      },
    ]
  },
  {
    id: 'container2', label: 'Container One', width: 1, height: 1,
    instances: [
    ]
  }
];

@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.scss']
})
export class CollaborationComponent implements OnInit {
  private containers = TEST_DATA;

  private Fields_Posts: any = FIELDS_POSTS;
  private Fields_Members: any = FIELDS_MEMBERS;
  private Actions_Members: any = ACTIONS_MEMBERS;
  private Fields_Documents: any = FIELDS_DOCUMENTS;

  private subs: Subscription = new Subscription();
  private collaborationId: string;
  private collaboration: Collaboration;
  private statusValues$: Observable<StatusValue[]>;
  private actions: ActionValue[] = [];

  constructor(private route: ActivatedRoute, private auth: AuthService, private srv: CollaborationService,
    private snackBar: MatSnackBar) { }

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
    this.initializeHandlers();
    this.subs.add(
      this.srv.getCollaboration(id,
        (c) => {
          if (!c) {
            this.snackBar.open("Collaboration does not exist", undefined, {
              duration: 5000,
            });
          }
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
    this.actions = Object.keys(this.collaboration.action).map(key => {
      return { id: key, name: this.collaboration.action[key] };
    });
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
  private memberHandler: ViewHandler = new MemberViewHandler(this.srv);
  // Documents
  private documentMapper = new (class DocumentDataMapper extends DataMapper {
    map(input: any) {
      return Object.assign(input, { icon: input.isFolder ? 'folder' : 'description' });
    }
  })();
  private documentHandler: ViewHandler = new DocumentViewHandler(this.srv);
  // Posts
  private postMapper = new (class PostDataMapper extends DataMapper {
    constructor(private auth: AuthService) { super(); }
    map(input: any) {
      return Object.assign(input, { postedBySelf: (input.createdByUid == this.auth.currentUserId) ? true : false });
    }
  })(this.auth);
  private postHandler: ViewHandler = new PostViewHandler(this.srv);

  private initializeHandlers() {
    this.memberHandler.collaborationId = this.collaborationId;
    this.postHandler.collaborationId = this.collaborationId;
    this.documentHandler.collaborationId = this.collaborationId;
  }
}