import {
  Component, OnInit, Directive, ContentChild, TemplateRef, Input, ElementRef, ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app.config';
import { AuthService } from 'src/app/authentication/auth.service';
import { Collaboration } from 'src/app/collaboration/collaboration.service';

@Directive({
  selector: '[libTileCollectionTemplate]'
})
export class TileCollectionTemplate {
  constructor(public templateRef: TemplateRef<any>) {
  }
}

@Component({
  selector: 'lib-tile-collection',
  templateUrl: './collection.tile.html',
  styleUrls: ['./collection.tile.scss']
})
export class TileCollection implements OnInit {
  collection$: Observable<any[]>;

  @Input()
  set collection(value: string) {
    this.collection$ = this.getCollection(value);
  }

  @ContentChild(TileCollectionTemplate)
  template: TileCollectionTemplate;

  @ViewChild('contents')
  contents: ElementRef;

  constructor(private hostEl: ElementRef, private db: AngularFirestore, private config: AppConfigService, private auth: AuthService) { }

  ngOnInit() {
  }

  getCollection(path: string): Observable<any[]> {
    const accountId = this.config.getConfig().accountId;
    const userId = this.auth.currentUserId;
    return this.db.collection(`accounts/${accountId}/users/${userId}/${path}`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const rec = a.payload.doc.data();
          const id = a.payload.doc.id;
          return this.db.doc<Collaboration>(`accounts/${accountId}/collaborations/${a.payload.doc.id}`)
            .snapshotChanges()
            .pipe(
              map(action => {
                const user = action.payload.data() as Collaboration;
                return Object.assign(rec, { id: action.payload.id, user: user });
              })
            );
        })),
        flatMap(collaborations => combineLatest(collaborations))
      );
  }

  scrollLeft() {
    this.contents.nativeElement.scrollLeft -= 100;
  }
  scrollRight() {
    this.contents.nativeElement.scrollLeft += 100;
  }
}
