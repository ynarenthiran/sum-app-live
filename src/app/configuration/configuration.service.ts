import { Injectable } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

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
}