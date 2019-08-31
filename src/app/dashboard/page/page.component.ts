import { Component, OnInit, ContentChildren, ViewChild, Directive, Input, QueryList, ViewContainerRef, OnChanges, ElementRef } from '@angular/core';
import { TileBase } from '../tiles/tiles.component';
import { TableColumnType } from 'src/app/collaboration/util/common';
import { GridsterComponent } from 'angular2gridster';

@Directive({
  selector: '[appDashboardPageHost]'
})
export class PageTileHost implements OnChanges {
  @Input()
  tile: PageTileInstance;

  constructor(private vc: ViewContainerRef) {
  }

  ngOnChanges() {
    if (this.vc.length < 1) {
      this.vc.createEmbeddedView(this.tile.definition.content, { '$implicit': this.tile });
    }
  }
}

@Directive({
  selector: 'app-dashboard-page-tile'
})
export class PageTileInstance {
  @Input()
  icon: string;
  @Input()
  title: string;
  @Input()
  description: string;
  @Input()
  width: number;
  @Input()
  height: number;

  @Input()
  definitionId: string;

  @Input()
  context?: string;

  definition: TileBase;

  constructor() {
  }
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './page.html',
  styleUrls: ['./page.component.scss']
})
export class DashboardPage implements OnInit {
  @ContentChildren(PageTileInstance)
  tileInstances: QueryList<PageTileInstance>;

  @ContentChildren(TileBase)
  tileDefinitions: QueryList<TileBase>;

  @ViewChild('table')
  table: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
  }

  ngAfterContentChecked() {
    this.initializeTileInstances();
  }

  private initializeTileInstances() {
    this.tileInstances.forEach((instance) => {
      if (!instance.definition) {
        instance.definition = this.tileDefinitions.find((item) => item.id == instance.definitionId);
      }
    });
  }
}