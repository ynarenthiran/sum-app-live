import {
  Component, OnInit, Directive, ContentChild, TemplateRef, Input, ElementRef, ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app.config';

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
  set path(value: string) {
    this.collection$ = this.getCollection(value);
  }

  @ContentChild(TileCollectionTemplate)
  template: TileCollectionTemplate;

  @ViewChild('contents')
  contents: ElementRef;

  constructor(private hostEl: ElementRef, private db: AngularFirestore, private config: AppConfigService) { }

  ngOnInit() {
  }

  getCollection(path: string): Observable<any[]> {
    return this.db.collection('accounts/' + this.config.getConfig().accountId + '/' + path)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const rec = a.payload.doc.data();
          return Object.assign(rec, { id: a.payload.doc.id });
        }))
      );
  }

  scrollLeft() {
    this.contents.nativeElement.scrollLeft -= 100;
  }
  scrollRight() {
    this.contents.nativeElement.scrollLeft += 100;
  }
}
