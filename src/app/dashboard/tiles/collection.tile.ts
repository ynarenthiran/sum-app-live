import {
  Component, OnInit, Directive, ContentChild, TemplateRef, Input,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface User {
  id: string;
  displayName: string;
  email: string;
}

@Directive({
  selector: '[libTileCollectionTemplate]'
})
export class TileCollectionTemplate {
  constructor(public templateRef: TemplateRef<any>) {
  }
}

@Component({
  selector: 'lib-tile-collection',
  templateUrl: './collection.tile.html'
})
export class TileCollection implements OnInit {
  collection$: Observable<any[]>;

  @Input()
  set path(value: string) {
    this.collection$ = this.getCollection(value);
  }

  @ContentChild(TileCollectionTemplate)
  template: TileCollectionTemplate;

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
  }

  getCollection(path: string): Observable<any[]> {
    return this.db.collection(path)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const rec = a.payload.doc.data();
          return Object.assign(rec, { id: a.payload.doc.id });
        }))
      );
  }
}
