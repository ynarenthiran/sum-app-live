import {
  Component, OnInit, Directive, ContentChild, TemplateRef,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Directive({
  selector: '[libTileListTemplate]'
})
export class TileListTemplate {
  constructor(public templateRef: TemplateRef<any>) {
  }
}

@Component({
  selector: 'lib-tile-list',
  templateUrl: './list.tile.html'
})
export class TileList implements OnInit {
  list$: Observable<any[]>;

  @ContentChild(TileListTemplate)
  template: TileListTemplate;

  constructor(private router: Router) { }

  ngOnInit() {
    this.list$ = this.getList();
  }

  getList(): Observable<any> {
    let entries: [];
    this.router.config.forEach((route) => {
      
    });
    return of(this.router.config);
  }
}
