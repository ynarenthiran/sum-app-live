import { Injectable, EventEmitter } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route, RunGuardsAndResolvers } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  nodes:Route[] = [];

  nodeSelected:EventEmitter<Route> = new EventEmitter<Route>();

  path: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(private db: AngularFirestore, private config: AppConfigService) { }

  getRecords(): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection(`accounts/${accountId}/${this.path.value}`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const record = a.payload.doc.data();
          const id = a.payload.doc.id;
          return Object.assign(record, { id: id });
        }))
      );
  }

  getRecord(): Observable<any> {
    const accountId = this.config.getConfig().accountId;
    return this.db.doc(`accounts/${accountId}/${this.path.value}`)
      .snapshotChanges()
      .pipe(
        map(a => {
          const record = a.payload.data();
          const id = a.payload.id;
          return Object.assign(record, { id: id });
        })
      );
  }

  setRecord(data: any) {
    const accountId = this.config.getConfig().accountId;
    return this.db.doc(`accounts/${accountId}/${this.path.value}`).set(this.getDataFromRecord(data));
  }

  private getDataFromRecord(data: any): any {
    var dataObj = {};
    Object.keys(data).forEach(key => {
      if (key != 'id')
        dataObj[key] = data[key];
    });
    return dataObj;
  }
}