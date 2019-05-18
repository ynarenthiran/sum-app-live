import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { interval, Observable, config, combineLatest, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/auth.service';
import { AppConfigService } from 'src/app/services/app.config';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  collaborations$: Observable<any[]>;
  current: Observable<Date>;
  greetings: string;
  accountId: string;

  constructor(private auth: AuthService, private config: AppConfigService, private db: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.accountId = this.config.getConfig().accountId;
    this.current = interval(1000).pipe(
      map(() => new Date())
    );
    this.updateGreetings();
    interval(10000).subscribe(() => this.updateGreetings());
    this.collaborations$ = this.getCollaborations();
  }

  updateGreetings() {
    const currentHour = moment().hour();
    if (currentHour >= 12 && currentHour <= 17) this.greetings = "Good Afternoon";
    else if (currentHour <= 18) this.greetings = "Good Evening";
    else this.greetings = "Good Morning";
  }

  getCollaborations(): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    return this.db.collection(`accounts/${accountId}/users/${userId}/collaborations`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const rec = a.payload.doc.data();
          const id = a.payload.doc.id;
          return this.db.doc(`accounts/${accountId}/collaborations/${id}`)
            .snapshotChanges()
            .pipe(
              map(action => {
                const coll = action.payload.data();
                return Object.assign(rec, { id: action.payload.id, ...coll });
              })
            );
        })),
        flatMap(collaborations => combineLatest(collaborations))
      );
  }

  createCollaboration() {
    //this.router.navigate(['collaboration', 'create']);
    this.openInNewTab(['collaboration', 'create']);
  }

  openCollaboration(id: string) {
    this.openInNewTab(['collaboration', id]);
  }

  openInNewTab(cmds: any[]) {
    let url: string = '';
    cmds.forEach((cmd) => {
      url += '/' + cmd;
    });
    window.open(url, "_blank");
  }
}