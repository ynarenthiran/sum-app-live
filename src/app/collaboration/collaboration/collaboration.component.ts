import { Component, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Collaboration, CollaborationService } from '../collaboration.service';

@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.scss']
})
export class CollaborationComponent implements OnInit {
  private subs: Subscription = new Subscription();
  private collaborationId: string;
  private collaboration: Collaboration;

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

  loadCollaboration(id: string) {
    this.collaborationId = id;
    this.subs.add(
      this.srv.getCollaboration(id,
        (c) => {
          if (!c)
            window.alert("Does not exist");
          this.collaboration = c;
        },
        (e) => {
          window.alert(e);
        })
    );
  }
}
