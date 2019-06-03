import { Injectable } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { map, flatMap, concatAll, distinct } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';

export interface Collaboration {
  id: string;
  name: string;
  description: string;
  createdByUid: string;
  createdOn: Date;
}
export interface Member {
  id: string;
  user: User;
  roles: string[];
  tags: string[];
}
export interface User {
  id: string;
  displayName: string;
  email: string;
}
export interface File {
  id: string;
  name: string;
  description: string;
  path: string;
  createdByUid: string;
  createdOn: Date;
  changedByUid: string;
  changedOn: Date;
  parentId: string;
  isFolder: boolean;
  tags: string[];
}
export interface FileExt extends File {
  createdBy: User;
  changedBy: User;
}

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  constructor(private db: AngularFirestore, private storage: AngularFireStorage, private config: AppConfigService, private auth: AuthService) { }

  getUsers(): Observable<User[]> {
    return this.db.collection<User>(`users`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const user = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return Object.assign(user, { id: id }) as User;
        }))
      );
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
      createdByUid: this.auth.currentUserId,
      createdOn: new Date()
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

  getCurrentMember(id: string): Observable<Member> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    return this.db.doc<Member>(`accounts/${accountId}/collaborations/${id}/members/${userId}`)
      .snapshotChanges()
      .pipe(
        map(action => {
          const member = action.payload.data() as Member;
          return Object.assign(member, { id: action.payload.id }) as Member;
        })
      );
  }

  postMember(id: string, member: Member) {
    const obj = {
      roles: member.roles,
      tags: member.tags
    }
    return this.db.doc(`accounts/${this.config.getConfig().accountId}/collaborations/${id}/members/${member.id}`)
      .set(obj);
  }

  deleteMember(id: string, memberId: string) {
    return this.db.doc(`accounts/${this.config.getConfig().accountId}/collaborations/${id}/members/${memberId}`)
      .delete();
  }

  getFiles(id: string, parent: string): Observable<File[]> {
    return this.db.collection<File>(`accounts/${this.config.getConfig().accountId}/collaborations/${id}/documents`,
      ref => ref.where('parentId', '==', parent))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const file = a.payload.doc.data() as File;
          const id = a.payload.doc.id;
          return Object.assign(file, { id: id }) as File;
        }))
      );
  }

  getFilesByTags(id: string, tags: string[], parent: string): Observable<File[]> {
    const accountId = this.config.getConfig().accountId;
    let aObservables: Observable<string[]>[] = [];
    tags.forEach(tag => {
      aObservables.push(
        this.db.collection(`accounts/${accountId}/collaborations/${id}/documentTags`,
          ref => ref.where('tag', '==', tag))
          .snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const obj: any = a.payload.doc.data();
              const fileId: string = obj.documentId;
              return fileId;
            }))
          ));
    });
    return combineLatest(aObservables)
      .pipe(
        map(arr => arr.reduce((acc, arr) => acc.concat(arr))),
        distinct(fileIds => fileIds),
        map(fileIds => fileIds.map(fileId => this.db.doc<File>(`accounts/${accountId}/collaborations/${id}/documents/${fileId}`)
          .snapshotChanges()
          .pipe(
            map(action => {
              const file = action.payload.data() as File;
              return Object.assign(file, { id: action.payload.id }) as File;
            })
          ))),
        flatMap(files => combineLatest(files))
      );
  }

  getFilesExt(id: string): Observable<FileExt[]> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection<FileExt>(`accounts/${accountId}/collaborations/${id}/documents`)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const file = a.payload.doc.data() as File;
            const id = a.payload.doc.id;
            const createdBy = this.db.doc<User>(`users/${file.createdByUid}`)
              .snapshotChanges()
              .pipe(
                map(action => action.payload.data() as User)
              );
            const changedBy = this.db.doc<User>(`users/${file.changedByUid}`)
              .snapshotChanges()
              .pipe(
                map(action => action.payload.data() as User)
              );
            return combineLatest(createdBy, changedBy).pipe(
              map(values => Object.assign(file, { createdBy: values[0], changedBy: values[1] }))
            );
          })),
        flatMap(files => combineLatest(files))
      );
  }

  getFileExt(id: string, fileId: string): Observable<FileExt> {
    const accountId = this.config.getConfig().accountId;
    return this.db.doc<FileExt>(`accounts/${accountId}/collaborations/${id}/documents/${fileId}`)
      .snapshotChanges()
      .pipe(
        map(a => {
          const file = a.payload.data() as File;
          const id = a.payload.id;
          const createdBy = this.db.doc<User>(`users/${file.createdByUid}`)
            .snapshotChanges()
            .pipe(
              map(action => action.payload.data() as User)
            );
          const changedBy = this.db.doc<User>(`users/${file.changedByUid}`)
            .snapshotChanges()
            .pipe(
              map(action => action.payload.data() as User)
            );
          return combineLatest(createdBy, changedBy).pipe(
            map(values => Object.assign(file, { id: id, createdBy: values[0], changedBy: values[1] }))
          );
        }),
        concatAll()
      );
  }

  postFolder(id: string, file: File) {
    const accountId = this.config.getConfig().accountId;
    const obj = {
      name: file.name,
      description: file.description,
      path: file == null ? file.name : file.path + "/" + file.name,
      createdByUid: this.auth.currentUserId,
      createdOn: new Date(),
      changedByUid: this.auth.currentUserId,
      changedOn: new Date(),
      parentId: file.parentId,
      isFolder: true,
      tags: []
    }
    return this.db.collection(`accounts/${accountId}/collaborations/${id}/documents`)
      .add(obj);
  }

  postFiles(id: string, folder: File, files: any[]) {
    const accountId = this.config.getConfig().accountId;
    for (var file of files) {
      const filePath = folder == null ? file.name : folder.path + "/" + file.name;
      const path = `accounts/${accountId}/collaborations/${id}/documents/${filePath}`;
      this.storage.upload(path, file);
      const obj = {
        name: file.name,
        description: file.name,
        path: filePath,
        createdByUid: this.auth.currentUserId,
        createdOn: new Date(),
        changedByUid: this.auth.currentUserId,
        changedOn: new Date(),
        parentId: folder == null ? "" : folder.id,
        isFolder: false,
        tags: []
      };
      this.db.collection(`accounts/${accountId}/collaborations/${id}/documents`).add(obj);
    }
  }

  updateFileTags(id: string, file: File) {
    const accountId = this.config.getConfig().accountId;
    const obj = {
      changedByUid: this.auth.currentUserId,
      changedOn: new Date(),
      tags: file.tags
    };
    this.db.doc(`accounts/${accountId}/collaborations/${id}/documents/${file.id}`).update(obj);
  }

  getFileUrl(id: string, file: File): Observable<any> {
    const accountId = this.config.getConfig().accountId;
    const path = `accounts/${accountId}/collaborations/${id}/documents/${file.path}`;
    return this.storage.ref(path).getDownloadURL();
  }
}