import { Injectable } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface ObjectType {
  id: string;
  name: string;
  description: string;
  objectTypeId: string;
}
export interface CollaborationType extends ObjectType { }
export class ObjectTypeClass {
  id: string;
  name: string;
  description: string;
  constructor(type: ObjectType) {
    this.id = type.id;
    this.name = type.name;
    this.description = type.description;
  }
  toString(): string {
    return this.name;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor(private db: AngularFirestore, private config: AppConfigService, private func: AngularFireFunctions) { }

  getObjectTypeDefinition(id: string): Observable<any> {
    const callable = this.func.httpsCallable('getObjectTypeDefinition');
    const accountId = this.config.getConfig().accountId;
    return callable({ accountId: accountId, objectTypeId: id });
  }

  getObjectTypes(typePath: string): Observable<ObjectType[]> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection<ObjectType>(`accounts/${accountId}/${typePath}`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const type = a.payload.doc.data() as ObjectType;
          const id = a.payload.doc.id;
          return Object.assign(type, { id: id }) as ObjectType;
        }))
      );
  }

  getObjectType(typePath: string, typeId: string): Observable<ObjectType> {
    const accountId = this.config.getConfig().accountId;
    return this.db.doc<ObjectType>(`accounts/${accountId}/${typePath}/${typeId}`)
      .snapshotChanges()
      .pipe(
        map(a => {
          const type = a.payload.data() as ObjectType;
          const id = a.payload.id;
          return Object.assign(type, { id: id }) as ObjectType;
        })
      );
  }
}