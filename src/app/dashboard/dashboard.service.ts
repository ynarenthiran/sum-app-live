import { Injectable } from '@angular/core';
import { Observable, combineLatest, observable } from 'rxjs';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { map, flatMap, tap, share, mergeMap, concatAll, shareReplay } from 'rxjs/operators';
import _ from "lodash";

export const ENTITYPATHS = {
  MEMBER: "/members",
  DOCUMENT: "/documents",
  POST: "/posts"
}
export interface TileDataSet {
  entityPath: string;
  joinBy: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private config: AppConfigService, private db: AngularFirestore, private auth: AuthService) { }

  read(dataSet: TileDataSet): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    if (dataSet.joinBy) {
      let records$ = this.readSingle(dataSet.entityPath);
      Object.keys(dataSet.joinBy).forEach((key) => {
        records$ = records$.pipe(
          map((records: any[]) => {
            return records.map((record) => {
              return this.db.doc(`${dataSet.joinBy[key]}/${record[key]}`)
                .snapshotChanges()
                .pipe(
                  map(a => {
                    const data = a.payload.data();
                    record[key] = { id: a.payload.id, ...data };
                    return record;
                  })
                );
            });
          }),
          flatMap(records => combineLatest(records)),
          //share(),
        );
      });
      return records$;
    }
    else {
      return this.readSingle(dataSet.entityPath);
    }
  }

  private readSingle(entityPath: string): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    return this.db.collection(`accounts/${accountId}/users/${userId}/collaborations`)
      .snapshotChanges()
      .pipe(
        map(actionsColl => actionsColl.map(aColl => {
          const collaborationId = aColl.payload.doc.id;
          return this.db.collection(`accounts/${accountId}/collaborations/${collaborationId}${entityPath}`)
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
    return this.read(dataSet)
      .pipe(
        map((records) => _.chain(records).groupBy(groupBy).map((arr: any[], key) => {
          return { name: key, value: arr.length/*reduce((cum, cur) => cum + cur)*/ };
        }).value()),
      );
  }
}