import { Injectable } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';

export interface Collaboration {
  id: string;
  name: string;
  description: string;
  createByUid: string;
  createdOn: Date;
}
export interface Member {
  id: string;
  validFrom: Date;
  validTo: Date;
  user: User;
  roles: string[];
}
export interface User {
  id: string;
  displayName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  constructor(private db: AngularFirestore, private config: AppConfigService, private auth: AuthService) { }

  toDateString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  getCollaboration(id: string, onValue: (value: Collaboration) => void, onError: (error: any) => void): Subscription {
    return this.db.doc<Collaboration>(`accounts/${this.config.getConfig().accountId}/collaborations/${id}`)
      .snapshotChanges()
      .subscribe(
        (v) => {
          if (v.payload.exists) {
            const col = v.payload.data() as Collaboration;
            onValue(Object.assign(col, { id: v.payload.id }));
          }
          else {
            onValue(null);
          }
        },
        (e) => {
          onError(e);
        });
  }

  postCollaboration(collaboration: Collaboration, onSuccess: (id: string) => void, onError: (error: any) => void) {
    const obj = {
      name: collaboration.name,
      description: collaboration.description,
      createdOn: new Date(),
      createByUid: this.auth.currentUserId
    };
    return this.db.collection(`accounts/${this.config.getConfig().accountId}/collaborations`)
      .add(obj)
      .then((d) => {
        onSuccess(d.id);
      })
      .catch((e) => {
        onError(e);
      });
  }

  getMembers(id: string): Observable<Member[]> {
    return this.db.collection<Member>(`accounts/${this.config.getConfig().accountId}/collaborations/${id}/members`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const member = a.payload.doc.data() as Member;
          const id = a.payload.doc.id;
          return this.db.doc<User>(`users/${a.payload.doc.id}`)
            .snapshotChanges()
            .pipe(
              map(action => {
                const user = action.payload.data() as User;
                return Object.assign(member, { id: action.payload.id, user: user }) as Member;
              })
            );
        })),
        flatMap(members => combineLatest(members))
      );
  }

  postMember(id: string, member: Member) {
    const obj = {
      validFrom: this.toDateString(member.validFrom),
      validTo: this.toDateString(member.validTo),
      roles: member.roles
    }
    return this.db.doc(`accounts/${this.config.getConfig().accountId}/collaborations/${id}/members/${member.id}`)
      .set(obj);
  }
}
