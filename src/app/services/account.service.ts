import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { AppConfigService } from './app.config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface UserRegistration {
  id: string;
  lastLoggedOn: Date;
}
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private config: AppConfigService, private db: AngularFirestore) { }

  getUserRegistration(uid: string): Observable<boolean> {
    return this.db.doc(`accounts/${this.config.getConfig().accountId}/users/${uid}`)
      .snapshotChanges()
      .pipe(
        map((action) => {
          return action.payload.exists;
        })
      );
  }

  setUserRegistration(uid: string) {
    const obj = {
      lastLoggedOn: new Date()
    }
    return this.db.doc(`accounts/${this.config.getConfig().accountId}/users/${uid}`).set(obj);
  }
}
