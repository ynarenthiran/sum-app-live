import {
  Component, OnInit, Directive, ContentChild, TemplateRef,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/auth.service';

interface User {
  id: string;
  displayName: string;
  email: string;
}

@Directive({
  selector: '[libTileUserTemplate]'
})
export class TileUserTemplate {
  constructor(public templateRef: TemplateRef<any>) {
  }
}

@Component({
  selector: 'lib-tile-user',
  templateUrl: './user.tile.html'
})
export class TileUser implements OnInit {
  user$: Observable<User>;

  @ContentChild(TileUserTemplate)
  template: TileUserTemplate;

  constructor(private srv: AuthService, private db: AngularFirestore) { }

  ngOnInit() {
    this.user$ = this.getUser();
  }

  getUser(): Observable<User> {
    return this.db.doc<User>(`users/${this.srv.currentUserId}`)
      .snapshotChanges()
      .pipe(
        map(a => {
          const usr = a.payload.data() as User;
          return Object.assign(usr, { id: a.payload.id });
        })
      );
  }
}
