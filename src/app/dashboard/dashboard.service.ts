import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { map, flatMap, tap, share, mergeMap } from 'rxjs/operators';

export const ENTITYPATHS = {
  MEMBER: "/members",
  DOCUMENT: "/documents",
  POST: "/posts"
}
export interface TileDataSet {
  entityPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private config: AppConfigService, private db: AngularFirestore, private auth: AuthService) { }

  read(dataSet: TileDataSet): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    return this.db.collection(`accounts/${accountId}/users/${userId}/collaborations`)
      .snapshotChanges()
      .pipe(
        map(actionsColl => actionsColl.map(aColl => {
          const collaborationId = aColl.payload.doc.id;
          return this.db.collection(`accounts/${accountId}/collaborations/${collaborationId}${dataSet.entityPath}`)
            .snapshotChanges()
            .pipe(
              map(actionsPos => actionsPos.map(aPos => {
                const dataPos: any = aPos.payload.doc.data();
                const objPos: any = Object.assign(dataPos, { id: aPos.payload.doc.id });
                return Object.assign(objPos, { collaborationId: collaborationId });
              }))
            );
        })),
        flatMap(records => combineLatest(records).pipe(
          map(aRecord => aRecord.reduce((arr, cur, ind) => arr.concat(cur)))
        )),
        //share()
      );
  }

  readSummary(dataSet: TileDataSet, groupBy: string): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    return this.db.collection(`accounts/${accountId}/users/${userId}/collaborations`)
      .snapshotChanges()
      .pipe(
        map(actionsColl => actionsColl.map(aColl => {
          const collaborationId = aColl.payload.doc.id;
          return this.db.collection(`accounts/${accountId}/collaborations/${collaborationId}${dataSet.entityPath}`)
            .snapshotChanges()
            .pipe(
              map(actionsPos => actionsPos.map(aPos => {
                const dataPos: any = aPos.payload.doc.data();
                const objPos: any = Object.assign(dataPos, { id: aPos.payload.doc.id });
                return Object.assign(objPos, { collaborationId: collaborationId });
              }))
            );
        })),
        flatMap(records => combineLatest(records).pipe(
          map(aRecord => aRecord.reduce((arr, cur, ind) => arr.concat(cur)))
        )),
        map((records) => records.map((record) => {
          return { name: record[groupBy], value: 1 };
        })),
        tap((records) => console.log(records))
      );
  }
}
