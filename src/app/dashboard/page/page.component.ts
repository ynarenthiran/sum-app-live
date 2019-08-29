import { Component, OnInit, ContentChildren, ViewChild, Directive, Input, QueryList, ViewContainerRef, OnChanges } from '@angular/core';
import { TileBase } from '../tiles/tiles.component';
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
      this.vc.createEmbeddedView(this.tile.definition.content, { '$implicit': this.tile.context });
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
  private gridsterOptions = {
    lanes: 12,
    direction: 'vertical',
    dragAndDrop: true,
    resizable: true,
    shrink: true,
    useCSSTransforms: true,
    responsiveView: true,
    responsiveToParent: true,
  };

  @ViewChild(GridsterComponent)
  grid: GridsterComponent;

  @ContentChildren(PageTileInstance)
  tileInstances: QueryList<PageTileInstance>;

  @ContentChildren(TileBase)
  tileDefinitions: QueryList<TileBase>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.grid.reload();
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