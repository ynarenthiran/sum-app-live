import { Component, OnInit } from '@angular/core';
import { Subscription, of, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Collaboration, CollaborationService, Status } from '../collaboration.service';

interface StatusValue extends Status {
  value: string;
}

interface ActionValue {
  id: string;
  name: string;
}

@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.scss']
})
export class CollaborationComponent implements OnInit {
  private subs: Subscription = new Subscription();
  private collaborationId: string;
  private collaboration: Collaboration;
  private statusValues$: Observable<StatusValue[]>;
  private actions: ActionValue[] = [];

  constructor(private route: ActivatedRoute, private srv: CollaborationService) { }

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
    this.actions = Object.keys(this.collaboration.action).map(key => { return { id: this.collaboration.action[key], name: key }; });
  }
}
