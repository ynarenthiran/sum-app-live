import { Injectable } from '@angular/core';
import { Observable, combineLatest, observable, of } from 'rxjs';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { map, flatMap, tap, share, mergeMap, concatAll, shareReplay } from 'rxjs/operators';
import _ from "lodash";
import * as moment from 'moment';

export const ENTITYPATHS = {
  MEMBER: "/members",
  DOCUMENT: "/documents",
  POST: "/posts"
}
export interface TileDataSet {
  entityPath: string;
  joinBy?: any;
}
export interface ObjectType {
  id: string;
  name: string;
  description: string;
}
export interface Status {
  id: string;
  name: string;
  description: string;
}
export interface ComponentDescr {
  path: string;
  filter: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private config: AppConfigService, private db: AngularFirestore, private auth: AuthService) { }

  read(dataSet: TileDataSet, filter?: any): Observable<any[]> {
    if (dataSet.joinBy) {
      let records$ = this.readSingle(dataSet.entityPath, filter);
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
      return this.readSingle(dataSet.entityPath, filter);
    }
  }

  private readSingle(entityPath: string, filter?: any): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    if (entityPath == "") {
      return this.db.collection(`accounts/${accountId}/users/${userId}/collaborations`)
        .snapshotChanges()
        .pipe(
          map(actionsColl => actionsColl.map(aColl => {
            const collaborationId = aColl.payload.doc.id;
            return this.db.doc(`accounts/${accountId}/collaborations/${collaborationId}`)
              .snapshotChanges()
              .pipe(
                map(aPos => {
                  const dataPos: any = aPos.payload.data();
                  const objPos: any = Object.assign(dataPos, { id: aPos.payload.id });
                  return Object.assign(objPos, { collaborationId: collaborationId });
                })
              );
          })),
          flatMap(records => combineLatest(records)),
          map((records) => {
            return (filter) ?
              records.filter((record) => {
                Object.keys(filter).forEach((key) => {
                  if (!record[key])
                    return false;
                  if (record[key] != filter[key])
                    return false;
                });
                return true;
              })
              : records;
          }),
          //shareReplay(1)
        );
    }
    else {
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
  }

  readSummary(dataSet: TileDataSet, groupBy: string, filter?: any): Observable<any[]> {
    return this.read(dataSet, filter)
      .pipe(
        map((records) => _.chain(records).groupBy(groupBy).map((arr: any[], key) => {
          return { name: key, value: arr.length/*reduce((cum, cur) => cum + cur)*/ };
        }).value()),
      );
  }

  readSummaryWithComponents(dataSet: TileDataSet, groupBy: string, components: ComponentDescr[], filter?: any): Observable<any[]> {
    return this.read(dataSet, filter)
      .pipe(
        map((records) => {
          return records.map((record) => {
            return components.map((component) => {
              let filter = _.clone(component.filter);
              Object.keys(filter).forEach((key) => {
                const idValue = _.get(record, filter[key])
                filter[key] = idValue;
              });
              return this.read({ entityPath: component.path }, filter)
            });
          });
        }),
        tap((records) => console.log(records))
      );
  }

  readTrends(dataSet: TileDataSet, unit: string, startOffset: number, endOffset: number, filter?: any): Observable<any> {
    return this.read(dataSet, filter)
      .pipe(
        tap((records) => console.log(records))
      )
    /*.pipe(
      map((records) => {
        const startMoment = this.getOffsetMoment(startOffset, unit);
        const prevMoment = this.getOffsetMoment(endOffset, unit, startMoment);
        const endMoment = this.getOffsetMoment(endOffset, unit, prevMoment);
        return { total: 10, increased: true, percent: 50, trends: [1, 1, 1, 1, 1] };
      })
    );*/
  }

  getObjectType(objTypePath: string, typeName: string): Observable<ObjectType> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection<ObjectType>(`accounts/${accountId}/${objTypePath}`)
      .snapshotChanges()
      .pipe(
        map(actionsType => {
          const type = actionsType.find((item) => {
            var aType = item.payload.doc.data();
            return aType.name == typeName;
          })
          const data = type.payload.doc.data();
          const typeId = type.payload.doc.id;
          return { id: typeId, ...data };
        }),
      );
  }

  getStatuses(typeId: string): Observable<Status[]> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection<Status>(`accounts/${accountId}/collaborationTypes/${typeId}/statuses`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const status = a.payload.doc.data() as Status;
          const id = a.payload.doc.id;
          return Object.assign(status, { id: id }) as Status;
        }))
      );
  }

  private getOffsetMoment(startOffset: number, unit: string, fromMoment?: moment.Moment) {
    const startMoment = (fromMoment) ? fromMoment.clone() : moment();
    var duration = {};
    duration[unit] = startOffset;
    return startMoment.subtract(duration);
  }

  private getMoment(date: any) {
    return moment(date.toDate());
  }
}