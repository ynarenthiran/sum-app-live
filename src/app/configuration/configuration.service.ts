import { Injectable, EventEmitter } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageNode } from '../layout/page.component';

interface ConfigState {
  node: PageNode;
  id?: any;
  title: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  detailClicked: EventEmitter<any> = new EventEmitter<any>();

  path: ConfigState[] = [];

  constructor(private db: AngularFirestore, private config: AppConfigService) { }

  getRecords(path: string): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection(`accounts/${accountId}/${path}`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const record = a.payload.doc.data();
          const id = a.payload.doc.id;
          return Object.assign(record, { id: id });
        }))
      );
  }

  getRecord(path: string): Observable<any> {
    const accountId = this.config.getConfig().accountId;
    return this.db.doc(`accounts/${accountId}/${path}`)
      .snapshotChanges()
      .pipe(
        map(a => {
          const record = a.payload.data();
          const id = a.payload.id;
          return Object.assign(record, { id: id });
        })
      );
  }

  addState(node: PageNode, id?: any, title?: any) {
    let state: ConfigState = { node: node, title: node.title };
    if (id)
      state.id = id;
    if (title)
      state.title = title;
    this.path.push(state);
  }
  getState(): ConfigState {
    return this.path[this.path.length - 1];
  }
  setState(index: number) {
    this.path = this.path.slice(0, index + 1);
  }
}