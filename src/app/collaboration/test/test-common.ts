import { Observable, of, forkJoin } from 'rxjs';
import { AppConfigService } from 'src/app/services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, mergeAll, mergeMap, combineAll, combineLatest, toArray, flatMap, concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export enum TableColumnType {
  Default = 'Default',
  Icon = 'Icon',
  Chips = 'Chips'
}
export interface TableColumn {
  field: string;
  label: string;
  type?: TableColumnType;
}

export const FIELDS_DOCUMENTS = {
  icon: { type: TableColumnType.Icon },
  name: 'Name',
  description: 'Description',
};

export const FIELDS_POSTS = {
  text: 'Text',
  authorUid: 'Posted By',
  postedOn: 'Posted On',
  postedBySelf: 'My Post',
};

export const FIELDS_MEMBERS = {
  displayName: 'Name',
  email: 'Email',
  roles: { label: 'Roles', type: TableColumnType.Chips },
  tags: { label: 'Tags', type: TableColumnType.Chips },
};

export abstract class DataReader {
  abstract read(id: string): Observable<any[]>;
}

export abstract class DataMapper {
  abstract map(input: any): any;
}

export interface PathObject {
  path: string,
  joinScope?: string, // (''/undefined)collaboration, ('A')ccount, ('R')oot
  join: any // {key: 'path'}
}

@Injectable({
  providedIn: 'root'
})
export class GenericDataReader {
  constructor(private config: AppConfigService, private db: AngularFirestore) { }

  read(path: string | PathObject, id: string): Observable<any[]> {
    if (typeof path == 'string') {
      return this.readDirect(path, id);
    } else {
      return this.readJoin(path, id);
    }
  }

  private readDirect(path: string, id: string): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection(`accounts/${accountId}/collaborations/${id}/${path}`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          let record = Object.assign(data, { id: id });
          return record;
        }))
      );
  }

  private readJoin(path: PathObject, id: string): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    /*return this.db.collection(`accounts/${accountId}/collaborations/${id}/${path.path}`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = Object.assign(a.payload.doc.data(), { id: a.payload.doc.id });
          const key = Object.keys(path.join)[0];
          const keyPath = path.join[key];
          return { data: data, key: key, keyPath: keyPath, scope: path.joinScope };
        })),
        mergeAll(),
        mergeMap((data) => {
          let path: string = `accounts/${accountId}/collaborations/${id}/${data.keyPath}`;
          if (data.scope) {
            switch (data.scope) {
              case 'R': path = `${data.keyPath}`; break;
              case 'A': path = `accounts/${accountId}/${data.keyPath}`; break;
            }
          }
          return this.db.doc(`${path}/${data.data.id}`)
            .snapshotChanges()
            .pipe(
              map(action => {
                const innerData = Object.assign(action.payload.data(), { id: action.payload.id });
                data.data[data.key] = innerData;
                return data.data;
              }),
            );
        })
      );*/
    return null;
  }
}