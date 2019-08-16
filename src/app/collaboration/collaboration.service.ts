import { Injectable } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { map, flatMap, concatAll, distinct } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { DialogService } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ObjectDialogService } from '../object/object.component';
import { ObjectService, ObjectTypeClass } from '../object/object.service';

export interface Status {
  id: string;
  name: string;
  description: string;
}

export interface AbstractObject {
  typeId?: string;
  status?: object;
  action?: object;
  attributes?: object;
}
export interface Collaboration extends AbstractObject {
  id: string;
  name: string;
  description: string;
  createdByUid: string;
  createdOn: Date;
}
export interface Member extends AbstractObject {
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
export interface File extends AbstractObject {
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
export interface Post extends AbstractObject {
  id: string;
  text: string;
  authorUid: string;
  postedOn: Date;
  // Transient fields
  postedBySelf: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  constructor(private db: AngularFirestore, private storage: AngularFireStorage, private func: AngularFireFunctions,
    private config: AppConfigService, private auth: AuthService, private dialog: DialogService, private objDialogSrv: ObjectDialogService,
    private objSrv: ObjectService, private router: Router) { }

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

  getCollaborations(): Observable<Collaboration[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    return this.db.collection(`accounts/${accountId}/users/${userId}/collaborations`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const id = a.payload.doc.id;
          return this.db.doc(`accounts/${accountId}/collaborations/${id}`)
            .snapshotChanges()
            .pipe(
              map(action => {
                const coll = action.payload.data() as Collaboration;
                return Object.assign(coll, { id: action.payload.id }) as Collaboration;
              })
            );
        })),
        flatMap(collaborations => combineLatest(collaborations))
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
    const callable = this.func.httpsCallable('onCreateCollaboration');
    const accountId = this.config.getConfig().accountId;
    const result$ = callable({
      accountId: accountId,
      name: collaboration.name,
      description: collaboration.description,
      typeId: collaboration.typeId,
      attributes: collaboration.attributes
    });
    result$.subscribe(
      (collaborationId) => {
        onSuccess(collaborationId);
      },
      (e) => {
        onError(e);
      });
  }

  createCollaborationDialog() {
    var collaborationTypes$ =
      this.objSrv.getObjectTypes('collaborationTypes')
        .pipe(map(types => types.map(type => new ObjectTypeClass(type))));
    this.dialog.openDialog({ Name: "", Description: "", Type: "" },
      {
        title: "Create Collaboration",
        width: "400px",
        button: { ok: "Create", cancel: "Cancel" },
        values: { Type: collaborationTypes$ }
      })
      .subscribe((result) => {
        this.objSrv.getObjectType('collaborationTypes', result.Type.id).subscribe((type) => {
          if (type.objectTypeId) {
            this.objDialogSrv.openObjectDialog(type.objectTypeId,
              {
                title: "Create Collaboration",
                width: "400px",
                button: { ok: "Create", cancel: "Cancel" }
              })
              .subscribe((attributes) => {
                this.createCollaborationWithData({
                  name: result.Name, description: result.Description, typeId: result.Type.id, attributes: attributes
                });
              });
          }
          else {
            this.createCollaborationWithData({
              name: result.Name, description: result.Description, typeId: result.Type.id
            });
          }
        })
      });
  }
  createCollaborationWithData(data: any) {
    const collaboration: Collaboration = Object.assign({} as Collaboration, data);
    this.postCollaboration(collaboration,
      (id) => {
        this.router.navigate(['collaboration', id]);
      },
      (e) => {
        window.alert("Error: " + e);
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
      tags: member.tags,
      typeId: (member.typeId) ? member.typeId : "",
      attributes: (member.attributes) ? member.attributes : {}
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
      tags: [],
      typeId: (file.typeId) ? file.typeId : "",
      attributes: (file.attributes) ? file.attributes : {}
    }
    return this.db.collection(`accounts/${accountId}/collaborations/${id}/documents`)
      .add(obj);
  }

  postFiles(id: string, folder: File, files: any[], typeId?: string, attributes?: any) {
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
        tags: [],
        typeId: (typeId) ? typeId : "",
        attributes: (attributes) ? attributes : {}
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

  triggerAction(id: string, actionId: string) {
    const callable = this.func.httpsCallable('onCompleteCollaborationAction');
    const accountId = this.config.getConfig().accountId;
    const result$ = callable({ accountId: accountId, objectId: id, actionId: actionId });
    result$.subscribe(() => {
      alert("Action completed");
    })
  }

  getPosts(id: string): Observable<Post[]> {
    const accountId = this.config.getConfig().accountId;
    return this.db.collection<Post>(`accounts/${accountId}/collaborations/${id}/posts`,
      ref => ref.orderBy('postedOn'))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const col = a.payload.doc.data() as Post;
          return Object.assign(col, {
            id: a.payload.doc.id,
            postedBySelf: (col.authorUid == this.auth.currentUserId) ? true : false
          });
        }))
      );
  }
  createPost(id: string, p: Post) {
    const accountId = this.config.getConfig().accountId;
    const obj = {
      text: p.text,
      authorUid: this.auth.currentUserId,
      postedOn: new Date(),
      typeId: (p.typeId) ? p.typeId : "",
      attributes: (p.attributes) ? p.attributes : {}
    };
    this.db.collection(`accounts/${accountId}/collaborations/${id}/posts`).add(obj);
  }

}