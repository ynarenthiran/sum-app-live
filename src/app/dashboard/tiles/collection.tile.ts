import {
  Component, OnInit, Directive, ContentChild, TemplateRef, Input, ElementRef, ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/services/app.config';
import { AuthService } from 'src/app/authentication/auth.service';

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
  set collection(value: Observable<any[]>) {
    this.collection$ = value;
  }

  @ContentChild(TileCollectionTemplate)
  template: TileCollectionTemplate;

  @ViewChild('contents')
  contents: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  scrollLeft() {
    this.contents.nativeElement.scrollLeft -= 100;
  }
  scrollRight() {
    this.contents.nativeElement.scrollLeft += 100;
  }
}
