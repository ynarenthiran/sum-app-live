import {
  Component, OnInit, ContentChildren, ViewChild,
  Directive, Input, QueryList, ViewContainerRef, OnChanges,
  ElementRef, NgZone, Inject, AfterContentInit, AfterContentChecked
} from '@angular/core';
import { TileBase } from '../tiles/tiles.component';

@Directive({
  selector: '[appDashboardTileHost]'
})
export class PageTileHost implements OnChanges {
  @Input()
  tile: PageTileInstance;

  constructor(private vc: ViewContainerRef) { }

  ngOnChanges() {
    if (this.vc.length < 1) {
      this.vc.createEmbeddedView(this.tile.definition.content, { '$implicit': this.tile });
    }
  }
}
@Directive({
  selector: '[appDashboardTileSettingsHost]'
})
export class PageTileSettingsHost implements OnChanges {
  @Input()
  tile: PageTileInstance;

  constructor(private vc: ViewContainerRef) { }

  ngOnChanges() {
    if (this.vc.length < 1) {
      this.vc.createEmbeddedView(this.tile.definition.settings, { '$implicit': this.tile });
    }
  }
}

@Directive({
  selector: 'app-dashboard-page-tile'
})
export class PageTileInstance implements OnChanges, AfterContentChecked {
  @Input()
  icon?: string;
  @Input()
  title?: string;
  @Input()
  description?: string;
  @Input()
  width?: number = 1;
  @Input()
  height?: number = 1;

  @Input()
  definitionId: string;

  @Input()
  context?: any;

  private data: any = {};
  private isDataValid = false;

  set definition(value: TileBase) {
    this._definition = value;
    if (value) {
      this._definition.refresh.subscribe(() => {
        this.isDataValid = false;
      });
    }
  }
  get definition(): TileBase {
    return this._definition;
  }
  private _definition: TileBase;

  constructor() { }

  ngOnChanges() {
    this.isDataValid = false;
  }

  ngAfterContentChecked() {
    if (!this.isDataValid) {
      this.refresh();
    }
  }

  private refresh() {
    if (this.definition) {
      this.data = this.definition.getData(this.context);
      if (this.data)
        this.isDataValid = true;
    }
  }
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './page.html',
  styleUrls: ['./page.component.scss']
})
export class DashboardPage implements AfterContentChecked {
  /*private gridsterOptions = {
    lanes: 12,
    direction: 'vertical',
    dragAndDrop: false,
    resizable: false,
    shrink: true,
    useCSSTransforms: true,
    responsiveView: true,
    responsiveToParent: true,
  };*/

  @ContentChildren(PageTileInstance)
  tileInstances: QueryList<PageTileInstance>;

  @ContentChildren(TileBase)
  tileDefinitions: QueryList<TileBase>;

  //@ViewChild(GridsterComponent)
  //grid: GridsterComponent;

  constructor() { }

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